import type {
  Customer, Product, Order, RevenueDataPoint,
  CategorySalesData, TrafficSource, Notification, AppSettings
} from '../models';

// ─── Customers ────────────────────────────────────────────────────────────────
export const MOCK_CUSTOMERS: Customer[] = [
  { id:'c1', name:'Olivia Martin',   email:'olivia@example.com',  phone:'+1 555-0101', location:'New York, NY',    status:'active',   totalOrders:24, totalSpent:3840.50, joinedAt:'2023-01-15', lastOrderAt:'2024-03-10' },
  { id:'c2', name:'James Anderson',  email:'james@example.com',   phone:'+1 555-0102', location:'Los Angeles, CA', status:'active',   totalOrders:18, totalSpent:2210.00, joinedAt:'2023-02-20', lastOrderAt:'2024-03-08' },
  { id:'c3', name:'Sofia Ramirez',   email:'sofia@example.com',   phone:'+1 555-0103', location:'Chicago, IL',     status:'inactive', totalOrders:7,  totalSpent:890.75,  joinedAt:'2023-04-11', lastOrderAt:'2023-11-22' },
  { id:'c4', name:'William Chen',    email:'william@example.com', phone:'+1 555-0104', location:'Houston, TX',     status:'active',   totalOrders:32, totalSpent:5120.00, joinedAt:'2022-11-03', lastOrderAt:'2024-03-12' },
  { id:'c5', name:'Emma Thompson',   email:'emma@example.com',    phone:'+1 555-0105', location:'Phoenix, AZ',     status:'blocked',  totalOrders:3,  totalSpent:145.00,  joinedAt:'2023-07-19', lastOrderAt:'2023-08-01' },
  { id:'c6', name:'Liam Johnson',    email:'liam@example.com',    phone:'+1 555-0106', location:'Philadelphia, PA',status:'active',   totalOrders:15, totalSpent:1750.25, joinedAt:'2023-03-08', lastOrderAt:'2024-02-28' },
  { id:'c7', name:'Ava Williams',    email:'ava@example.com',     phone:'+1 555-0107', location:'San Antonio, TX', status:'active',   totalOrders:9,  totalSpent:680.00,  joinedAt:'2023-09-14', lastOrderAt:'2024-03-05' },
  { id:'c8', name:'Noah Brown',      email:'noah@example.com',    phone:'+1 555-0108', location:'San Diego, CA',   status:'inactive', totalOrders:21, totalSpent:3100.00, joinedAt:'2022-12-01', lastOrderAt:'2024-01-15' },
  { id:'c9', name:'Isabella Davis',  email:'isabella@example.com',phone:'+1 555-0109', location:'Dallas, TX',      status:'active',   totalOrders:11, totalSpent:1420.60, joinedAt:'2023-06-22', lastOrderAt:'2024-03-11' },
  { id:'c10',name:'Mason Wilson',    email:'mason@example.com',   phone:'+1 555-0110', location:'San Jose, CA',    status:'active',   totalOrders:28, totalSpent:4560.80, joinedAt:'2022-10-05', lastOrderAt:'2024-03-09' },
  { id:'c11',name:'Charlotte Moore', email:'charlotte@example.com',phone:'+1 555-0111',location:'Austin, TX',      status:'active',   totalOrders:6,  totalSpent:520.00,  joinedAt:'2023-11-30', lastOrderAt:'2024-02-14' },
  { id:'c12',name:'Elijah Taylor',   email:'elijah@example.com',  phone:'+1 555-0112', location:'Jacksonville, FL',status:'active',   totalOrders:14, totalSpent:1890.40, joinedAt:'2023-05-17', lastOrderAt:'2024-03-07' },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  { id:'p1',  name:'Wireless Pro Headphones',    sku:'WPH-001', category:'Electronics',    price:299.99, stock:145, status:'active',  description:'Premium noise-cancelling wireless headphones with 30hr battery.',   rating:4.8, reviewCount:234, createdAt:'2023-01-10', updatedAt:'2024-02-15' },
  { id:'p2',  name:'Ergonomic Office Chair',     sku:'EOC-002', category:'Home & Garden',   price:449.00, stock:38,  status:'active',  description:'Lumbar support mesh chair with adjustable armrests and height.',      rating:4.6, reviewCount:189, createdAt:'2023-02-05', updatedAt:'2024-01-20' },
  { id:'p3',  name:'Running Shoes X500',         sku:'RSX-003', category:'Sports',          price:119.95, stock:220, status:'active',  description:'Lightweight breathable running shoes with carbon fibre sole.',        rating:4.7, reviewCount:412, createdAt:'2023-03-12', updatedAt:'2024-03-01' },
  { id:'p4',  name:'Smart Watch Series 9',       sku:'SWS-004', category:'Electronics',    price:399.00, stock:67,  status:'active',  description:'Health tracking smartwatch with AMOLED display and GPS.',            rating:4.9, reviewCount:567, createdAt:'2023-04-18', updatedAt:'2024-02-28' },
  { id:'p5',  name:'Organic Green Tea Set',      sku:'OGT-005', category:'Food & Beverage', price:34.50,  stock:0,   status:'draft',   description:'Premium organic green tea collection from Uji, Japan.',             rating:4.5, reviewCount:98,  createdAt:'2023-05-22', updatedAt:'2024-01-10' },
  { id:'p6',  name:'Yoga Mat Premium',           sku:'YMP-006', category:'Sports',          price:89.00,  stock:312, status:'active',  description:'6mm eco-friendly non-slip yoga mat with alignment lines.',           rating:4.4, reviewCount:276, createdAt:'2023-06-30', updatedAt:'2024-02-22' },
  { id:'p7',  name:'4K Gaming Monitor 27"',      sku:'GM4-007', category:'Electronics',    price:699.00, stock:24,  status:'active',  description:'144Hz IPS 4K gaming monitor with G-Sync and HDR600.',               rating:4.8, reviewCount:143, createdAt:'2023-07-14', updatedAt:'2024-03-05' },
  { id:'p8',  name:'Linen Casual Shirt',         sku:'LCS-008', category:'Clothing',        price:65.00,  stock:89,  status:'active',  description:'Breathable 100% linen casual shirt, available in 8 colours.',       rating:4.3, reviewCount:87,  createdAt:'2023-08-01', updatedAt:'2024-02-10' },
  { id:'p9',  name:'Stainless Water Bottle',     sku:'SWB-009', category:'Sports',          price:42.00,  stock:0,   status:'archived',description:'1L insulated stainless steel bottle, keeps cold 24h, hot 12h.',     rating:4.6, reviewCount:321, createdAt:'2023-09-09', updatedAt:'2023-12-01' },
  { id:'p10', name:'JavaScript Design Patterns', sku:'JDP-010', category:'Books',           price:49.99,  stock:178, status:'active',  description:'Comprehensive guide to modern JS/TS design patterns.',              rating:4.7, reviewCount:203, createdAt:'2023-10-15', updatedAt:'2024-01-25' },
  { id:'p11', name:'Vitamin C Serum 30ml',       sku:'VCS-011', category:'Beauty',          price:28.00,  stock:540, status:'active',  description:'15% Vitamin C brightening serum with hyaluronic acid.',            rating:4.5, reviewCount:449, createdAt:'2023-11-20', updatedAt:'2024-03-08' },
  { id:'p12', name:'LEGO Architecture Set',      sku:'LAS-012', category:'Toys',            price:129.00, stock:55,  status:'draft',   description:'Build iconic NYC skyline with 598 pieces. Ages 12+.',              rating:4.9, reviewCount:167, createdAt:'2023-12-01', updatedAt:'2024-02-05' },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  { id:'o1',  orderNumber:'#ORD-10041', customerId:'c1',  customerName:'Olivia Martin',   customerEmail:'olivia@example.com',   items:[{productId:'p1',productName:'Wireless Pro Headphones',quantity:1,unitPrice:299.99,total:299.99},{productId:'p6',productName:'Yoga Mat Premium',quantity:1,unitPrice:89.00,total:89.00}], status:'delivered',  total:413.74, subtotal:388.99, tax:39.35, shipping:0,     paymentMethod:'Credit Card', shippingAddress:'123 Park Ave, New York, NY 10001', createdAt:'2024-03-10', updatedAt:'2024-03-13' },
  { id:'o2',  orderNumber:'#ORD-10040', customerId:'c4',  customerName:'William Chen',    customerEmail:'william@example.com',  items:[{productId:'p7',productName:'4K Gaming Monitor 27"',quantity:1,unitPrice:699.00,total:699.00}],                                                                                           status:'shipped',    total:733.95, subtotal:699.00, tax:69.90, shipping:14.99, paymentMethod:'PayPal',      shippingAddress:'456 Oak St, Houston, TX 77001',   createdAt:'2024-03-12', updatedAt:'2024-03-14' },
  { id:'o3',  orderNumber:'#ORD-10039', customerId:'c2',  customerName:'James Anderson',  customerEmail:'james@example.com',    items:[{productId:'p3',productName:'Running Shoes X500',quantity:2,unitPrice:119.95,total:239.90},{productId:'p8',productName:'Linen Casual Shirt',quantity:1,unitPrice:65.00,total:65.00}],  status:'processing', total:320.85, subtotal:304.90, tax:30.49, shipping:0,     paymentMethod:'Credit Card', shippingAddress:'789 Sunset Blvd, Los Angeles, CA 90001', createdAt:'2024-03-11', updatedAt:'2024-03-12' },
  { id:'o4',  orderNumber:'#ORD-10038', customerId:'c10', customerName:'Mason Wilson',    customerEmail:'mason@example.com',    items:[{productId:'p4',productName:'Smart Watch Series 9',quantity:1,unitPrice:399.00,total:399.00},{productId:'p11',productName:'Vitamin C Serum 30ml',quantity:2,unitPrice:28.00,total:56.00}],status:'delivered',  total:474.05, subtotal:455.00, tax:45.50, shipping:9.99,  paymentMethod:'Apple Pay',   shippingAddress:'321 Mission St, San Jose, CA 95101', createdAt:'2024-03-09', updatedAt:'2024-03-13' },
  { id:'o5',  orderNumber:'#ORD-10037', customerId:'c6',  customerName:'Liam Johnson',    customerEmail:'liam@example.com',    items:[{productId:'p2',productName:'Ergonomic Office Chair',quantity:1,unitPrice:449.00,total:449.00}],                                                                                           status:'pending',    total:488.05, subtotal:449.00, tax:44.90, shipping:14.99, paymentMethod:'Bank Transfer',shippingAddress:'654 Liberty Ave, Philadelphia, PA 19101', createdAt:'2024-03-12', updatedAt:'2024-03-12' },
  { id:'o6',  orderNumber:'#ORD-10036', customerId:'c9',  customerName:'Isabella Davis',  customerEmail:'isabella@example.com', items:[{productId:'p10',productName:'JavaScript Design Patterns',quantity:1,unitPrice:49.99,total:49.99},{productId:'p11',productName:'Vitamin C Serum 30ml',quantity:3,unitPrice:28.00,total:84.00}],status:'delivered',total:150.49,subtotal:133.99,tax:13.40,shipping:9.99,paymentMethod:'Credit Card',shippingAddress:'987 Commerce St, Dallas, TX 75201',createdAt:'2024-03-11',updatedAt:'2024-03-13' },
  { id:'o7',  orderNumber:'#ORD-10035', customerId:'c7',  customerName:'Ava Williams',    customerEmail:'ava@example.com',      items:[{productId:'p3',productName:'Running Shoes X500',quantity:1,unitPrice:119.95,total:119.95}],                                                                                               status:'cancelled',  total:131.95, subtotal:119.95, tax:11.99, shipping:0,     paymentMethod:'PayPal',      shippingAddress:'246 River Rd, San Antonio, TX 78201', createdAt:'2024-03-08', updatedAt:'2024-03-09' },
  { id:'o8',  orderNumber:'#ORD-10034', customerId:'c12', customerName:'Elijah Taylor',   customerEmail:'elijah@example.com',   items:[{productId:'p7',productName:'4K Gaming Monitor 27"',quantity:1,unitPrice:699.00,total:699.00},{productId:'p1',productName:'Wireless Pro Headphones',quantity:1,unitPrice:299.99,total:299.99}],status:'shipped',total:1055.89,subtotal:998.99,tax:99.90,shipping:14.99,paymentMethod:'Credit Card',shippingAddress:'135 Beach Blvd, Jacksonville, FL 32201',createdAt:'2024-03-07',updatedAt:'2024-03-10' },
  { id:'o9',  orderNumber:'#ORD-10033', customerId:'c11', customerName:'Charlotte Moore',  customerEmail:'charlotte@example.com',items:[{productId:'p6',productName:'Yoga Mat Premium',quantity:2,unitPrice:89.00,total:178.00}],                                                                                                status:'delivered',  total:196.80, subtotal:178.00, tax:17.80, shipping:9.99,  paymentMethod:'Apple Pay',   shippingAddress:'579 Congress Ave, Austin, TX 78701', createdAt:'2024-03-06', updatedAt:'2024-03-09' },
  { id:'o10', orderNumber:'#ORD-10032', customerId:'c8',  customerName:'Noah Brown',      customerEmail:'noah@example.com',     items:[{productId:'p4',productName:'Smart Watch Series 9',quantity:1,unitPrice:399.00,total:399.00}],                                                                                             status:'refunded',   total:433.90, subtotal:399.00, tax:39.90, shipping:9.99,  paymentMethod:'Credit Card', shippingAddress:'864 Harbor Dr, San Diego, CA 92101', createdAt:'2024-01-14', updatedAt:'2024-01-20' },
];

