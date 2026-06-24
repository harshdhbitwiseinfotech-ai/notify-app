import { create } from "zustand";

const useStore = create((set) => ({
  products: [],
  subscribers: [],
  notifications: [],
  dashboardStats: {},
  settings: {},
  loading: false,
  error: null,

  setProducts: (products) => {
    set({ products });
  },

  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, product],
    }));
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...data } : product
      ),
    }));
  },

  setSubscribers: (subscribers) => {
    set({ subscribers });
  },

  addSubscriber: (subscriber) => {
    set((state) => ({
      subscribers: [...state.subscribers, subscriber],
    }));
  },

  updateSubscriber: (id, data) => {
    set((state) => ({
      subscribers: state.subscribers.map((subscriber) =>
        subscriber.id === id ? { ...subscriber, ...data } : subscriber
      ),
    }));
  },

  setNotifications: (notifications) => {
    set({ notifications });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },

  setDashboardStats: (stats) => {
    set({ dashboardStats: stats });
  },

  setSettings: (settings) => {
    set({ settings });
  },

  updateSettings: (data) => {
    set((state) => ({
      settings: { ...state.settings, ...data },
    }));
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  resetStore: () => {
    set({
      products: [],
      subscribers: [],
      notifications: [],
      dashboardStats: {},
      settings: {},
      loading: false,
      error: null,
    });
  },
}));

export default useStore;

