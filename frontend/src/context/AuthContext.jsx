import { createContext, useContext, useState, useEffect, use } from "react";
import { getUserProfile } from "../services/api/auth";
import { Toaster } from "@/components/ui/sonner"
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchProfile();
  }, []);


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading,setIsAuthenticated,setLoading,setUser,fetchProfile}}>
      {children}
      <Toaster />

    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
  };
