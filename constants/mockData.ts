// Mock Data for شركاء App

export const MOCK_USER = {
  id: 'user_001',
  name: 'محمد بن سالم الحارثي',
  email: 'mohammed@shuraka.app',
  phone: '+968 9123 4567',
  role: 'business_owner' as const,
  avatar: null,
  created_at: '2024-01-15',
};

export const MOCK_ADMIN_USER = {
  id: 'admin_001',
  name: 'مدير النظام',
  email: 'admin@shuraka.app',
  phone: '+968 9999 0000',
  role: 'admin' as const,
};

export const MOCK_CUSTOMER_USER = {
  id: 'cust_user_001',
  name: 'فاطمة الزهراء',
  email: 'fatima@example.com',
  phone: '+968 9876 5432',
  role: 'customer' as const,
};

export const MOCK_BUSINESSES = [
  {
    id: 'biz_001',
    owner_id: 'user_001',
    business_name: 'مقهى السعادة',
    logo_url: null,
    category: 'مقاهي ومطاعم',
    phone: '+968 2456 7890',
    address: 'مسقط - شارع السلطان قابوس',
    brand_color: '#0D1F3C',
    subscription_plan: 'growth',
    subscription_status: 'active',
    total_customers: 248,
    total_stamps: 1842,
    total_points: 15670,
    total_rewards: 87,
    rating: 4.8,
    created_at: '2024-01-15',
  },
  {
    id: 'biz_002',
    owner_id: 'user_002',
    business_name: 'صالون الأناقة',
    logo_url: null,
    category: 'تجميل وعناية',
    phone: '+968 2345 6789',
    address: 'مسقط - الخوير',
    brand_color: '#9B59B6',
    subscription_plan: 'starter',
    subscription_status: 'active',
    total_customers: 89,
    total_stamps: 456,
    total_points: 3200,
    total_rewards: 23,
    rating: 4.6,
    created_at: '2024-02-10',
  },
  {
    id: 'biz_003',
    owner_id: 'user_003',
    business_name: 'بقالة الخير',
    logo_url: null,
    category: 'تجزئة وسوبرماركت',
    phone: '+968 2567 8901',
    address: 'مسقط - الغبرة',
    brand_color: '#27AE60',
    subscription_plan: 'partners_plus',
    subscription_status: 'active',
    total_customers: 1205,
    total_stamps: 8930,
    total_points: 67800,
    total_rewards: 412,
    rating: 4.9,
    created_at: '2023-11-05',
  },
];

export const MOCK_CUSTOMERS = [
  { id: 'c001', name: 'فاطمة الزهراء', phone: '+968 9876 5432', email: 'fatima@example.com', points: 350, stamps: 7, total_visits: 23, last_visit: 'اليوم', status: 'active', birthday: '1990-03-15', joined: '2024-02-01', tier: 'ذهبي' },
  { id: 'c002', name: 'أحمد محمود', phone: '+968 9123 0011', email: 'ahmed@example.com', points: 180, stamps: 4, total_visits: 12, last_visit: 'أمس', status: 'active', birthday: '1988-07-22', joined: '2024-03-10', tier: 'فضي' },
  { id: 'c003', name: 'نور الهدى', phone: '+968 9456 7788', email: 'nour@example.com', points: 620, stamps: 9, total_visits: 41, last_visit: 'منذ يومين', status: 'active', birthday: '1995-11-08', joined: '2023-12-20', tier: 'بلاتيني' },
  { id: 'c004', name: 'خالد العبري', phone: '+968 9234 5566', email: 'khalid@example.com', points: 90, stamps: 2, total_visits: 6, last_visit: 'منذ أسبوع', status: 'active', birthday: '1992-05-30', joined: '2024-05-01', tier: 'برونزي' },
  { id: 'c005', name: 'سلمى الحارثية', phone: '+968 9677 8899', email: 'salma@example.com', points: 440, stamps: 6, total_visits: 28, last_visit: 'منذ 3 أيام', status: 'active', birthday: '1997-09-12', joined: '2024-01-25', tier: 'ذهبي' },
  { id: 'c006', name: 'يوسف البلوشي', phone: '+968 9321 4455', email: 'yousef@example.com', points: 25, stamps: 1, total_visits: 3, last_visit: 'منذ شهر', status: 'inactive', birthday: '1985-12-25', joined: '2024-04-15', tier: 'برونزي' },
  { id: 'c007', name: 'مريم الكندية', phone: '+968 9555 6677', email: 'mariam@example.com', points: 810, stamps: 8, total_visits: 52, last_visit: 'اليوم', status: 'active', birthday: '1993-02-28', joined: '2023-10-10', tier: 'بلاتيني' },
  { id: 'c008', name: 'عمر الرواحي', phone: '+968 9112 3344', email: 'omar@example.com', points: 145, stamps: 3, total_visits: 9, last_visit: 'أمس', status: 'active', birthday: '1991-08-17', joined: '2024-06-01', tier: 'فضي' },
];

