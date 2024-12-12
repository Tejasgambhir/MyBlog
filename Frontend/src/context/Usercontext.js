import React, { createContext, useState, useContext } from "react";

// Create the UserContext
const UserContext = createContext();

// Custom hook to access UserContext
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ userId,setUserId] =useState('');
  // Toggle login/logout state
  const toggleLogin = () => {
    setIsLoggedIn((prev) => !prev);
  };
 

  return (
    <UserContext.Provider value={{ isLoggedIn, toggleLogin,userId,setUserId}}>
      {children}
    </UserContext.Provider>
  );
};
