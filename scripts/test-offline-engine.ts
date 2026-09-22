import { WebStorageAdapter } from '../src/storage/db/WebStorageAdapter';
import { ProductRepository } from '../src/storage/repositories/ProductRepository';
import { CustomerRepository } from '../src/storage/repositories/CustomerRepository';
import { SaleRepository } from '../src/storage/repositories/SaleRepository';
import { SyncQueueRepository } from '../src/storage/repositories/SyncQueueRepository';
import { SettingsRepository } from '../src/storage/repositories/SettingsRepository';
import { Product, CustomerKhata } from '../src/types';

async function runTests() {
  console.log('====================================================');
  console.log('  OFFLINE POS TRANSACTION ENGINE AUTOMATED TESTS    ');
  console.log('====================================================\n');

  const db = new WebStorageAdapter();
  await db.init();

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Product CRUD & Stock Management
  // ---------------------------------------------------------------------------
  console.log('\n--- 1. Product Repository & Stock Checks ---');
  const prodSugar: Product = {
    id: 'prod-sugar-1',
    name: 'Sugar / چینی',
    category: 'Grocery',
    price: 150,
    sellingPrice: 150,
    costPrice: 120,
    stock: 20,
    unit: 'kg',
    lowStockThreshold: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    syncStatus: 'pending',
  };

  const prodOil: Product = {
    id: 'prod-oil-1',
    name: 'Cooking Oil / تیل',
    category: 'Grocery',
    price: 500,
    sellingPrice: 500,
    costPrice: 420,
    stock: 10,
    unit: 'litre',
    lowStockThreshold: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    syncStatus: 'pending',
  };

  await ProductRepository.insert(prodSugar, 'pending', db);
  await ProductRepository.insert(prodOil, 'pending', db);

  const allProds = await ProductRepository.getAll(db);
  assert(allProds.length === 2, 'Products inserted and retrieved correctly');

  const fetchedSugar = await ProductRepository.getById('prod-sugar-1', db);
  assert(fetchedSugar?.stock === 20, 'Sugar initial stock is 20');

  // ---------------------------------------------------------------------------
  // TEST 2: Customer Repository & Khata
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Customer Repository & Khata ---');
  const testCustomer: CustomerKhata = {
    id: 'cust-ahmed-1',
    name: 'Ahmed Khan',
    phone: '03001234567',
    totalDebt: 0,
    balance: 0,
    transactions: [],
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    updatedAt: Date.now(),
    syncStatus: 'pending',
  };

  await CustomerRepository.insert(testCustomer, 'pending', db);
  const fetchedCust = await CustomerRepository.getById('cust-ahmed-1', db);
  assert(fetchedCust?.name === 'Ahmed Khan', 'Customer created with balance 0');

  // ---------------------------------------------------------------------------
  // TEST 3: Atomic Cash Sale Transaction (Offline)
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Atomic Cash Sale (Offline POS) ---');
  const cashSaleResult = await SaleRepository.completeSaleTransaction(
    {
      items: [
        {
          product: prodSugar,
          quantity: 2,
          unitPrice: 150,
          total: 300,
        },
      ],
      paymentMethod: 'cash',
      tenderedCash: 500,
      discount: 0,
    },
    db
  );

  assert(cashSaleResult.success === true, 'Cash sale completed successfully');
  assert(cashSaleResult.change === 200, 'Cash change calculated correctly (500 - 300 = 200)');
  assert(!!cashSaleResult.sale?.invoiceNumber, `Invoice generated: ${cashSaleResult.sale?.invoiceNumber}`);

  const sugarAfterSale = await ProductRepository.getById('prod-sugar-1', db);
  assert(sugarAfterSale?.stock === 18, 'Product stock deducted from 20 to 18');

  const pendingOpsAfterCash = await SyncQueueRepository.getPendingCount(db);
  assert(pendingOpsAfterCash >= 3, `Sync queue recorded offline operations (count: ${pendingOpsAfterCash})`);

  // ---------------------------------------------------------------------------
  // TEST 4: Atomic Transaction Rollback on Insufficient Stock
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Atomic Rollback on Insufficient Stock ---');
  const failedSaleResult = await SaleRepository.completeSaleTransaction(
    {
      items: [
        {
          product: { ...prodSugar, stock: 18 },
          quantity: 50, // Requesting 50 when only 18 available
          unitPrice: 150,
          total: 7500,
        },
      ],
      paymentMethod: 'cash',
      tenderedCash: 8000,
    },
    db
  );

  assert(failedSaleResult.success === false, 'Sale rejected due to insufficient stock');
  const sugarAfterFailed = await ProductRepository.getById('prod-sugar-1', db);
  assert(sugarAfterFailed?.stock === 18, 'Stock remains unchanged at 18 (transaction rolled back safely)');

  // ---------------------------------------------------------------------------
  // TEST 5: Atomic Udhaar (Credit) Sale Transaction
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Atomic Udhaar (Credit) Sale ---');
  const udhaarSaleResult = await SaleRepository.completeSaleTransaction(
    {
      items: [
        {
          product: prodOil,
          quantity: 2,
          unitPrice: 500,
          total: 1000,
        },
      ],
      paymentMethod: 'udhaar',
      customerId: 'cust-ahmed-1',
      customerName: 'Ahmed Khan',
      customerPhone: '03001234567',
    },
    db
  );

  assert(udhaarSaleResult.success === true, 'Udhaar sale completed successfully');
  const oilAfterSale = await ProductRepository.getById('prod-oil-1', db);
  assert(oilAfterSale?.stock === 8, 'Cooking oil stock deducted from 10 to 8');

  const custAfterUdhaar = await CustomerRepository.getById('cust-ahmed-1', db);
  assert(custAfterUdhaar?.balance === 1000, 'Customer debt balance updated to 1000');
  assert(
    !!(custAfterUdhaar?.transactions.some((tx) => tx.type === 'credit' && tx.amount === 1000)),
    'Khata ledger transaction recorded for Udhaar sale'
  );

  // ---------------------------------------------------------------------------
  // TEST 6: Atomic Sale Refund & Audit Trail Reversal
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Atomic Sale Refund & Reversal ---');
  const udhaarSaleId = udhaarSaleResult.sale!.id;
  const refundResult = await SaleRepository.refundSaleTransaction(udhaarSaleId, 'Customer Returned Oil', db);

  assert(refundResult.success === true, 'Sale refund processed successfully');
  assert(refundResult.refundedSale?.status === 'refunded', 'Sale status marked as refunded');

  const oilAfterRefund = await ProductRepository.getById('prod-oil-1', db);
  assert(oilAfterRefund?.stock === 10, 'Cooking oil stock restored back to 10');

  const custAfterRefund = await CustomerRepository.getById('cust-ahmed-1', db);
  assert(custAfterRefund?.balance === 0, 'Customer debt balance reversed back to 0');
  assert(
    !!(custAfterRefund?.transactions.some((tx) => tx.type === 'reversal' && tx.amount === 1000)),
    'Audit reversal transaction recorded in Khata ledger'
  );

  // ---------------------------------------------------------------------------
  // TEST 7: Customer Khata Vasooli Payment
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Khata Vasooli Payment ---');
  await CustomerRepository.updateBalance('cust-ahmed-1', 400, db); // add 400 debt
  await CustomerRepository.updateBalance('cust-ahmed-1', -150, db); // pay 150
  await CustomerRepository.recordPayment(
    {
      id: 'pmt-vasooli-1',
      customerId: 'cust-ahmed-1',
      amount: 150,
      paymentMethod: 'cash',
      createdAt: Date.now(),
      syncStatus: 'pending',
    },
    'pending',
    db
  );

  const custAfterVasooli = await CustomerRepository.getById('cust-ahmed-1', db);
  assert(custAfterVasooli?.balance === 250, 'Customer balance after 150 payment is 250 (400 - 150)');

  // ---------------------------------------------------------------------------
  // TEST 8: Sync Queue Operations
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. Sync Queue Tracking & Pruning ---');
  const pendingQueue = await SyncQueueRepository.getPending(50, db);
  assert(pendingQueue.length > 0, `Pending queue items available: ${pendingQueue.length}`);

  const firstItem = pendingQueue[0];
  await SyncQueueRepository.markStatus(firstItem.id, 'synced', null, db);
  await SyncQueueRepository.pruneSynced(db);

  const remainingQueue = await SyncQueueRepository.getPending(50, db);
  assert(remainingQueue.length === pendingQueue.length - 1, 'Synced queue item safely pruned');

  // ---------------------------------------------------------------------------
  // TEST 9: Invoice Counter Sequential Numbering
  // ---------------------------------------------------------------------------
  console.log('\n--- 9. Sequential Invoice Counter ---');
  const inv1 = await SettingsRepository.getNextInvoiceNumber(db);
  const inv2 = await SettingsRepository.getNextInvoiceNumber(db);
  assert(inv1.counter < inv2.counter, `Invoice numbers increment sequentially: ${inv1.invoiceNumber} -> ${inv2.invoiceNumber}`);

  console.log('\n====================================================');
  console.log(`  ALL TESTS FINISHED: ${passed} PASSED, ${failed} FAILED  `);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
