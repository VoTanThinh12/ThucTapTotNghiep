import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, register } = useAuthStore();

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRegister = async (data) => {
    try {
      await register(data);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };
};

export default useAuth;