export const MOCK_LOYALTY_PROGRAMS = [
  {
    id: 'lp_001',
    business_id: 'biz_001',
    type: 'stamps',
    name: 'بطاقة القهوة',
    description: 'اشرب 9 قهوة واحصل على العاشرة مجانًا',
    required_stamps: 10,
    points_rate: 0,
    reward_description: 'قهوة مجانية من اختيارك',
    color: '#0D1F3C',
    status: 'active',
    total_issued: 1842,
    total_redeemed: 87,
    created_at: '2024-01-20',
  },
  {
    id: 'lp_002',
    business_id: 'biz_001',
    type: 'points',
    name: 'نقاط المكافآت',
    description: 'كل ريال = 10 نقاط، استبدل 500 نقطة بخصم 5 ريال',
    required_stamps: 0,
    points_rate: 10,
    reward_description: 'خصم 5 ريال لكل 500 نقطة',
    color: '#C9A84C',
    status: 'active',
    total_issued: 15670,
    total_redeemed: 3200,
    created_at: '2024-02-01',
  },
  {
    id: 'lp_003',
    business_id: 'biz_001',
    type: 'coupon',
    name: 'عرض عيد الميلاد',
    description: 'خصم 20% في يوم ميلادك',
    required_stamps: 0,
    points_rate: 0,
    reward_description: 'خصم 20% على الكل يوم الميلاد',
    color: '#EF4444',
    status: 'active',
    total_issued: 48,
    total_redeemed: 31,
    created_at: '2024-03-01',
  },
];

export const MOCK_TRANSACTIONS = [
  { id: 't001', customer_name: 'فاطمة الزهراء', type: 'stamp', value: '+1 طابع', employee: 'أحمد الموظف', time: 'اليوم، 10:30 ص', branch: 'الفرع الرئيسي' },
  { id: 't002', customer_name: 'مريم الكندية', type: 'points', value: '+150 نقطة', employee: 'سعيد الموظف', time: 'اليوم، 09:15 ص', branch: 'الفرع الرئيسي' },
  { id: 't003', customer_name: 'أحمد محمود', type: 'reward', value: 'قهوة مجانية', employee: 'أحمد الموظف', time: 'أمس، 04:20 م', branch: 'فرع الخوير' },
  { id: 't004', customer_name: 'خالد العبري', type: 'stamp', value: '+2 طابع', employee: 'سعيد الموظف', time: 'أمس، 02:10 م', branch: 'الفرع الرئيسي' },
  { id: 't005', customer_name: 'سلمى الحارثية', type: 'points', value: '+200 نقطة', employee: 'أحمد الموظف', time: 'منذ يومين، 11:00 ص', branch: 'فرع الخوير' },
  { id: 't006', customer_name: 'نور الهدى', type: 'reward', value: 'خصم 5 ريال', employee: 'سعيد الموظف', time: 'منذ يومين، 03:45 م', branch: 'الفرع الرئيسي' },
];

