import { createContext, useContext, useState } from "react";

const UserType = createContext();

export const useUser = () => useContext(UserType);

const UserContext = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <UserType.Provider value={{ userId, setUserId, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserType.Provider>
  )
}

export { UserType, UserContext }