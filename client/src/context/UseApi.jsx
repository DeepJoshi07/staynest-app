import {api} from "../services/api"
import { useAuth } from "./AuthContext";

export const UseApi = () => {
  const auth = useAuth();

  const accessToken = auth?.accessToken;

  if(accessToken){
    api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  }


  return api;
};