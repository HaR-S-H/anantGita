import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import authImage from "@/assets/images/authImage.jpg";
import colors from '@/constants/colors';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgetPasswordSendOTP } from '@/services/api/auth';
import { useNavigate } from 'react-router-dom';
const ForgotPasswordPage = () => {
  // Form state variables
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();
  // Handle input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };
  
  // Validate the form
  const validateForm = () => {
    if (!email.trim()) {
      return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Email is invalid';
    }
    return '';
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }
    
    // Show submitting state
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // Simulating API call with timeout
      const response = await forgetPasswordSendOTP(email);
      
      // Set success state
      setSubmitSuccess(true);
      
    } catch (err) {
      // console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please try again.');
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
            {/* Back button */}
            <Link 
              to="/auth/login" 
              className="flex items-center text-sm mb-6 hover:underline" 
              style={{ color: colors.darkRed }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold" style={{ color: colors.darkRed }}>Forgot Password</h1>
              <p style={{ color: '#7D5E35' }} className="mt-1 text-sm">Enter your email to reset your password</p>
            </div>
            
            {submitSuccess ? (
              <div className="space-y-4">           
                <div className="text-center pt-2">
                  <p className="text-sm" style={{ color: '#634B2A' }}>
                    Didn't receive the email? 
                    <button 
                      onClick={() => {
                        setIsSubmitting(true);
                        setTimeout(() => {
                          setIsSubmitting(false);
                          // Re-trigger success notification
                          setSubmitSuccess(false);
                          setTimeout(() => setSubmitSuccess(true), 100);
                        }, 1500);
                      }}
                      className="ml-1 font-medium hover:underline"
                      style={{ color: colors.darkRed }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Resend email'}
                    </button>
                  </p>
                </div>
                
                <div className="text-center pt-4">
                  <Link 
                    to="/auth/login" 
                    className="inline-block text-sm font-medium hover:underline"
                    style={{ color: colors.darkRed }}
                  >
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="font-medium text-sm" style={{ color: '#634B2A' }}>Email Address</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com" 
                      className="pl-10 rounded-lg border-2 focus:ring-2 focus:ring-offset-1 h-9" 
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: error ? colors.primaryRed : colors.warmBeige,
                      }} 
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.primaryRed }} />
                  </div>
                  {error && <p className="text-xs mt-1" style={{ color: colors.primaryRed }}>{error}</p>}
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-1.5 rounded-lg transition-all duration-300 hover:translate-y-px font-medium text-white h-9 flex items-center justify-center"
                  style={{ 
                    backgroundColor: colors.primaryRed,
                    boxShadow: '0 4px 6px rgba(216, 64, 64, 0.25)',
                    opacity: isSubmitting ? 0.7 : 1
                    }}
                    onClick={()=>navigate(`/auth/forgot-password-verify/${email}`)}
                >
                  {isSubmitting ? 'Sending...' : 'Send OTP'}
                </Button>
                
                <div className="text-center pt-2">
                  <p className="text-xs" style={{ color: '#634B2A' }}>
                    Remember your password? <Link to="/auth/login" className="font-medium" style={{ color: colors.darkRed }}>Sign in</Link>
                  </p>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-xs" style={{ color: '#634B2A' }}>
                    Don't have an account? <Link to="/auth/signup" className="font-medium" style={{ color: colors.darkRed }}>Sign up</Link>
                  </p>
                </div>
              </form>
            )}
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
                <h2 className="text-2xl font-bold mb-2">Recover Your Account</h2>
                <p className="text-sm max-w-xs" style={{ color: colors.paleBeige }}>We'll help you reset your password and get back to accessing your account and our community resources.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;