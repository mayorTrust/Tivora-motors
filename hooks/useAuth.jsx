import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, email, username }

  useEffect(() => {
    // Check localStorage for a logged-in user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    // In a real app, you'd call an API here.
    // For this example, we'll simulate a user.
    // A more robust mock would check against a list of registered users.
    const mockUser = { id: '1', email, username: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return true; // Simulate successful login
  };

  const signup = (email, password) => {
    // Simulate user creation
    // In a real app, you'd check if email already exists and hash password.
    const mockUser = { id: Date.now().toString(), email, username: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return true; // Simulate successful signup
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
