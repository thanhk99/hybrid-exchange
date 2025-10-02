"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const authState = useSelector((state: RootState) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const requireAuth = () => {
    if (!authState.isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    ...authState,
    logout: handleLogout,
    requireAuth,
  };
};

export default useAuth;