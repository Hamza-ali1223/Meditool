import { createContext, useState, useContext } from "react";

// Think of this as a "global storage box"
const AuthContext = createContext("PATIENT");

// This is the "storage manager"
export function AuthProvider({ children }) {
  const [role, setRole] = useState(null); // 'PATIENT' or 'DOCTOR' or null
  
  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// This is the "key to access the storage"
export function useAuth() {
  return useContext(AuthContext);
}