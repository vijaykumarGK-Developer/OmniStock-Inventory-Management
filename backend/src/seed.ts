import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './generated/prisma/client.js'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = bcrypt.hashSync('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@omni.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@omni.com', password, role: 'admin', status: 'active' },
  })
  const manager = await prisma.user.upsert({
    where: { email: 'manager@omni.com' },
    update: {},
    create: { name: 'Manager User', email: 'manager@omni.com', password, role: 'manager', status: 'active' },
  })
  const staff = await prisma.user.upsert({
    where: { email: 'staff@omni.com' },
    update: {},
    create: { name: 'Staff User', email: 'staff@omni.com', password, role: 'staff', status: 'active' },
  })

  const catData = ['Electronics', 'Accessories', 'Clothing', 'Food & Beverages', 'Stationery', 'Medical']
  const categories = await Promise.all(
    catData.map((name) =>
      prisma.category.upsert({ where: { name }, update: {}, create: { name } })
    )
  )

  const productData = [
    { name: 'Wireless Mouse', sku: 'ELE-001', categoryId: 1, price: 799, costPrice: 450, stock: 45, minStock: 10, unit: 'pcs', brand: 'LogiTech' },
    { name: 'HDMI Cable 2m', sku: 'ACC-001', categoryId: 2, price: 299, costPrice: 120, stock: 120, minStock: 20, unit: 'pcs', brand: 'CablePro' },
    { name: 'USB-C Hub 7-in-1', sku: 'ELE-002', categoryId: 1, price: 1499, costPrice: 850, stock: 30, minStock: 8, unit: 'pcs', brand: 'TechHub' },
    { name: 'Cotton T-Shirt', sku: 'CLO-001', categoryId: 3, price: 599, costPrice: 250, stock: 200, minStock: 30, unit: 'pcs', brand: 'ComfortWear' },
    { name: 'Green Tea Box', sku: 'FNB-001', categoryId: 4, price: 199, costPrice: 80, stock: 0, minStock: 15, unit: 'box', brand: 'TeaTime' },
    { name: 'A5 Notebook', sku: 'STA-001', categoryId: 5, price: 99, costPrice: 35, stock: 500, minStock: 50, unit: 'pcs', brand: 'PaperPro' },
    { name: 'First Aid Kit', sku: 'MED-001', categoryId: 6, price: 399, costPrice: 200, stock: 25, minStock: 10, unit: 'pcs', brand: 'SafeGuard' },
    { name: 'Bluetooth Speaker', sku: 'ELE-003', categoryId: 1, price: 2499, costPrice: 1200, stock: 15, minStock: 5, unit: 'pcs', brand: 'SoundWave' },
    { name: 'Laptop Stand', sku: 'ACC-002', categoryId: 2, price: 1299, costPrice: 600, stock: 2, minStock: 10, unit: 'pcs', brand: 'ErgoPlus' },
    { name: 'Denim Jacket', sku: 'CLO-002', categoryId: 3, price: 1999, costPrice: 900, stock: 0, minStock: 10, unit: 'pcs', brand: 'UrbanStyle' },
    { name: 'Protein Bars Pack', sku: 'FNB-002', categoryId: 4, price: 499, costPrice: 250, stock: 60, minStock: 20, unit: 'box', brand: 'FitFuel' },
    { name: 'Ballpoint Pens (Pack 10)', sku: 'STA-002', categoryId: 5, price: 49, costPrice: 18, stock: 1000, minStock: 100, unit: 'pack', brand: 'WriteWell' },
    { name: 'Digital Thermometer', sku: 'MED-002', categoryId: 6, price: 599, costPrice: 300, stock: 40, minStock: 15, unit: 'pcs', brand: 'MediScan' },
    { name: 'Mechanical Keyboard', sku: 'ELE-004', categoryId: 1, price: 3499, costPrice: 1800, stock: 8, minStock: 5, unit: 'pcs', brand: 'KeyMaster' },
    { name: 'Phone Case', sku: 'ACC-003', categoryId: 2, price: 349, costPrice: 120, stock: 75, minStock: 25, unit: 'pcs', brand: 'ShieldCase' },
    { name: 'Running Shoes', sku: 'CLO-003', categoryId: 3, price: 3999, costPrice: 1800, stock: 20, minStock: 8, unit: 'pair', brand: 'SpeedFit' },
    { name: 'Instant Coffee Jar', sku: 'FNB-003', categoryId: 4, price: 349, costPrice: 150, stock: 4, minStock: 15, unit: 'jar', brand: 'BrewQuick' },
    { name: 'Sticky Notes Pack', sku: 'STA-003', categoryId: 5, price: 79, costPrice: 25, stock: 350, minStock: 40, unit: 'pack', brand: 'NoteIt' },
    { name: 'Hand Sanitizer', sku: 'MED-003', categoryId: 6, price: 149, costPrice: 60, stock: 90, minStock: 30, unit: 'pcs', brand: 'CleanSafe' },
    { name: 'Webcam HD', sku: 'ELE-005', categoryId: 1, price: 1999, costPrice: 950, stock: 12, minStock: 5, unit: 'pcs', brand: 'ClearView' },
  ]

  const products = await Promise.all(
    productData.map((p) =>
      prisma.product.upsert({
        where: { sku: p.sku },
        update: {},
        create: { ...p, categoryId: p.categoryId },
      })
    )
  )

  const supplierData = [
    { name: 'TechSource India', contactPerson: 'Rahul Sharma', phone: '9876543210', email: 'rahul@techsource.in', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Global Merchants', contactPerson: 'Priya Patel', phone: '9876543211', email: 'priya@globalmerchants.in', city: 'Delhi', state: 'Delhi' },
    { name: 'Quality Goods Co.', contactPerson: 'Amit Singh', phone: '9876543212', email: 'amit@qualitygoods.in', city: 'Bangalore', state: 'Karnataka' },
    { name: 'SupplyChain Pro', contactPerson: 'Sneha Reddy', phone: '9876543213', email: 'sneha@supplychainpro.in', city: 'Chennai', state: 'Tamil Nadu' },
    { name: 'EcoDistributors', contactPerson: 'Vikram Joshi', phone: '9876543214', email: 'vikram@ecodist.in', city: 'Pune', state: 'Maharashtra' },
  ]

  const suppliers = await Promise.all(
    supplierData.map((s) =>
      prisma.supplier.create({
        data: { ...s, status: 'active' },
      })
    )
  )

  const p = (i: number) => products[i]!
  const s = (i: number) => suppliers[i]!

  const sale1 = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-2026-0001',
      customerName: 'Ravi Kumar',
      subtotal: 4297,
      tax: 773.46,
      discount: 0,
      total: 5070.46,
      paymentMethod: 'upi',
      userId: admin.id,
      items: {
        create: [
          { productId: p(0).id, productName: p(0).name, quantity: 2, unitPrice: p(0).price, total: 1598 },
          { productId: p(2).id, productName: p(2).name, quantity: 1, unitPrice: p(2).price, total: 1499 },
          { productId: p(7).id, productName: p(7).name, quantity: 1, unitPrice: p(7).price, total: 1200 },
        ],
      },
    },
  })

  const sale2 = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-2026-0002',
      customerName: 'Walk-in Customer',
      subtotal: 2598,
      tax: 467.64,
      discount: 100,
      total: 2965.64,
      paymentMethod: 'cash',
      userId: staff.id,
      items: {
        create: [
          { productId: p(1).id, productName: p(1).name, quantity: 5, unitPrice: p(1).price, total: 1495 },
          { productId: p(5).id, productName: p(5).name, quantity: 10, unitPrice: p(5).price, total: 990 },
          { productId: p(11).id, productName: p(11).name, quantity: 5, unitPrice: p(11).price, total: 113 },
        ],
      },
    },
  })

  await prisma.stockMovement.createMany({
    data: [
      { productId: p(0).id, type: 'OUT', quantity: 2, reference: 'Sale', referenceId: sale1.invoiceNo, notes: 'Sold via POS', userId: admin.id },
      { productId: p(2).id, type: 'OUT', quantity: 1, reference: 'Sale', referenceId: sale1.invoiceNo, notes: 'Sold via POS', userId: admin.id },
      { productId: p(1).id, type: 'OUT', quantity: 5, reference: 'Sale', referenceId: sale2.invoiceNo, notes: 'Sold via POS', userId: staff.id },
      { productId: p(5).id, type: 'OUT', quantity: 10, reference: 'Sale', referenceId: sale2.invoiceNo, notes: 'Sold via POS', userId: staff.id },
      { productId: p(11).id, type: 'OUT', quantity: 5, reference: 'Sale', referenceId: sale2.invoiceNo, notes: 'Sold via POS', userId: staff.id },
    ],
  })

  const po1 = await prisma.purchase.create({
    data: {
      poNumber: 'PO-2026-0001',
      supplierId: s(0).id,
      total: 15000,
      status: 'received',
      userId: admin.id,
      items: {
        create: [
          { productId: p(0).id, quantity: 20, unitPrice: 450, total: 9000 },
          { productId: p(2).id, quantity: 10, unitPrice: 600, total: 6000 },
        ],
      },
    },
  })

  await prisma.stockMovement.createMany({
    data: [
      { productId: p(0).id, type: 'IN', quantity: 20, reference: 'Purchase', referenceId: po1.poNumber, userId: admin.id },
      { productId: p(2).id, type: 'IN', quantity: 10, reference: 'Purchase', referenceId: po1.poNumber, userId: admin.id },
    ],
  })

  await prisma.product.update({ where: { id: p(0).id }, data: { stock: { increment: 18 } } })
  await prisma.product.update({ where: { id: p(2).id }, data: { stock: { increment: 9 } } })

  console.log('Seeding complete:')
  console.log(`  3 users (admin, manager, staff)`)
  console.log(`  ${categories.length} categories`)
  console.log(`  ${products.length} products`)
  console.log(`  ${suppliers.length} suppliers`)
  console.log(`  2 sales`)
  console.log(`  1 purchase order`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
