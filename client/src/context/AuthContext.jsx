import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { UseApi } from "./UseApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();
  const api = UseApi();

  const login = useCallback(async (email, password) => {
    try {
      const result = await api.post("/auth/login", { email, password });
      if (result) {
        setAccessToken(result.data.accessToken);
      }

      toast.success("login successfully!");

      return { status: result.status };
    } catch (error) {
      toast.error("login error");
      console.log("login error", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const result = await api.post("/auth/logout", {});
      if (result) setAccessToken(null);
      return { status: result.status };
    } catch (error) {
      toast.error("logout error");
      console.log("logout error", error);
    }
  }, []);

  const signup = useCallback(async (username, email, password) => {
    try {
      const result = await api.post(
        "/auth/register",
        { username, email, password },
        // { withCredentials: true },
      );
      if (result) {
        setAccessToken(result.data.accessToken);
      }

      toast.success("Signup successfully!");
      return { status: result.status };
    } catch (error) {
      toast.error("Signup error!");
      console.log("Signup error : ", error);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const result = await api.post("/auth/refresh-token", {});

      if (result.status === 200 && result.data.accessToken) {
        console.log(result.data.accessToken);
        setAccessToken(result.data.accessToken);
      }

      return { status: result.status };
    } catch (error) {
      toast.error("refresh-token error");
      console.log("refresh-token error: ", error);
    }
  }, []);

  useEffect(() => {
    const token = async () => {
      await refreshToken();
    };
    token();
  }, [refreshToken]);

  const value = useMemo(
    () => ({
      accessToken,
      login,
      logout,
      refreshToken,
      signup,
    }),
    [accessToken, login, logout, refreshToken, signup],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
