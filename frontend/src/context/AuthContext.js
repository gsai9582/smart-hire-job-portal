// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  initialized: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'UPDATE_USER':
      const updated = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(updated));
      return { ...state, user: updated };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, user: null, token: null };
    case 'INITIALIZED': return { ...state, initialized: true };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      if (state.token) {
        try {
          const res = await authAPI.getMe();
          dispatch({ type: 'UPDATE_USER', payload: res.data.user });
        } catch {
          dispatch({ type: 'LOGOUT' });
        }
      }
      dispatch({ type: 'INITIALIZED' });
    };
    initAuth();
  }, []);

  const register = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await authAPI.register(data);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, userId: res.data.userId };
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err;
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      toast.success(`Welcome back, ${res.data.user.name}!`);
      return res.data;
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateUser = (data) => dispatch({ type: 'UPDATE_USER', payload: data });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
