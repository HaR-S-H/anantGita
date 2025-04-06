import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';
import authImage from "@/assets/images/authImage.jpg";
import colors from '@/constants/colors';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { forgetPasswordResetPassword } from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { email } = useParams();
const auth = useAuth();
  // Form state variables
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  // UI state variables
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
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
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
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
      await forgetPasswordResetPassword(email,formData.confirmPassword,auth, navigate);
    } catch (error) {
      // console.error('Reset password error:', error);
      if (error.response && error.response.data) {
        setErrors({ form: error.response.data.message || 'Failed to reset password' });
      } else {
        setErrors({ form: 'An error occurred. Please try again.' });
      }
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold" style={{ color: colors.darkRed }}>Reset Password</h1>
              <p style={{ color: '#7D5E35' }} className="mt-1 text-sm">Create a new secure password</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="password" className="font-medium text-sm" style={{ color: '#634B2A' }}>New Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your new password" 
                    className="pl-10 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 h-9" 
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: errors.password ? colors.primaryRed : colors.warmBeige,
                    }} 
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.primaryRed }} />
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
                {errors.password && <p className="text-xs mt-1" style={{ color: colors.primaryRed }}>{errors.password}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="font-medium text-sm" style={{ color: '#634B2A' }}>Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password" 
                    className="pl-10 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 h-9" 
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: errors.confirmPassword ? colors.primaryRed : colors.warmBeige,
                    }} 
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.primaryRed }} />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: colors.primaryRed }}>{errors.confirmPassword}</p>}
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
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-xs" style={{ color: '#634B2A' }}>
                  Remember your password? <Link to="/auth/login" className="font-medium" style={{ color: colors.darkRed }}>Back to Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        {/* Image section */}
        <div className="hidden md:block md:w-1/2" style={{ backgroundColor: colors.darkRed }}>
          <div className="h-full flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              {/* Using the same image as login form */}
              <img 
                src={authImage}
                alt="Community members" 
                className="object-cover w-full h-full opacity-60"
                style={{backgroundPosition:"center"}}
              />
              {/* Overlay with content */}
              <div className="absolute inset-0 bg-gradient-to-t" style={{ background: `linear-gradient(to top, ${colors.deeperRed} 0%, transparent 70%)` }}></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
                <p className="text-sm max-w-xs" style={{ color: colors.paleBeige }}>Create a new secure password to protect your account and continue your journey with our community.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;