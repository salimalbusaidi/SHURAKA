// Powered by OnSpace.AI - Real Supabase Business Context
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getSupabaseClient } from '@/template';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export interface Business {
  id: string;
  owner_id: string;
  business_name: string;
  logo_url?: string;
  category?: string;
  phone?: string;
  address?: string;
  brand_color: string;
  description?: string;
  working_hours?: any;
  plan_slug: string;
  subscription_status: string;
  trial_ends_at?: string;
  onboarding_completed: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone?: string;
  email?: string;
  birthday?: string;
  points_balance: number;
  stamps_balance: number;
  total_visits: number;
  total_rewards_redeemed: number;
  last_visit_at?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface Employee {
  id: string;
  business_id: string;
  branch_id?: string;
  user_id?: string;
  name: string;
  phone?: string;
  email?: string;
  role: string;
  permissions: string[];
  status: string;
  created_at: string;
}

export interface Branch {
  id: string;
  business_id: string;
  branch_name: string;
  address?: string;
  phone?: string;
  is_active: boolean;
}

export interface LoyaltyProgram {
  id: string;
  business_id: string;
  type: string;
  name: string;
  description?: string;
  required_stamps: number;
  points_per_currency: number;
  reward_description?: string;
  status: string;
}

export interface Transaction {
  id: string;
  business_id: string;
  customer_id: string;
  type: string;
  points: number;
  stamps: number;
  notes?: string;
  created_at: string;
}

interface BusinessContextType {
  business: Business | null;
  customers: Customer[];
  employees: Employee[];
  branches: Branch[];
  transactions: Transaction[];
  loyaltyPrograms: LoyaltyProgram[];
  isLoading: boolean;
  currentPlan: string;
  addCustomer: (customer: Partial<Customer>) => Promise<{ success: boolean; error?: string }>;
  updateBusiness: (data: Partial<Business>) => Promise<void>;
  addTransaction: (tx: Partial<Transaction>) => Promise<{ success: boolean; error?: string }>;
  addStamp: (customerId: string, count?: number) => Promise<void>;
  addPoints: (customerId: string, points: number) => Promise<void>;
  redeemReward: (customerId: string, rewardId?: string) => Promise<void>;
  checkPlanLimit: (feature: string) => boolean;
  refreshBusiness: () => Promise<void>;
  getCustomerByQr: (qrToken: string) => Promise<Customer | null>;
}

export const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;

  const [business, setBusiness] = useState<Business | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = getSupabaseClient();

  const planLimits: Record<string, Record<string, number>> = {
    starter: { loyalty_programs: 1, branches: 1, customers: 300, employees: 1, notifications: 500 },
    growth: { loyalty_programs: 3, branches: 3, customers: 2000, employees: 10, notifications: 5000 },
    partners_plus: { loyalty_programs: 10, branches: 10, customers: -1, employees: 50, notifications: -1 },
  };

  const loadBusinessData = useCallback(async () => {
    if (!user || user.role === 'customer' || user.role === 'admin') return;
    setIsLoading(true);
    try {
      // Load business
      const { data: biz } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (biz) {
        setBusiness(biz as Business);
        // Load related data in parallel
        const [custRes, empRes, brRes, txRes, lpRes] = await Promise.all([
          supabase.from('customers').select('*').eq('business_id', biz.id).order('created_at', { ascending: false }).limit(200),
          supabase.from('employees').select('*').eq('business_id', biz.id),
          supabase.from('branches').select('*').eq('business_id', biz.id),
          supabase.from('transactions').select('*').eq('business_id', biz.id).order('created_at', { ascending: false }).limit(100),
          supabase.from('loyalty_programs').select('*').eq('business_id', biz.id),
        ]);

        if (custRes.data) setCustomers(custRes.data as Customer[]);
        if (empRes.data) setEmployees(empRes.data as Employee[]);
        if (brRes.data) setBranches(brRes.data as Branch[]);
        if (txRes.data) setTransactions(txRes.data as Transaction[]);
        if (lpRes.data) setLoyaltyPrograms(lpRes.data as LoyaltyProgram[]);
      }
    } catch (e) {
      console.error('Business data load error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadBusinessData();
    } else {
      setBusiness(null);
      setCustomers([]);
      setEmployees([]);
      setBranches([]);
      setTransactions([]);
      setLoyaltyPrograms([]);
    }
  }, [user?.id, loadBusinessData]);

  const checkPlanLimit = (feature: string): boolean => {
    const plan = business?.plan_slug || 'starter';
    const limits = planLimits[plan] || planLimits.starter;
    const limit = limits[feature];
    if (limit === -1) return true;
    if (feature === 'customers') return customers.length < limit;
    if (feature === 'loyalty_programs') return loyaltyPrograms.length < limit;
    if (feature === 'branches') return branches.length < limit;
    if (feature === 'employees') return employees.length < limit;
    return true;
  };

  const addCustomer = async (customerData: Partial<Customer>): Promise<{ success: boolean; error?: string }> => {
    if (!business) return { success: false, error: 'لا يوجد نشاط تجاري' };
    if (!checkPlanLimit('customers')) return { success: false, error: 'لقد وصلت للحد الأقصى لعدد العملاء في باقتك الحالية' };

    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .insert({ ...customerData, business_id: business.id })
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      // Create wallet for customer
      await supabase.from('wallets').insert({
        customer_id: customer.id,
        business_id: business.id,
      });

      setCustomers(prev => [customer as Customer, ...prev]);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const updateBusiness = async (data: Partial<Business>) => {
    if (!business) return;
    try {
      const { data: updated } = await supabase
        .from('businesses')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', business.id)
        .select()
        .single();
      if (updated) setBusiness(updated as Business);
      else setBusiness(prev => prev ? { ...prev, ...data } : prev);
    } catch (e) {
      // Optimistic update
      setBusiness(prev => prev ? { ...prev, ...data } : prev);
    }
  };

  const addTransaction = async (tx: Partial<Transaction>): Promise<{ success: boolean; error?: string }> => {
    if (!business) return { success: false, error: 'لا يوجد نشاط تجاري' };
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...tx, business_id: business.id })
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      setTransactions(prev => [data as Transaction, ...prev]);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const addStamp = async (customerId: string, count: number = 1) => {
    if (!business) return;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newStamps = customer.stamps_balance + count;
    const maxStamps = loyaltyPrograms[0]?.required_stamps || 10;
    const finalStamps = newStamps >= maxStamps ? 0 : newStamps;

    // Update DB
    await supabase.from('customers').update({
      stamps_balance: finalStamps,
      total_visits: customer.total_visits + 1,
      last_visit_at: new Date().toISOString(),
    }).eq('id', customerId);

    await addTransaction({
      customer_id: customerId,
      type: 'add_stamps',
      stamps: count,
      points: 0,
    });

    setCustomers(prev => prev.map(c =>
      c.id === customerId
        ? { ...c, stamps_balance: finalStamps, total_visits: c.total_visits + 1, last_visit_at: new Date().toISOString() }
        : c
    ));
  };

  const addPoints = async (customerId: string, points: number) => {
    if (!business) return;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newPoints = customer.points_balance + points;
    await supabase.from('customers').update({
      points_balance: newPoints,
      total_visits: customer.total_visits + 1,
      last_visit_at: new Date().toISOString(),
    }).eq('id', customerId);

    await addTransaction({
      customer_id: customerId,
      type: 'add_points',
      points,
      stamps: 0,
    });

    setCustomers(prev => prev.map(c =>
      c.id === customerId
        ? { ...c, points_balance: newPoints, total_visits: c.total_visits + 1, last_visit_at: new Date().toISOString() }
        : c
    ));
  };

  const redeemReward = async (customerId: string, rewardId?: string) => {
    if (!business) return;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    await supabase.from('customers').update({
      stamps_balance: 0,
      total_rewards_redeemed: customer.total_rewards_redeemed + 1,
      last_visit_at: new Date().toISOString(),
    }).eq('id', customerId);

    await addTransaction({
      customer_id: customerId,
      type: 'redeem_reward',
      stamps: 0,
      points: 0,
      reward_id: rewardId,
    });

    setCustomers(prev => prev.map(c =>
      c.id === customerId
        ? { ...c, stamps_balance: 0, total_rewards_redeemed: c.total_rewards_redeemed + 1 }
        : c
    ));
  };

  const getCustomerByQr = async (qrToken: string): Promise<Customer | null> => {
    if (!business) return null;
    try {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('customer_id, business_id, status')
        .eq('qr_token', qrToken)
        .single();

      if (!wallet || wallet.business_id !== business.id || wallet.status !== 'active') return null;

      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', wallet.customer_id)
        .single();

      return customer as Customer || null;
    } catch (e) {
      return null;
    }
  };

  return (
    <BusinessContext.Provider value={{
      business,
      customers,
      employees,
      branches,
      transactions,
      loyaltyPrograms,
      isLoading,
      currentPlan: business?.plan_slug || 'starter',
      addCustomer,
      updateBusiness,
      addTransaction,
      addStamp,
      addPoints,
      redeemReward,
      checkPlanLimit,
      refreshBusiness: loadBusinessData,
      getCustomerByQr,
    }}>
      {children}
    </BusinessContext.Provider>
  );
}
