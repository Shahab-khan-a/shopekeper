import { WebStorageAdapter } from '@/storage/db/WebStorageAdapter';
import { SaleRepository } from '@/storage/repositories/SaleRepository';
import { CustomerRepository } from '@/storage/repositories/CustomerRepository';
import { CartItem, Product } from '@/types';
import { getPaymentBreakdown } from '@/utils/payment';

// Enhanced WebStorageAdapter with transaction rollback snapshot support for unit testing
class TestStorageAdapter extends WebStorageAdapter {
  async transaction<T>(action: (adapter: any) => Promise<T>): Promise<T> {
    // Snapshot memoryStore before transaction
    const snapshot = new Map<string, Map<string, any>>();
    const memStore = (this as any).memoryStore as Map<string, Map<string, any>>;
    for (const [storeName, map] of memStore.entries()) {
      const copyMap = new Map();
      for (const [k, v] of map.entries()) {
        copyMap.set(k, JSON.parse(JSON.stringify(v)));
      }
      snapshot.set(storeName, copyMap);
    }

    try {
      return await action(this);
    } catch (err) {
      // Rollback memoryStore to snapshot on error
      (this as any).memoryStore = snapshot;
      throw err;
    }
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING SPLIT PAYMENT & CHECKOUT ENGINE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
      failed++;
    }
  }

  const sampleProduct: Product = {
    id: 'prod-wheat-50',
    name: 'Wheat Flour 50kg',
    nameUrdu: 'گندم آٹا',
    price: 1500,
    costPrice: 1200,
    stock: 20,
    category: 'Grocery',
    unit: 'kg',
    barcode: '12345678',
    syncStatus: 'synced',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const sampleCartItem: CartItem = {
    productId: sampleProduct.id,
    product: sampleProduct,
    quantity: 1,
    unitPrice: 1500,
    total: 1500,
    costPrice: 1200,
  };

  // -------------------------------------------------------------------------
  // TEST 1: 1500 bill, 800 cash, customer selected: sale saved, khata +700
  // -------------------------------------------------------------------------
  console.log('--- TEST 1: 1500 bill, 800 cash, customer selected ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    // Insert product
    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.stock, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    // Insert customer with initial balance 300
    const custId = 'cust-ali-1';
    await db.run(
      `INSERT INTO customers (id, name, phone, balance, syncStatus, createdAt, updatedAt)
       VALUES (?, 'Ali Khan', '03001234567', 300, 'synced', ?, ?)`,
      [custId, Date.now(), Date.now()]
    );

    const result = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'cash',
        tenderedCash: 800,
        customerId: custId,
        customerName: 'Ali Khan',
        customerPhone: '03001234567',
      },
      db
    );

    assert(result.success === true, 'Test 1.1: Sale succeeds');
    assert(result.sale?.total === 1500, 'Test 1.2: Sale total is 1500');
    assert(result.sale?.amountPaid === 800, 'Test 1.3: Sale amountPaid is 800');
    assert(result.sale?.paymentMethod === 'udhaar', 'Test 1.4: paymentMethod set to udhaar when baki > 0');

    // Check customer balance: 300 + 700 = 1000
    const cust = await db.get<any>(`SELECT * FROM customers WHERE id = ?`, [custId]);
    assert(cust?.balance === 1000, `Test 1.5: Customer balance increased by baki (700) to 1000 (actual: ${cust?.balance})`);

    // Check khata_transactions: 1 credit row of 700
    const ktxRows = await db.all<any>(`SELECT * FROM khata_transactions WHERE customerId = ?`, [custId]);
    assert(ktxRows.length === 1, 'Test 1.6: Exactly 1 khata_transaction row');
    assert(ktxRows[0]?.amount === 700, `Test 1.7: khata_transaction amount is 700 (baki only, not full bill) (actual: ${ktxRows[0]?.amount})`);
    assert(ktxRows[0]?.type === 'credit', 'Test 1.8: khata_transaction type is credit');
    assert(ktxRows[0]?.saleId === result.sale?.id, 'Test 1.9: khata_transaction has saleId');

    // Check payments table: 1 cash row of 800
    const pmtRows = await db.all<any>(`SELECT * FROM payments WHERE saleId = ?`, [result.sale?.id]);
    assert(pmtRows.length === 1, 'Test 1.10: Exactly 1 payment row for cash received');
    assert(pmtRows[0]?.amount === 800, `Test 1.11: payment amount is 800 (actual: ${pmtRows[0]?.amount})`);
    assert(pmtRows[0]?.customerId === custId, 'Test 1.12: payment has customerId');

    // Check sync_queue: customer update, khata create, payment create, sale create
    const queueRows = await db.all<any>(`SELECT * FROM sync_queue`);
    const hasCustSync = queueRows.some((q) => q.entityType === 'customer' && q.operation === 'update');
    const hasKtxSync = queueRows.some((q) => q.entityType === 'khata_transaction' && q.operation === 'create');
    const hasPmtSync = queueRows.some((q) => q.entityType === 'payment' && q.operation === 'create');
    const hasSaleSync = queueRows.some((q) => q.entityType === 'sale' && q.operation === 'create');
    assert(hasCustSync && hasKtxSync && hasPmtSync && hasSaleSync, 'Test 1.13: sync_queue enqueued for customer, khata, payment, and sale');

    // Check stock was deducted: 20 - 1 = 19
    const prodAfter = await db.get<any>(`SELECT * FROM products WHERE id = ?`, [sampleProduct.id]);
    assert(prodAfter?.stock === 19, `Test 1.14: Product stock deducted to 19 (actual: ${prodAfter?.stock})`);
  }

  // -------------------------------------------------------------------------
  // TEST 2: 1500 bill, 800 cash, no customer: blocked with clear message
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 2: 1500 bill, 800 cash, no customer ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.stock, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    const result = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'cash',
        tenderedCash: 800,
        // No customerId, customerName, or customerPhone
      },
      db
    );

    assert(result.success === false, 'Test 2.1: Split sale without customer is rejected');
    assert(
      (result.error || '').toLowerCase().includes('customer') && (result.error || '').toLowerCase().includes('required'),
      `Test 2.2: Rejection message explains customer required (got: "${result.error}")`
    );

    // Verify nothing persisted
    const sales = await db.all<any>(`SELECT * FROM sales`);
    const payments = await db.all<any>(`SELECT * FROM payments`);
    const ktx = await db.all<any>(`SELECT * FROM khata_transactions`);
    assert(sales.length === 0, 'Test 2.3: No sale row inserted');
    assert(payments.length === 0, 'Test 2.4: No payment row inserted');
    assert(ktx.length === 0, 'Test 2.5: No khata row inserted');
  }

  // -------------------------------------------------------------------------
  // TEST 3: Full cash sale: unchanged
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3: Full cash sale (1500 bill, 1500 cash) ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.stock, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    const result = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'cash',
        tenderedCash: 2000, // Customer handed Rs. 2000 note
      },
      db
    );

    assert(result.success === true, 'Test 3.1: Full cash sale succeeds');
    assert(result.sale?.total === 1500, 'Test 3.2: Total is 1500');
    assert(result.sale?.amountPaid === 1500, `Test 3.3: amountPaid is capped at 1500 (change not counted as paid) (actual: ${result.sale?.amountPaid})`);
    assert(result.sale?.change === 500, `Test 3.4: Change is 500 (actual: ${result.sale?.change})`);
    assert(result.sale?.paymentMethod === 'cash', 'Test 3.5: paymentMethod remains cash');

    const pmtRows = await db.all<any>(`SELECT * FROM payments WHERE saleId = ?`, [result.sale?.id]);
    assert(pmtRows.length === 1, 'Test 3.6: 1 payment row for cash received');
    assert(pmtRows[0]?.amount === 1500, `Test 3.7: Payment row amount is 1500 (actual: ${pmtRows[0]?.amount})`);

    const ktxRows = await db.all<any>(`SELECT * FROM khata_transactions`);
    assert(ktxRows.length === 0, 'Test 3.8: No khata transaction for cash sale');
  }

  // -------------------------------------------------------------------------
  // TEST 4: Full udhaar sale: khata +1500, amountPaid 0
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 4: Full udhaar sale (1500 bill, 0 cash) ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.stock, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    const custId = 'cust-bilal-2';
    await db.run(
      `INSERT INTO customers (id, name, phone, balance, syncStatus, createdAt, updatedAt)
       VALUES (?, 'Bilal Ahmad', '03119876543', 0, 'synced', ?, ?)`,
      [custId, Date.now(), Date.now()]
    );

    const result = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'udhaar',
        tenderedCash: 0,
        customerId: custId,
        customerName: 'Bilal Ahmad',
        customerPhone: '03119876543',
      },
      db
    );

    assert(result.success === true, 'Test 4.1: Full udhaar sale succeeds');
    assert(result.sale?.total === 1500, 'Test 4.2: Total is 1500');
    assert(result.sale?.amountPaid === 0, `Test 4.3: amountPaid is 0 (actual: ${result.sale?.amountPaid})`);
    assert(result.sale?.paymentMethod === 'udhaar', 'Test 4.4: paymentMethod is udhaar');

    // Customer balance: 0 + 1500 = 1500
    const cust = await db.get<any>(`SELECT * FROM customers WHERE id = ?`, [custId]);
    assert(cust?.balance === 1500, `Test 4.5: Customer balance is 1500 (actual: ${cust?.balance})`);

    // khata_transactions: 1 credit row of 1500
    const ktxRows = await db.all<any>(`SELECT * FROM khata_transactions WHERE customerId = ?`, [custId]);
    assert(ktxRows.length === 1 && ktxRows[0]?.amount === 1500, 'Test 4.6: khata_transaction of 1500');

    // payments: 0 rows when amountPaid === 0
    const pmtRows = await db.all<any>(`SELECT * FROM payments WHERE saleId = ?`, [result.sale?.id]);
    assert(pmtRows.length === 0, `Test 4.7: No payment row created when amountPaid is 0 (count: ${pmtRows.length})`);
  }

  // -------------------------------------------------------------------------
  // TEST 5: Simulated failure mid-transaction: nothing persisted
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 5: Simulated failure mid-transaction ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    // Insert product with only 0 stock
    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 0, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    const custId = 'cust-usman-3';
    await db.run(
      `INSERT INTO customers (id, name, phone, balance, syncStatus, createdAt, updatedAt)
       VALUES (?, 'Usman', '03221112233', 500, 'synced', ?, ?)`,
      [custId, Date.now(), Date.now()]
    );

    // Try to complete sale with requested quantity 1 when stock is 0
    const result = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'cash',
        tenderedCash: 800,
        customerId: custId,
        customerName: 'Usman',
      },
      db
    );

    assert(result.success === false, 'Test 5.1: Fails due to stock shortage');
    assert((result.error || '').includes('Insufficient stock'), `Test 5.2: Error mentions Insufficient stock (got: "${result.error}")`);

    // Verify atomic rollback: customer balance untouched (still 500), no sales, no payments, no khata transactions
    const custAfter = await db.get<any>(`SELECT * FROM customers WHERE id = ?`, [custId]);
    assert(custAfter?.balance === 500, `Test 5.3: Customer balance untouched (expected: 500, actual: ${custAfter?.balance})`);

    const sales = await db.all<any>(`SELECT * FROM sales`);
    assert(sales.length === 0, 'Test 5.4: 0 sales persisted');

    const payments = await db.all<any>(`SELECT * FROM payments`);
    assert(payments.length === 0, 'Test 5.5: 0 payments persisted');

    const ktx = await db.all<any>(`SELECT * FROM khata_transactions`);
    assert(ktx.length === 0, 'Test 5.6: 0 khata transactions persisted');
  }

  // -------------------------------------------------------------------------
  // TEST 6: Split sale totals in History, Receipt, and Customer Khata balance
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 6: Split sale in History, Receipt, & Khata balance ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.stock, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    const custId = 'cust-tariq-4';
    await db.run(
      `INSERT INTO customers (id, name, phone, balance, syncStatus, createdAt, updatedAt)
       VALUES (?, 'Tariq Mehmood', '03445556677', 100, 'synced', ?, ?)`,
      [custId, Date.now(), Date.now()]
    );

    // 1500 bill, 800 paid, 700 udhaar
    const result = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'cash',
        tenderedCash: 800,
        customerId: custId,
        customerName: 'Tariq Mehmood',
        customerPhone: '03445556677',
      },
      db
    );

    // 1. History verification: SaleRepository.getAll()
    const historySales = await SaleRepository.getAll(db);
    const saleInHistory = historySales.find((s) => s.id === result.sale?.id);
    assert(saleInHistory !== undefined, 'Test 6.1: Sale retrieved in history list');
    assert(saleInHistory?.grandTotal === 1500, `Test 6.2: History grandTotal is 1500 (actual: ${saleInHistory?.grandTotal})`);
    assert(saleInHistory?.amountPaid === 800, `Test 6.3: History amountPaid is 800 (actual: ${saleInHistory?.amountPaid})`);
    const historyBaki = (saleInHistory?.grandTotal || 0) - (saleInHistory?.amountPaid || 0);
    assert(historyBaki === 700, `Test 6.4: History calculated baki is 700 (actual: ${historyBaki})`);
    assert(saleInHistory?.paymentMethod === 'udhaar', 'Test 6.5: History paymentMethod is udhaar');

    // 2. Customer Khata verification: CustomerRepository.getById()
    const customerKhata = await CustomerRepository.getById(custId, db);
    assert(customerKhata?.balance === 800, `Test 6.6: Customer balance is 100 + 700 = 800 (actual: ${customerKhata?.balance})`);
    const saleKtx = customerKhata?.transactions.find((t) => t.saleId === result.sale?.id);
    assert(saleKtx?.amount === 700, `Test 6.7: Ledger entry amount is 700 (actual: ${saleKtx?.amount})`);
    assert(saleKtx?.type === 'credit', 'Test 6.8: Ledger entry is credit');

    // 3. Shared payment breakdown helper verification
    const breakdown = getPaymentBreakdown(saleInHistory!);
    assert(breakdown.isSplit === true, 'Test 6.9: getPaymentBreakdown detects isSplit === true');
    assert(breakdown.cleanPaid === 800, `Test 6.10: getPaymentBreakdown cleanPaid is 800 (actual: ${breakdown.cleanPaid})`);
    assert(breakdown.baki === 700, `Test 6.11: getPaymentBreakdown baki is 700 (actual: ${breakdown.baki})`);
  }

  // -------------------------------------------------------------------------
  // TEST 7: Legacy cash sale clamping (amountPaid > grandTotal)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 7: Legacy sale clamping (amountPaid = 2000 on 1500 bill) ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    const legacySaleId = 'sale-legacy-1';
    const now = Date.now();
    // Simulate legacy sale inserted before clamping, storing tendered cash (2000) as amountPaid
    await db.run(
      `INSERT INTO sales (
        id, invoiceNumber, subtotal, discount, discountType, total, totalProfit, paymentMethod,
        customerId, customerName, customerPhone, amountPaid, change, status,
        refundReason, refundedAt, notes, createdAt, updatedAt, syncStatus
      ) VALUES (?, 'INV-999', 1500, 0, 'fixed', 1500, 300, 'cash', NULL, NULL, NULL, 2000, 500, 'completed', NULL, NULL, NULL, ?, ?, 'synced')`,
      [legacySaleId, now, now]
    );

    const historySales = await SaleRepository.getAll(db);
    const sale = historySales.find((s) => s.id === legacySaleId);
    assert(sale !== undefined, 'Test 7.1: Legacy sale loaded');
    assert(sale?.grandTotal === 1500, `Test 7.2: Grand total is 1500`);
    assert(sale?.amountPaid === 1500, `Test 7.3: amountPaid capped at 1500 (actual: ${sale?.amountPaid})`);
    const breakdown = getPaymentBreakdown(sale!);
    assert(breakdown.cleanPaid === 1500, `Test 7.4: getPaymentBreakdown cleanPaid is 1500 (actual: ${breakdown.cleanPaid})`);
    assert(breakdown.baki === 0, `Test 7.5: getPaymentBreakdown baki is 0 (never negative) (actual: ${breakdown.baki})`);
    assert(sale?.change === 500, `Test 7.6: Change remains 500`);
    assert(breakdown.isSplit === false, 'Test 7.7: getPaymentBreakdown not classified as split payment');
  }

  // -------------------------------------------------------------------------
  // TEST 8: Refund of a split sale reverses khata and deletes payment row
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 8: Refund of a split sale (reverses khata and deletes payment row) ---');
  {
    const db = new TestStorageAdapter();
    await db.init();

    await db.run(
      `INSERT INTO products (id, name, price, costPrice, stock, category, unit, syncStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
      [sampleProduct.id, sampleProduct.name, sampleProduct.price, sampleProduct.costPrice, sampleProduct.stock, sampleProduct.category, sampleProduct.unit, Date.now(), Date.now()]
    );

    const custId = 'cust-refund-test';
    await db.run(
      `INSERT INTO customers (id, name, phone, balance, syncStatus, createdAt, updatedAt)
       VALUES (?, 'Refund Customer', '03009998877', 500, 'synced', ?, ?)`,
      [custId, Date.now(), Date.now()]
    );

    // Make 1500 sale: 800 cash + 700 udhaar
    const saleRes = await SaleRepository.completeSaleTransaction(
      {
        items: [sampleCartItem],
        paymentMethod: 'cash',
        tenderedCash: 800,
        customerId: custId,
        customerName: 'Refund Customer',
      },
      db
    );

    const saleId = saleRes.sale?.id!;
    // Balance was 500 + 700 = 1200
    const custBeforeRefund = await db.get<any>(`SELECT * FROM customers WHERE id = ?`, [custId]);
    assert(custBeforeRefund?.balance === 1200, `Test 8.1: Customer balance increased to 1200`);

    const pmtBeforeRefund = await db.all<any>(`SELECT * FROM payments WHERE saleId = ?`, [saleId]);
    assert(pmtBeforeRefund.length === 1 && pmtBeforeRefund[0].amount === 800, 'Test 8.2: 1 payment row of 800 exists before refund');

    // Perform refund
    const refundRes = await SaleRepository.refundSaleTransaction(saleId, 'Customer Returned Goods', db);
    assert(refundRes.success === true, 'Test 8.3: Refund transaction succeeds');

    // Customer balance should be reversed by 700: 1200 - 700 = 500
    const custAfterRefund = await db.get<any>(`SELECT * FROM customers WHERE id = ?`, [custId]);
    assert(custAfterRefund?.balance === 500, `Test 8.4: Customer balance reversed to original 500 (actual: ${custAfterRefund?.balance})`);

    // Payments row for this sale must be DELETED so day-end cash drawer doesn't count returned money
    const pmtAfterRefund = await db.all<any>(`SELECT * FROM payments WHERE saleId = ?`, [saleId]);
    assert(pmtAfterRefund.length === 0, `Test 8.5: Payment row for refunded sale deleted from payments table (count: ${pmtAfterRefund.length})`);

    // Sync queue must include payment deletion
    const queue = await db.all<any>(`SELECT * FROM sync_queue WHERE entityType = 'payment' AND operation = 'delete'`);
    assert(queue.length > 0, 'Test 8.6: Payment delete operation enqueued in sync_queue');

    // Sale status must be 'refunded'
    const saleRow = await db.get<any>(`SELECT * FROM sales WHERE id = ?`, [saleId]);
    assert(saleRow?.status === 'refunded', 'Test 8.7: Sale status marked refunded');

    // Stock must be restored: 20 - 1 + 1 = 20
    const prodAfterRefund = await db.get<any>(`SELECT * FROM products WHERE id = ?`, [sampleProduct.id]);
    assert(prodAfterRefund?.stock === 20, `Test 8.8: Stock restored back to 20`);
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test execution error:', err);
  process.exit(1);
});
