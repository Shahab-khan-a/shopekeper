import { getDatabase, IDatabaseAdapter } from '../db';
import {
  Sale,
  CartItem,
  CompleteSaleInput,
  SaleResult,
  RefundResult,
  PaymentMethod,
} from '@/types';
import { SettingsRepository } from './SettingsRepository';
import { SyncQueueRepository } from './SyncQueueRepository';

function mapRowToSale(row: any, items: CartItem[] = []): Sale {
  const grandTotal = Number(row.total || 0);
  // Cap amountPaid at grandTotal so change on legacy cash sales is never counted as paid or resulting in negative baki
  const rawPaid = row.amountPaid !== undefined && row.amountPaid !== null ? Number(row.amountPaid) : grandTotal;
  const amountPaid = Math.min(grandTotal, Math.max(0, rawPaid));

  return {
    id: row.id,
    billNumber: row.invoiceNumber,
    invoiceNumber: row.invoiceNumber,
    date: new Date(row.createdAt).toISOString(),
    customerName: row.customerName || undefined,
    customerPhone: row.customerPhone || undefined,
    customerId: row.customerId || undefined,
    items,
    subtotal: row.subtotal,
    discount: row.discount,
    discountType: row.discountType || 'fixed',
    grandTotal: grandTotal,
    total: grandTotal,
    totalProfit: row.totalProfit,
    paymentMethod: row.paymentMethod,
    amountPaid: amountPaid,
    change: Math.max(0, Number(row.change || 0)),
    status: row.status,
    refundReason: row.refundReason || undefined,
    refundedAt: row.refundedAt || undefined,
    notes: row.notes || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus,
  };
}

