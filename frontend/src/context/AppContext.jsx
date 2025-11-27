
import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const backendURL = "http://localhost:3000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [me, setMe] = useState(null); // store user info if you want

  return (
    <AppContext.Provider value={{ backendURL, isLoggedIn, setIsLoggedIn, me, setMe }}>
      {children}
    </AppContext.Provider>
  );
}
