import {
  useEffect,
  useState,
} from "react";

import {
  getMe,
  getToken,
  logout,
} from "../services/authService.js";

export function useAuth() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getMe();

      setUser(currentUser);
    } catch (error) {
      console.error(
        "AUTH ERROR:",
        error
      );

      logout();

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    logout();
    setUser(null);
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
  }

  return {
    user,
    loading,
    handleLogin,
    handleLogout,
    updateUser,
  };
}