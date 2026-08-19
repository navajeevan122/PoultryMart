import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('poultrymart_token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          console.error('[Auth Error]', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const loginSeller = async (email, password) => {
    try {
      const res = await API.post('/auth/seller/login', { email, password });
      const { token: jwtToken, user: userData } = res.data;
      localStorage.setItem('poultrymart_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      showToast('Logged in successfully as Seller!', 'success');
      return { success: true, role: 'seller' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const registerSeller = async (formData) => {
    try {
      const res = await API.post('/auth/seller/register', formData);
      const { token: jwtToken, user: userData } = res.data;
      localStorage.setItem('poultrymart_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      showToast('Seller account registered successfully!', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const res = await API.post('/auth/admin/login', { email, password });
      const { token: jwtToken, user: userData } = res.data;
      localStorage.setItem('poultrymart_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      showToast('Admin access granted!', 'success');
      return { success: true, role: 'admin' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Admin login failed.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('poultrymart_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toast,
        showToast,
        loginSeller,
        registerSeller,
        loginAdmin,
        logout,
        isAuthenticated: !!token && !!user,
        isSeller: user?.role === 'seller',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
