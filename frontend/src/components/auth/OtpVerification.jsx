import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShieldCheckIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { verifyUser } from '@/services/api/auth';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import colors from '@/constants/colors';
import { resendOtp } from '@/services/api/auth';
const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();
  const { email } = useParams();
  // Handle OTP input change
  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press for OTP inputs
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste for OTP inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pastedDigits.length) {
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      
      // Move focus to the input after the last pasted digit
      if (pastedDigits.length < 6) {
        inputRefs.current[pastedDigits.length].focus();
      }
    }
  };

  // Verify OTP using the API
  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsVerifying(true);
      
      try {
        const otpData = {
          email: email,
          otp: otpString
        };
        
        const response = await verifyUser(otpData,auth,navigate);
        
        // Handle successful verification
        setIsVerified(true);
        // toast.success("Verification successful!");
        
        // Update authentication state
        // setIsAuthenticated(true);
        // if (response.user) {
        //   setUser(response.user);
        // }
        
        // Redirect to dashboard or home page after a brief delay
        // setTimeout(() => {
        //   navigate("/dashboard");
        // }, 1500);
      } catch (error) {
        // Error is already handled in the verifyUser function (toast)
        // Reset OTP fields on failure
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      } finally {
        setIsVerifying(false);
      }
    }
  };

  // Resend OTP
  const ResendOtp = async () => {
    try {
      // Reset timer and disable resend button
      setTimer(30);
      setResendDisabled(true);
      toast.success("New verification code sent!");
      // You can add API call to resend OTP here
      const response = await resendOtp(email,auth,navigate);
      // Reset OTP fields
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      toast.error("Failed to resend verification code.");
    }
  };

  // Timer for resend button
  useEffect(() => {
    let interval = null;
    
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: colors.offWhite }}>
      <Card className="w-full max-w-md shadow-lg" style={{ backgroundColor: 'white', borderColor: colors.lightBeige }}>
        <CardHeader className="space-y-1" style={{ backgroundColor: colors.paleBeige }}>
          <div className="flex justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: colors.softRed }}>
              <ShieldCheckIcon size={32} color="white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center" style={{ color: colors.deeperRed }}>
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to {email || "your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  style={{ 
                    borderColor: digit ? colors.primaryRed : colors.lightBeige,
                    backgroundColor: digit ? colors.paleBeige : 'white'
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              ))}
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Didn't receive code?{' '}
            <button
              className="font-medium"
              style={{ color: resendDisabled ? 'gray' : colors.primaryRed }}
              disabled={resendDisabled}
              onClick={ResendOtp}
            >
              {resendDisabled ? `Resend in ${timer}s` : 'Resend Code'}
            </button>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full font-semibold"
            style={{ 
              backgroundColor: isVerified ? colors.deeperRed : colors.primaryRed,
              color: 'white'
            }}
            disabled={otp.some(digit => digit === '') || isVerifying || isVerified}
            onClick={verifyOtp}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : isVerified ? (
              <div className="flex items-center justify-center">
                <CheckIcon className="mr-2" size={16} /> Verified
              </div>
            ) : (
              'Verify Code'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OTPVerification;