export const MOCK_EMPLOYEES = [
  { id: 'e001', name: 'أحمد الأمير', role: 'كاشير', phone: '+968 9200 1111', branch: 'الفرع الرئيسي', permissions: ['scan', 'add_points', 'redeem'], status: 'active', operations_today: 12 },
  { id: 'e002', name: 'سعيد المنذري', role: 'مشرف', phone: '+968 9200 2222', branch: 'فرع الخوير', permissions: ['scan', 'add_points', 'redeem', 'view_customers', 'manage_offers'], status: 'active', operations_today: 8 },
  { id: 'e003', name: 'هند السعدية', role: 'كاشير', phone: '+968 9200 3333', branch: 'الفرع الرئيسي', permissions: ['scan', 'add_points'], status: 'active', operations_today: 15 },
  { id: 'e004', name: 'ناصر الكلباني', role: 'كاشير', phone: '+968 9200 4444', branch: 'فرع الغبرة', permissions: ['scan'], status: 'inactive', operations_today: 0 },
];

export const MOCK_BRANCHES = [
  { id: 'br001', name: 'الفرع الرئيسي', address: 'مسقط - شارع السلطان قابوس', phone: '+968 2456 7890', employees: 2, customers_today: 23, status: 'open' },
  { id: 'br002', name: 'فرع الخوير', address: 'الخوير - بالقرب من مول عُمان', phone: '+968 2456 7891', employees: 1, customers_today: 15, status: 'open' },
  { id: 'br003', name: 'فرع الغبرة', address: 'الغبرة الشمالية - شارع قابوس', phone: '+968 2456 7892', employees: 1, customers_today: 0, status: 'closed' },
];

