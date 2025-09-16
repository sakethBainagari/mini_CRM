import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import API from '../services/api';

// Initial state
const initialState = {
  customers: [],
  leads: [],
  user: null,
  loading: false,
  error: null,
  stats: {
    totalCustomers: 0,
    totalLeads: 0,
    convertedLeads: 0,
    totalValue: 0
  }
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_LEADS: 'SET_LEADS',
  SET_USER: 'SET_USER',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  ADD_LEAD: 'ADD_LEAD',
  UPDATE_LEAD: 'UPDATE_LEAD',
  DELETE_LEAD: 'DELETE_LEAD',
  UPDATE_STATS: 'UPDATE_STATS'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case ACTIONS.SET_LEADS:
      return { ...state, leads: action.payload };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    case ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer._id === action.payload._id ? action.payload : customer
        )
      };
    case ACTIONS.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.payload)
      };
    case ACTIONS.ADD_LEAD:
      return { ...state, leads: [...state.leads, action.payload] };
    case ACTIONS.UPDATE_LEAD:
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead._id === action.payload._id ? action.payload : lead
        )
      };
    case ACTIONS.DELETE_LEAD:
      return {
        ...state,
        leads: state.leads.filter(lead => lead._id !== action.payload)
      };
    case ACTIONS.UPDATE_STATS:
      return { ...state, stats: { ...state.stats, ...action.payload } };
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Basic action dispatchers
  const setLoading = useCallback((loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }), []);
  const setError = useCallback((error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }), []);
  const setCustomers = useCallback((customers) => dispatch({ type: ACTIONS.SET_CUSTOMERS, payload: customers }), []);
  const setLeads = useCallback((leads) => dispatch({ type: ACTIONS.SET_LEADS, payload: leads }), []);
  const setUser = useCallback((user) => dispatch({ type: ACTIONS.SET_USER, payload: user }), []);
  const addCustomer = useCallback((customer) => dispatch({ type: ACTIONS.ADD_CUSTOMER, payload: customer }), []);
  const updateCustomer = useCallback((customer) => dispatch({ type: ACTIONS.UPDATE_CUSTOMER, payload: customer }), []);
  const deleteCustomer = useCallback((id) => dispatch({ type: ACTIONS.DELETE_CUSTOMER, payload: id }), []);
  const addLead = useCallback((lead) => dispatch({ type: ACTIONS.ADD_LEAD, payload: lead }), []);
  const updateLead = useCallback((lead) => dispatch({ type: ACTIONS.UPDATE_LEAD, payload: lead }), []);
  const deleteLead = useCallback((id) => dispatch({ type: ACTIONS.DELETE_LEAD, payload: id }), []);
  const updateStats = useCallback((stats) => dispatch({ type: ACTIONS.UPDATE_STATS, payload: stats }), []);

  // Async actions with proper dependencies
  const fetchCustomers = useCallback(async (search = '') => {
    try {
      setLoading(true);
      const { data } = await API.get('/customers', { params: { search } });
      // Handle new API response structure
      const customers = data.customers || data || [];
      setCustomers(customers);
      updateStats({ totalCustomers: customers.length });
    } catch (error) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setCustomers, setError, updateStats]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/leads');
      // Handle new API response structure
      const leads = data.leads || data || [];
      setLeads(leads);
      const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
      const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
      updateStats({
        totalLeads: leads.length,
        convertedLeads,
        totalValue
      });
    } catch (error) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setLeads, setError, updateStats]);

  const createCustomer = useCallback(async (customerData) => {
    try {
      setLoading(true);
      const { data } = await API.post('/customers', customerData);
      addCustomer(data.customer || data);
      return data;
    } catch (error) {
      setError('Failed to create customer');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addCustomer, setError]);

  const updateCustomerAsync = useCallback(async (id, customerData) => {
    try {
      setLoading(true);
      const { data } = await API.put(`/customers/${id}`, customerData);
      updateCustomer(data.customer || data);
      return data;
    } catch (error) {
      setError('Failed to update customer');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, updateCustomer, setError]);

  const deleteCustomerAsync = useCallback(async (id) => {
    try {
      setLoading(true);
      await API.delete(`/customers/${id}`);
      deleteCustomer(id);
    } catch (error) {
      setError('Failed to delete customer');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, deleteCustomer, setError]);

  const createLead = useCallback(async (leadData) => {
    try {
      setLoading(true);
      const { data } = await API.post('/leads', leadData);
      addLead(data.lead || data);
      return data;
    } catch (error) {
      setError('Failed to create lead');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addLead, setError]);

  const updateLeadAsync = useCallback(async (id, leadData) => {
    try {
      setLoading(true);
      const { data } = await API.put(`/leads/${id}`, leadData);
      updateLead(data.lead || data);
      return data;
    } catch (error) {
      setError('Failed to update lead');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, updateLead, setError]);

  const deleteLeadAsync = useCallback(async (id) => {
    try {
      setLoading(true);
      await API.delete(`/leads/${id}`);
      deleteLead(id);
    } catch (error) {
      setError('Failed to delete lead');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, deleteLead, setError]);

  // Actions object - memoized to prevent recreation on every render
  const actions = useMemo(() => ({
    setLoading,
    setError,
    setCustomers,
    setLeads,
    setUser,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addLead,
    updateLead,
    deleteLead,
    updateStats,
    fetchCustomers,
    fetchLeads,
    createCustomer,
    updateCustomerAsync,
    deleteCustomerAsync,
    createLead,
    updateLeadAsync,
    deleteLeadAsync
  }), [
    setLoading,
    setError,
    setCustomers,
    setLeads,
    setUser,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addLead,
    updateLead,
    deleteLead,
    updateStats,
    fetchCustomers,
    fetchLeads,
    createCustomer,
    updateCustomerAsync,
    deleteCustomerAsync,
    createLead,
    updateLeadAsync,
    deleteLeadAsync
  ]);

  // Load initial data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      actions.fetchCustomers();
      actions.fetchLeads();
    }
  }, [actions]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