// ─── Revenue Chart Data ────────────────────────────────────────────────────────
export const MONTHLY_REVENUE: RevenueDataPoint[] = [
  { label:'Jan', revenue:42500, orders:312, profit:18200 },
  { label:'Feb', revenue:38200, orders:287, profit:16100 },
  { label:'Mar', revenue:51800, orders:395, profit:22400 },
  { label:'Apr', revenue:47300, orders:341, profit:19800 },
  { label:'May', revenue:63100, orders:482, profit:27600 },
  { label:'Jun', revenue:58700, orders:451, profit:25300 },
  { label:'Jul', revenue:72400, orders:556, profit:31200 },
  { label:'Aug', revenue:68900, orders:521, profit:29800 },
  { label:'Sep', revenue:75200, orders:578, profit:33100 },
  { label:'Oct', revenue:81600, orders:629, profit:36200 },
  { label:'Nov', revenue:94300, orders:731, profit:42100 },
  { label:'Dec', revenue:112800, orders:868, profit:51400 },
];

export const WEEKLY_REVENUE: RevenueDataPoint[] = [
  { label:'Mon', revenue:12400, orders:94,  profit:5200 },
  { label:'Tue', revenue:15800, orders:121, profit:6800 },
  { label:'Wed', revenue:13200, orders:101, profit:5600 },
  { label:'Thu', revenue:18900, orders:145, profit:8100 },
  { label:'Fri', revenue:22100, orders:169, profit:9500 },
  { label:'Sat', revenue:19700, orders:151, profit:8400 },
  { label:'Sun', revenue:14300, orders:110, profit:6100 },
];

