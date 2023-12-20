import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setUserContext = (userData) => {
    const updatedUserData = {
      user_id: userData.user_id,
      first_name: userData.first_name,
      middle_name: userData.middle_name,
      last_name: userData.last_name,
      username: userData.username,
      role: userData.role,
      email: userData.email,
      password: userData.password
    };

    localStorage.setItem('user', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  return (
    <UserContext.Provider value={{ user, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUserContext };
