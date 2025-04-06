import api from "./index";
import {toast} from 'sonner'
// import {toast} from "@/services/utils/notification";
export const registerUser = async (userData, auth, navigate) => {
  try {
    const response = await api.post("/auth/signup", userData);
    if (response.data.success) {
      navigate(`/verify/${userData.email}`);
    }
    return response.data;
  } catch (error) {
    // Just throw the error, don't show toast here
    throw error;
  }
};

export const loginUser = async (userData, auth, navigate) => {
  const { setIsAuthenticated, setUser, loading } = auth;
  try {
    const response = await api.post("/auth/login", userData);
    setUser(response.data.data.user);
    setIsAuthenticated(true);
    toast.success(response.data.message);
    navigate("/home");
    return response.data;
  } catch (error) {
    
    // toast.error(error.response?.data?.message || "Login failed. Please try again.");
    // console.error(error);
    // throw error;
  }
};

export const verifyUser = async (otpData,auth,navigate) => {
  // console.log(otpData);
  const { setIsAuthenticated, setUser, loading } = auth;
  try {
    const response = await api.post("/auth/verify", otpData);
    setUser(response.data.data.user);
    setIsAuthenticated(true);
    // toast.success(response.data.message);
    navigate("/home");
    return response.data;
  } catch (error) {
    // showToast(error.response?.data?.message)
    // console.log("hello");
    
    //toast.error(error.response?.data?.message || "OTP verification failed.");
    // console.error(error);
    // throw error;
  }
};
export const resendOtp = async (email) => {
  // console.log(otpData);
  try {
    const response = await api.post("/auth/reverify", { email });
    return response.data;
  } catch (error) {
    // toast.error(error.response?.data?.message || "OTP verification failed.");
    // console.error(error);
    // throw error;
  }
};

export const logoutUser = async (auth, navigate) => {
  const { setUser, setIsAuthenticated } = auth;
  try {
    const response = await api.post("/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
    toast.success(response.data.message);
    navigate("/auth/signup");
    return response.data;
  } catch (error) {
    // toast.error(error.response?.data?.message || "Logout failed.");
    // console.error(error);
    // throw error;
  }
};

export const loginWithGoogle = async (code, auth, navigate) => {
  const { setIsAuthenticated, setUser, loading } = auth;
  try {
    const response = await api.get(`/auth/google?code=${code}`);
    setUser(response.data.data.user);
    setIsAuthenticated(true);
    toast.success(response.data.message);
    navigate("/home");
    return response.data;
  } catch (error) {
    // toast.error(error.response?.data?.message || "Google login failed.");
    // console.error(error);
    // throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data.data;
  } catch (error) {
    // console.error(error);
    // throw error;
  }
};
export const forgetPasswordSendOTP = async (email) => {
  try {
    toast.success("Verification code send");
    const response = await api.post("/auth/forgetpasswordsendotp",{email});
    return response.data.data;
  } catch (error) {
    // console.error(error);
    // throw error;
  }
}
export const forgetPasswordVerifyUser = async (otpData, auth, navigate) => {
  try {
    const response = await api.post("/auth/forgetpasswordverifyuser", otpData);    
    // setUser(response.data.data.user);
    toast.success(response.data.message);
    navigate(`/auth/forget-password-reset/${otpData.email}`);
    return response.data.data;
  } catch (error) {
    // toast.error(error.response?.data?.message || "OTP verification failed.");
    // console.error(error);
    // throw error;
  }
}
export const forgetPasswordResetPassword = async (email, password,auth, navigate) => {
  const { setIsAuthenticated, setUser, loading } = auth;
  // console.log(auth);
  
  try {
    const response = await api.post("/auth/forgetpasswordresetpassword", { email, password });
    setUser(response.data.data.user);
    setIsAuthenticated(true);
    navigate("/home");
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    // console.error(error);
    // throw error;
  }
};