// ─── Category Sales ───────────────────────────────────────────────────────────
export const CATEGORY_SALES: CategorySalesData[] = [
  { category:'Electronics',    sales:84200, percentage:34, color:'#6366f1' },
  { category:'Clothing',       sales:42100, percentage:17, color:'#8b5cf6' },
  { category:'Sports',         sales:38400, percentage:16, color:'#06b6d4' },
  { category:'Home & Garden',  sales:29800, percentage:12, color:'#10b981' },
  { category:'Food & Beverage',sales:18600, percentage:8,  color:'#f59e0b' },
  { category:'Beauty',         sales:16200, percentage:6,  color:'#ec4899' },
  { category:'Books',          sales:9800,  percentage:4,  color:'#f97316' },
  { category:'Toys',           sales:8400,  percentage:3,  color:'#14b8a6' },
];

// ─── Traffic Sources ───────────────────────────────────────────────────────────
export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source:'Organic Search', visits:48320, percentage:38, change:12.4 },
  { source:'Direct',         visits:30200, percentage:24, change: 5.2 },
  { source:'Social Media',   visits:22800, percentage:18, change:28.7 },
  { source:'Email Campaign', visits:14700, percentage:12, change:-3.1 },
  { source:'Referral',       visits: 9800, percentage: 8, change: 9.8 },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id:'n1', title:'New Order Received',    message:'Order #ORD-10041 placed by Olivia Martin for $413.74.', type:'success', read:false, createdAt:'2024-03-12T14:32:00Z' },
  { id:'n2', title:'Low Stock Alert',       message:'Product "4K Gaming Monitor 27″" has only 24 units left.',  type:'warning', read:false, createdAt:'2024-03-12T13:10:00Z' },
  { id:'n3', title:'Payment Failed',        message:'Order #ORD-10038 payment declined. Action required.',      type:'error',   read:false, createdAt:'2024-03-12T11:45:00Z' },
  { id:'n4', title:'Customer Registration', message:'New customer Emma Thompson has registered.',               type:'info',    read:true,  createdAt:'2024-03-11T16:20:00Z' },
  { id:'n5', title:'Monthly Report Ready',  message:'Your March analytics report is now available.',            type:'info',    read:true,  createdAt:'2024-03-11T09:00:00Z' },
];

// ─── Settings ─────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: AppSettings = {
  siteName:          'AdminPro',
  siteUrl:           'https://adminpro.example.com',
  timezone:          'America/New_York',
  currency:          'USD',
  language:          'en-US',
  emailNotifications:true,
  pushNotifications: true,
  smsNotifications:  false,
  twoFactorAuth:     false,
  sessionTimeout:    30,
  theme:             'light',
  compactMode:       false,
};