const generateUniqueId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const SaleRepository = {
  async getAll(db: IDatabaseAdapter = getDatabase()): Promise<Sale[]> {
    const saleRows = await db.all<any>(`SELECT * FROM sales ORDER BY createdAt DESC`);
    const sales: Sale[] = [];

    for (const sRow of saleRows) {
      const itemRows = await db.all<any>(`SELECT * FROM sale_items WHERE saleId = ?`, [sRow.id]);
      const items: CartItem[] = itemRows.map((it) => ({
        product: {
          id: it.productId,
          name: it.productName,
          nameUrdu: it.productNameUrdu || undefined,
          price: it.unitPrice,
          sellingPrice: it.unitPrice,
          costPrice: it.costPrice,
          stock: 0,
          category: 'Others',
          unit: 'piece',
          createdAt: 0,
          updatedAt: 0,
        },
        productId: it.productId,
        name: it.productName,
        nameUrdu: it.productNameUrdu || undefined,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        costPrice: it.costPrice,
        total: it.total,
      }));
      sales.push(mapRowToSale(sRow, items));
    }

    return sales;
  },

  async getById(id: string, db: IDatabaseAdapter = getDatabase()): Promise<Sale | null> {
    const sRow = await db.get<any>(`SELECT * FROM sales WHERE id = ?`, [id]);
    if (!sRow) return null;

    const itemRows = await db.all<any>(`SELECT * FROM sale_items WHERE saleId = ?`, [id]);
    const items: CartItem[] = itemRows.map((it) => ({
      product: {
        id: it.productId,
        name: it.productName,
        nameUrdu: it.productNameUrdu || undefined,
        price: it.unitPrice,
        sellingPrice: it.unitPrice,
        costPrice: it.costPrice,
        stock: 0,
        category: 'Others',
        unit: 'piece',
        createdAt: 0,
        updatedAt: 0,
      },
      productId: it.productId,
      name: it.productName,
      nameUrdu: it.productNameUrdu || undefined,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      costPrice: it.costPrice,
      total: it.total,
    }));

    return mapRowToSale(sRow, items);
  },

  /**
   * ATOMIC LOCAL SALE TRANSACTION
   * Performs validation, stock deduction, sale & items creation, customer balance update,
   * payment logging, and sync queue enqueueing inside a single atomic database transaction.
   * If any step fails, the entire transaction is rolled back automatically.
   */
  async completeSaleTransaction(
    input: CompleteSaleInput,
    db: IDatabaseAdapter = getDatabase()
  ): Promise<SaleResult> {
    const {
      items,
      paymentMethod,
      discount = 0,
      discountType = 'fixed',
      customerName,
      customerPhone,
      customerId,
      tenderedCash,
      notes,
    } = input;

    // 1. Basic validation
    if (!items || items.length === 0) {
      return { success: false, error: 'Cart is empty. Please add items before completing sale.' };
    }

    // Calculate totals
    const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const discountAmount =
      discountType === 'percent' ? Math.round((subtotal * discount) / 100) : discount;
    const grandTotal = Math.max(0, subtotal - discountAmount);

    // Calculate actual cash received, change, and remaining baki (credit balance)
    let amountPaid = 0;
    let change = 0;
    let baki = 0;

    if (paymentMethod === 'online') {
      amountPaid = grandTotal;
      change = 0;
      baki = 0;
    } else {
      // Cash, Udhaar, or Split
      const tendered =
        tenderedCash !== undefined
          ? Math.max(0, tenderedCash)
          : paymentMethod === 'cash'
          ? grandTotal
          : 0;

      if (tendered >= grandTotal) {
        amountPaid = grandTotal;
        change = tendered - grandTotal;
        baki = 0;
      } else {
        // Split sale or pure udhaar
        amountPaid = tendered;
        change = 0;
        baki = grandTotal - amountPaid;
      }
    }

    // Per user decision:
    // Store paymentMethod = 'udhaar' when baki > 0, amountPaid = cash actually received (capped at grandTotal, so change is never counted as paid). Fully paid cash sales stay 'cash' exactly as now.
    const finalPaymentMethod: PaymentMethod =
      paymentMethod === 'online'
        ? 'online'
        : baki > 0
        ? 'udhaar'
        : 'cash';

    // If baki > 0 (part or full udhaar), customer selection/name/phone is strictly required
    if (baki > 0) {
      if (!customerName?.trim() && !customerPhone?.trim() && !customerId) {
        return {
          success: false,
          error: 'Customer selection or name/phone is required for Credit / Split sales.',
        };
      }
    }

    // Profit calculation: only compute profit when cost price is explicitly known (> 0)
    const totalProfit =
      items.reduce((sum, item) => {
        const cost = item.costPrice ?? item.product?.costPrice;
        if (cost !== undefined && cost !== null && cost > 0) {
          return sum + (item.unitPrice - cost) * item.quantity;
        }
        return sum;
      }, 0) - discountAmount;

    try {
      return await db.transaction<SaleResult>(async (tx) => {
        const now = Date.now();

        // 2. Validate and reserve stock for all products
        const updatedProducts: { id: string; newStock: number }[] = [];

        for (const item of items) {
          const pId = item.productId || item.product.id;
          // Uncataloged / custom counter items (e.g. eggs, loose goods, custom amount) skip inventory deduction
          const isCustom = pId.startsWith('custom-') || (item.product as any)?.isCustom;
          if (isCustom) {
            continue;
          }

          const pRow = await tx.get<any>(`SELECT id, name, stock, unit FROM products WHERE id = ?`, [pId]);

          if (!pRow) {
            // If item is not in catalog table, treat as non-inventory item rather than failing checkout
            continue;
          }

          if (item.quantity > pRow.stock) {
            throw new Error(
              `Insufficient stock for "${pRow.name}". Available: ${pRow.stock} ${pRow.unit || 'units'}, Requested: ${item.quantity}.`
            );
          }

          const newStock = Math.max(0, pRow.stock - item.quantity);
          updatedProducts.push({ id: pId, newStock });
        }

        // 3. Deduct stock from products
        for (const up of updatedProducts) {
          await tx.run(
            `UPDATE products SET stock = ?, updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
            [up.newStock, now, up.id]
          );
        }

        // 4. Generate invoice number and collision-proof unique IDs
        const { invoiceNumber } = await SettingsRepository.getNextInvoiceNumber(tx);
        const saleId = generateUniqueId('sale');

        // 5. Customer & Khata management if baki > 0
        let finalCustomerId: string | null = customerId || null;
        let customerObj: any = null;
        const khataTxId = generateUniqueId('ktx');

        if (baki > 0) {
          const cName = customerName?.trim() || 'Walk-in Customer';
          const cPhone = customerPhone?.trim() || null;

          // Check if customer exists
          let existingCustomer: any = null;
          if (finalCustomerId) {
            existingCustomer = await tx.get<any>(`SELECT * FROM customers WHERE id = ?`, [finalCustomerId]);
          } else if (cPhone) {
            existingCustomer = await tx.get<any>(`SELECT * FROM customers WHERE phone = ?`, [cPhone]);
          }

          if (existingCustomer) {
            finalCustomerId = existingCustomer.id;
            const newBalance = (existingCustomer.balance || 0) + baki;
            await tx.run(
              `UPDATE customers SET balance = ?, phone = COALESCE(?, phone), updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
              [newBalance, cPhone, now, finalCustomerId]
            );
            customerObj = {
              ...existingCustomer,
              balance: newBalance,
              totalDebt: newBalance,
              phone: cPhone || existingCustomer.phone,
              updatedAt: now,
            };
          } else {
            finalCustomerId = generateUniqueId('cust');
            await tx.run(
              `INSERT INTO customers (id, name, nameUrdu, phone, address, balance, createdAt, updatedAt, syncStatus)
               VALUES (?, ?, NULL, ?, NULL, ?, ?, ?, 'pending')`,
              [finalCustomerId, cName, cPhone, baki, now, now]
            );
            customerObj = {
              id: finalCustomerId,
              name: cName,
              phone: cPhone || '',
              balance: baki,
              totalDebt: baki,
              createdAt: now,
              updatedAt: now,
            };
          }

          // Create Khata transaction for baki only
          const khataNote =
            baki === grandTotal
              ? `Credit sale - Bill #${invoiceNumber}`
              : `Split sale (Baki) - Bill #${invoiceNumber} (Total: Rs. ${grandTotal.toLocaleString()}, Cash: Rs. ${amountPaid.toLocaleString()})`;

          await tx.run(
            `INSERT INTO khata_transactions (id, customerId, saleId, type, amount, note, createdAt, syncStatus)
             VALUES (?, ?, ?, 'credit', ?, ?, ?, 'pending')`,
            [khataTxId, finalCustomerId, saleId, baki, khataNote, now]
          );
        }

        // 6. Record Cash or Online payment only when amountPaid > 0
        const paymentId = generateUniqueId('pmt');
        if (amountPaid > 0) {
          await tx.run(
            `INSERT INTO payments (id, customerId, saleId, amount, paymentMethod, createdAt, syncStatus)
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [paymentId, finalCustomerId || 'walk-in', saleId, amountPaid, paymentMethod === 'online' ? 'online' : 'cash', now]
          );
        }

        // 7. Insert Sale record
        await tx.run(
          `INSERT INTO sales (
            id, invoiceNumber, subtotal, discount, discountType, total, totalProfit, paymentMethod,
            customerId, customerName, customerPhone, amountPaid, change, status,
            refundReason, refundedAt, notes, createdAt, updatedAt, syncStatus
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', NULL, NULL, ?, ?, ?, 'pending')`,
          [
            saleId,
            invoiceNumber,
            subtotal,
            discountAmount,
            discountType,
            grandTotal,
            Math.round(totalProfit),
            finalPaymentMethod,
            finalCustomerId,
            customerName?.trim() || null,
            customerPhone?.trim() || null,
            amountPaid,
            change,
            notes || null,
            now,
            now,
          ]
        );

        // 8. Insert Sale Items
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const itemId = generateUniqueId(`item-${i}`);
          const pId = it.productId || it.product.id;
          const cost = it.costPrice ?? it.product.costPrice ?? 0;
          await tx.run(
            `INSERT INTO sale_items (id, saleId, productId, productName, productNameUrdu, quantity, unitPrice, costPrice, total)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              itemId,
              saleId,
              pId,
              it.product.name,
              it.product.nameUrdu || null,
              it.quantity,
              it.unitPrice,
              cost,
              it.total,
            ]
          );
        }

        // 9. Build sale object for return & queue
        const createdSale: Sale = {
          id: saleId,
          billNumber: invoiceNumber,
          invoiceNumber,
          date: new Date(now).toISOString(),
          customerName: customerName?.trim() || undefined,
          customerPhone: customerPhone?.trim() || undefined,
          customerId: finalCustomerId || undefined,
          items,
          subtotal,
          discount: discountAmount,
          discountType,
          grandTotal,
          total: grandTotal,
          totalProfit: Math.round(totalProfit),
          paymentMethod: finalPaymentMethod,
          amountPaid,
          change,
          status: 'completed',
          notes: notes || undefined,
          createdAt: now,
          updatedAt: now,
          syncStatus: 'pending',
        };

        // 10. Enqueue Sync Operations
        const syncOps: {
          entityType: any;
          entityId: string;
          operation: any;
          payload: any;
        }[] = [
          {
            entityType: 'sale',
            entityId: saleId,
            operation: 'create',
            payload: createdSale,
          },
        ];

        // Enqueue product updates
        for (const up of updatedProducts) {
          const fullProd = await tx.get<any>(`SELECT * FROM products WHERE id = ?`, [up.id]);
          if (fullProd) {
            syncOps.push({
              entityType: 'product',
              entityId: up.id,
              operation: 'update',
              payload: fullProd,
            });
          }
        }

        // Enqueue customer & khata update if applicable
        if (customerObj && baki > 0) {
          syncOps.push({
            entityType: 'customer',
            entityId: customerObj.id,
            operation: 'update',
            payload: customerObj,
          });

          const khataNote =
            baki === grandTotal
              ? `Credit sale - Bill #${invoiceNumber}`
              : `Split sale (Baki) - Bill #${invoiceNumber} (Total: Rs. ${grandTotal.toLocaleString()}, Cash: Rs. ${amountPaid.toLocaleString()})`;

          syncOps.push({
            entityType: 'khata_transaction',
            entityId: khataTxId,
            operation: 'create',
            payload: {
              id: khataTxId,
              customerId: finalCustomerId,
              saleId,
              type: 'credit',
              amount: baki,
              note: khataNote,
              createdAt: now,
            },
          });
        }

        if (amountPaid > 0) {
          syncOps.push({
            entityType: 'payment',
            entityId: paymentId,
            operation: 'create',
            payload: {
              id: paymentId,
              customerId: finalCustomerId || 'walk-in',
              saleId,
              amount: amountPaid,
              paymentMethod: paymentMethod === 'online' ? 'online' : 'cash',
              createdAt: now,
            },
          });
        }

        await SyncQueueRepository.enqueueBatch(syncOps, tx);

        return {
          success: true,
          sale: createdSale,
          change,
        };
      });
    } catch (err: any) {
      console.error('[SaleRepository] completeSaleTransaction rolled back:', err);
      return {
        success: false,
        error: err.message || 'Failed to complete sale transaction. Database rolled back.',
      };
    }
  },

  /**
   * ATOMIC SALE REFUND / REVERSAL TRANSACTION
   * Restores stock, marks sale as refunded, reverses Khata balance if Udhaar,
   * creates audit trail, and enqueues sync ops.
   */
  async refundSaleTransaction(
    saleId: string,
    reason: string = 'Customer Return',
    db: IDatabaseAdapter = getDatabase()
  ): Promise<RefundResult> {
    try {
      return await db.transaction<RefundResult>(async (tx) => {
        const now = Date.now();

        // 1. Retrieve sale
        const sRow = await tx.get<any>(`SELECT * FROM sales WHERE id = ?`, [saleId]);
        if (!sRow) {
          return { success: false, error: 'Sale not found.' };
        }

        if (sRow.status === 'refunded') {
          return { success: false, error: 'This bill has already been refunded.' };
        }

        // 2. Retrieve sale items
        const itemRows = await tx.all<any>(`SELECT * FROM sale_items WHERE saleId = ?`, [saleId]);

        // 3. Restore inventory (skip uncataloged custom items)
        const restoredProducts: any[] = [];
        for (const it of itemRows) {
          if (it.productId && !it.productId.startsWith('custom-')) {
            await tx.run(
              `UPDATE products SET stock = stock + ?, updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
              [it.quantity, now, it.productId]
            );
            const fullProd = await tx.get<any>(`SELECT * FROM products WHERE id = ?`, [it.productId]);
            if (fullProd) restoredProducts.push(fullProd);
          }
        }

        // 4. Reverse Khata if Udhaar (reverse baki debt only)
        let customerObj: any = null;
        let reversalTxId: string | null = null;
        let bakiRecorded = 0;

        if (sRow.paymentMethod === 'udhaar' && sRow.customerId) {
          const grandTotal = Number(sRow.total || 0);
          const rawPaid = Number(sRow.amountPaid || 0);
          const cleanPaid = Math.min(grandTotal, Math.max(0, rawPaid));
          bakiRecorded = Math.max(0, grandTotal - cleanPaid);

          if (bakiRecorded > 0) {
            const cust = await tx.get<any>(`SELECT * FROM customers WHERE id = ?`, [sRow.customerId]);
            if (cust) {
              const newBalance = Math.max(0, (cust.balance || 0) - bakiRecorded);
              await tx.run(
                `UPDATE customers SET balance = ?, updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
                [newBalance, now, cust.id]
              );

              reversalTxId = generateUniqueId('ktx-rev');
              await tx.run(
                `INSERT INTO khata_transactions (id, customerId, saleId, type, amount, note, createdAt, syncStatus)
                 VALUES (?, ?, ?, 'reversal', ?, ?, ?, 'pending')`,
                [reversalTxId, cust.id, saleId, bakiRecorded, `Refund reversal for Bill #${sRow.invoiceNumber}: ${reason}`, now]
              );

              customerObj = {
                ...cust,
                balance: newBalance,
                totalDebt: newBalance,
                updatedAt: now,
              };
            }
          }
        }

        // 5. Reverse / Remove any payments recorded for this sale so cash drawer / payments audit does not retain returned money
        const pmtRows = await tx.all<any>(`SELECT * FROM payments WHERE saleId = ?`, [saleId]);
        if (pmtRows.length > 0) {
          await tx.run(`DELETE FROM payments WHERE saleId = ?`, [saleId]);
        }

        // 6. Update Sale record status to 'refunded'
        await tx.run(
          `UPDATE sales SET status = 'refunded', refundReason = ?, refundedAt = ?, updatedAt = ?, syncStatus = 'pending' WHERE id = ?`,
          [reason, now, now, saleId]
        );

        const updatedSale = await this.getById(saleId, tx);

        // 7. Enqueue sync operations
        const syncOps: any[] = [
          {
            entityType: 'sale',
            entityId: saleId,
            operation: 'update',
            payload: updatedSale,
          },
        ];

        for (const pmt of pmtRows) {
          syncOps.push({
            entityType: 'payment',
            entityId: pmt.id,
            operation: 'delete',
            payload: { id: pmt.id },
          });
        }

        for (const p of restoredProducts) {
          syncOps.push({
            entityType: 'product',
            entityId: p.id,
            operation: 'update',
            payload: p,
          });
        }

        if (customerObj && reversalTxId) {
          syncOps.push({
            entityType: 'customer',
            entityId: customerObj.id,
            operation: 'update',
            payload: customerObj,
          });

          syncOps.push({
            entityType: 'khata_transaction',
            entityId: reversalTxId,
            operation: 'create',
            payload: {
              id: reversalTxId,
              customerId: customerObj.id,
              saleId,
              type: 'reversal',
              amount: bakiRecorded,
              note: `Refund reversal for Bill #${sRow.invoiceNumber}: ${reason}`,
              createdAt: now,
            },
          });
        }

        await SyncQueueRepository.enqueueBatch(syncOps, tx);

        return {
          success: true,
          refundedSale: updatedSale || undefined,
        };
      });
    } catch (err: any) {
      console.error('[SaleRepository] refundSaleTransaction error:', err);
      return {
        success: false,
        error: err.message || 'Failed to refund sale. Database rolled back.',
      };
    }
  },
};
