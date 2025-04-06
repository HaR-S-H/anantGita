import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {toast} from "sonner"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Mail } from 'lucide-react';
import authImage from "@/assets/images/authImage.jpg";
import colors from '@/constants/colors';
import { useAuth } from "@/context/AuthContext";
import { registerUser } from '@/services/api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from '@/services/api/auth';

const SignupForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  // Form state variables
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male',
    password: ''
  });
  
  // UI state variables
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };
  
  // Handle radio button (gender) change
  const handleGenderChange = (value) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };
  
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await loginWithGoogle(authResult.code, auth, navigate);
      }
    } catch (e) {
      // console.log('Error while Google Login...', e);
    }
  };
  
  const handleGoogleLogin = 
    useGoogleLogin({
      onSuccess: responseGoogle,
      onError: responseGoogle,
      flow: "auth-code",
    });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    try {
      const response = await registerUser(formData, auth, navigate);
      setSubmitSuccess(true);
    } catch (error) {
      // toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      setErrors({ form: error.response?.data?.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full" style={{ backgroundColor: colors.offWhite }}>
      <div className="flex w-full max-w-5xl rounded-xl overflow-hidden shadow-xl max-h-[90vh]">
        {/* Form section */}
        <div className="w-full md:w-1/2 overflow-y-auto" style={{ backgroundColor: colors.paleBeige }}>
          <div className="p-6">
            <div className="mb-4">
              <h1 className="text-4xl font-bold italianno-regular" style={{ color: colors.darkRed }}>Create Your Account</h1>
              <p style={{ color: '#7D5E35' }} className="mt-1 text-sm">Embark on your path to self-realization.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="font-medium text-sm" style={{ color: '#634B2A' }}>Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                  className="rounded-lg border-2 focus:ring-2 focus:ring-offset-1 h-9" 
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: errors.name ? colors.primaryRed : colors.warmBeige,
                  }} 
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: colors.primaryRed }}>{errors.name}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email" className="font-medium text-sm" style={{ color: '#634B2A' }}>Email Address</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com" 
                    className="pl-10 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 h-9" 
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: errors.email ? colors.primaryRed : colors.warmBeige,
                    }} 
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.primaryRed }} />
                </div>
                {errors.email && <p className="text-xs mt-1" style={{ color: colors.primaryRed }}>{errors.email}</p>}
              </div>
              
              <div className="space-y-1">
                <Label className="font-medium text-sm" style={{ color: '#634B2A' }}>Gender</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={handleGenderChange} 
                  className="flex space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" style={{ borderColor: colors.primaryRed }} />
                    <Label htmlFor="male" className="text-sm" style={{ color: '#634B2A' }}>Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" style={{ borderColor: colors.primaryRed }} />
                    <Label htmlFor="female" className="text-sm" style={{ color: '#634B2A' }}>Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" style={{ borderColor: colors.primaryRed }} />
                    <Label htmlFor="other" className="text-sm" style={{ color: '#634B2A' }}>Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="font-medium text-sm" style={{ color: '#634B2A' }}>Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password" 
                    className="rounded-lg border-2 focus:ring-2 focus:ring-offset-1 h-9" 
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: errors.password ? colors.primaryRed : colors.warmBeige,
                    }} 
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {errors.password ? (
                  <p className="text-xs mt-1" style={{ color: colors.primaryRed }}>{errors.password}</p>
                ) : (
                  <p className="text-xs" style={{ color: '#7D5E35' }}>Password must be at least 8 characters</p>
                )}
                <Link to="/auth/forgot-password" className="text-xs inline-block mt-1 hover:underline" style={{ color: colors.darkRed }}>
                  Forgot password?
                </Link>
              </div>
              
              {errors.form && (
                <div className="p-2 rounded-lg bg-red-50">
                  <p className="text-xs" style={{ color: colors.primaryRed }}>{errors.form}</p>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-1.5 rounded-lg transition-all duration-300 hover:translate-y-px font-medium text-white h-9 flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.primaryRed,
                  boxShadow: '0 4px 6px rgba(216, 64, 64, 0.25)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>
              
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t" style={{ borderColor: colors.lightBeige }}></div>
                <span className="flex-shrink mx-4 text-xs" style={{ color: '#7D5E35' }}>or</span>
                <div className="flex-grow border-t" style={{ borderColor: colors.lightBeige }}></div>
              </div>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-2 rounded-lg transition-all duration-200 h-9"
                style={{ 
                  borderColor: colors.lightBeige,
                  backgroundColor: 'white',
                  color: colors.darkRed
                }}
                onClick={() => handleGoogleLogin()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 186.69 190.5">
                  <g transform="translate(1184.583 765.171)">
                    <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
                    <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
                    <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
                    <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" fill="#ea4335"/>
                  </g>
                </svg>
                Continue with Google
              </Button>
            </form>
            
            <div className="text-center pt-2">
              <p className="text-xs" style={{ color: '#634B2A' }}>
                Already have an account? <Link to="/auth/login" className="font-medium" style={{ color: colors.darkRed }}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Image section */}
        <div className="hidden md:block md:w-1/2" style={{ backgroundColor: colors.darkRed }}>
          <div className="h-full flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              {/* Using a placeholder image */}
              <img 
                src={authImage}
                alt="Community members" 
                className="object-cover w-full h-full opacity-60"
                style={{backgroundPosition:"center"}}
              />
              {/* Overlay with content */}
              <div className="absolute inset-0 bg-gradient-to-t" style={{ background: `linear-gradient(to top, ${colors.deeperRed} 0%, transparent 70%)` }}></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="text-5xl font-bold mb-2 italianno-regular">Welcome to our Community</h1>
                <p className="text-sm max-w-xs" style={{ color: colors.paleBeige }}>Join a growing community of learners exploring the timeless teachings of the Bhagavad Gita.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;