export const MOCK_REVIEWS = [
  { id: 'r001', customer: 'فاطمة الزهراء', rating: 5, comment: 'خدمة ممتازة! القهوة رائعة وبرنامج الولاء سهل الاستخدام', date: 'اليوم', branch: 'الفرع الرئيسي' },
  { id: 'r002', customer: 'أحمد محمود', rating: 4, comment: 'تجربة جيدة جدًا، أتمنى المزيد من العروض', date: 'أمس', branch: 'فرع الخوير' },
  { id: 'r003', customer: 'نور الهدى', rating: 5, comment: 'أفضل مقهى في مسقط! دائمًا أعود هنا', date: 'منذ يومين', branch: 'الفرع الرئيسي' },
  { id: 'r004', customer: 'سلمى الحارثية', rating: 3, comment: 'الخدمة بطيئة أحيانًا لكن المنتجات ممتازة', date: 'منذ 3 أيام', branch: 'الفرع الرئيسي' },
  { id: 'r005', customer: 'مريم الكندية', rating: 5, comment: 'برنامج الولاء ذكي جدًا! وفرت الكثير من المال', date: 'منذ أسبوع', branch: 'فرع الخوير' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n001', title: 'عرض خاص لعيد الأضحى', message: 'احصل على خصم 25% على جميع المشروبات', audience: 'الجميع', status: 'sent', sent_at: 'اليوم', engagement: '68%' },
  { id: 'n002', title: 'تذكير: نقاطك على وشك الانتهاء', message: 'لديك 150 نقطة ستنتهي خلال 7 أيام', audience: 'عملاء محددون', status: 'sent', sent_at: 'أمس', engagement: '45%' },
  { id: 'n003', title: 'نفتقدك! مر شهر على زيارتك الأخيرة', message: 'عد إلينا واحصل على طابع مضاعف هذا الأسبوع', audience: 'العملاء غير النشطين', status: 'sent', sent_at: 'منذ 3 أيام', engagement: '32%' },
  { id: 'n004', title: 'مبروك! حصلت على مكافأة', message: 'يمكنك الآن استبدال 10 طوابع بقهوة مجانية', audience: 'عملاء محددون', status: 'scheduled', sent_at: 'غدًا 9:00 ص', engagement: '-' },
];

export const MOCK_CHART_DATA = {
  monthly_visits: [45, 62, 78, 55, 89, 95, 72, 88, 102, 115, 98, 125],
  monthly_customers: [20, 28, 35, 30, 42, 48, 38, 45, 52, 60, 55, 68],
  months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
};

// Updated pricing: 8, 18, 39 OMR
export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'انطلاقة',
    nameEn: 'Starter',
    price: 8,
    currency: 'ر.ع',
    period: 'شهريًا',
    color: '#6366F1',
    gradient: ['#6366F1', '#818CF8'] as [string, string],
    popular: false,
    trial_days: 14,
    features: [
      { text: 'برنامج ولاء واحد', included: true },
      { text: 'فرع واحد', included: true },
      { text: 'حتى 300 عميل', included: true },
      { text: 'بطاقة طوابع رقمية', included: true },
      { text: 'QR Code للعملاء', included: true },
      { text: 'موظف واحد', included: true },
      { text: 'إشعارات محدودة', included: true },
      { text: 'إحصائيات أساسية', included: true },
      { text: 'تجربة مجانية 14 يوم', included: true },
      { text: 'تقارير تفصيلية', included: false },
      { text: 'إشعارات تلقائية', included: false },
      { text: 'حملات تسويقية', included: false },
    ],
    limits: { loyalty_programs: 1, branches: 1, customers: 300, employees: 1, notifications: 500 },
  },
  {
    id: 'growth',
    name: 'نمو',
    nameEn: 'Growth',
    price: 18,
    currency: 'ر.ع',
    period: 'شهريًا',
    color: '#10B981',
    gradient: ['#10B981', '#34D399'] as [string, string],
    popular: true,
    trial_days: 14,
    features: [
      { text: 'حتى 3 برامج ولاء', included: true },
      { text: 'حتى 3 فروع', included: true },
      { text: 'حتى 2000 عميل', included: true },
      { text: 'نقاط + طوابع + كوبونات', included: true },
      { text: 'حتى 10 موظفين', included: true },
      { text: 'إشعارات أكثر', included: true },
      { text: 'تقييمات العملاء', included: true },
      { text: 'تقارير تفصيلية', included: true },
      { text: 'حقول مخصصة للعملاء', included: true },
      { text: 'دعم أولوية', included: true },
      { text: 'إشعارات تلقائية', included: false },
      { text: 'تصدير البيانات', included: false },
    ],
    limits: { loyalty_programs: 3, branches: 3, customers: 2000, employees: 10, notifications: 5000 },
  },
  {
    id: 'partners_plus',
    name: 'شركاء بلس',
    nameEn: 'Partners Plus',
    price: 39,
    currency: 'ر.ع',
    period: 'شهريًا',
    color: '#C9A84C',
    gradient: ['#C9A84C', '#E8C96A'] as [string, string],
    popular: false,
    trial_days: 14,
    features: [
      { text: 'حتى 10 برامج ولاء', included: true },
      { text: 'حتى 10 فروع', included: true },
      { text: 'عملاء غير محدودين', included: true },
      { text: 'حتى 50 موظفًا', included: true },
      { text: 'إشعارات تلقائية كاملة', included: true },
      { text: 'حملات تسويقية متقدمة', included: true },
      { text: 'تقييمات ذكية', included: true },
      { text: 'شرائح العملاء', included: true },
      { text: 'تقارير وتحليلات متقدمة', included: true },
      { text: 'تصدير CSV / Excel', included: true },
      { text: 'دعم مميز 24/7', included: true },
      { text: 'ربط API مستقبلي', included: true },
    ],
    limits: { loyalty_programs: 10, branches: 10, customers: -1, employees: 50, notifications: -1 },
  },
];

export const ADMIN_STATS = {
  total_businesses: 3,
  active_subscriptions: 3,
  total_customers: 1542,
  total_transactions: 26670,
  monthly_revenue: 65,
  revenue_growth: 12.5,
  new_businesses_this_month: 1,
  churn_rate: 2.1,
};
