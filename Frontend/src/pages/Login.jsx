import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: This ensures cookies are sent and received
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        setSuccessMessage('Login successful! Redirecting...');
        
        // Store additional data in localStorage if needed (since cookies are httpOnly)
        if (formData.remember) {
          localStorage.setItem('rememberedUsername', formData.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        // Store user session data in localStorage for client-side access
        localStorage.setItem('userSession', JSON.stringify({
          counter_id: data.counter_id,
          branch_id: data.branch_id,
          username: formData.username,
          loginTime: new Date().toISOString()
        }));

        // Redirect to dashboard or desired page after a short delay
        setTimeout(() => {
          // Replace with your actual redirect logic
          window.location.href = '/dashboard'; // or use React Router
        }, 1500);

      } else {
        // Handle different error scenarios
        switch (response.status) {
          case 400:
            setErrorMessage('Username and password are required');
            break;
          case 401:
            setErrorMessage('Invalid username or password');
            break;
          case 500:
            setErrorMessage('Server error. Please try again later');
            break;
          default:
            setErrorMessage(data.message || 'Login failed. Please try again');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Unable to connect to server. Please check your connection');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered username on component mount
  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setFormData(prev => ({
        ...prev,
        username: rememberedUsername,
        remember: true
      }));
    }
  }, []);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e21c2291] rounded-full transform translate-x-32 -translate-y-32 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e21c2291] rounded-full transform -translate-x-32 translate-y-32 opacity-40"></div>
      
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-700 hover:scale-[1.02] animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <img src='logo2.png' className='h-16 mx-auto mb-4' alt="Logo"/>
            <p className="text-gray-600 text-sm">Please sign in to your counter account</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* Username Field */}
            <div className="relative group">
              <label 
                htmlFor="username" 
                className={`absolute left-4 transition-all duration-300 pointer-events-none z-50 ${
                  focusedField === 'username' || formData.username 
                    ? '-top-2 text-xs bg-white px-2 text-[#ed1b24] font-medium' 
                    : 'top-4 text-gray-500'
                }`}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`w-full px-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none ${
                  focusedField === 'username' 
                    ? 'border-[#ed1b24] shadow-lg shadow-red-100 transform -translate-y-1' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label 
                htmlFor="password" 
                className={`absolute left-4 transition-all duration-300 pointer-events-none z-50 ${
                  focusedField === 'password' || formData.password 
                    ? '-top-2 text-xs bg-white px-2 text-[#ed1b24] font-medium' 
                    : 'top-4 text-gray-500'
                }`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`w-full px-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none ${
                  focusedField === 'password' 
                    ? 'border-[#ed1b24] shadow-lg shadow-red-100 transform -translate-y-1' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-4 h-4 text-[#ed1b24] border-2 border-gray-300 rounded focus:ring-0 focus:ring-red-200 accent-[#ed1b24]"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
              </label>
              <a 
                href="#" 
                className="text-[#ed1b24] hover:text-red-700 font-medium transition-colors hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.username || !formData.password}
              className={`w-full py-4 px-6 bg-gradient-to-r from-[#ed1b24] to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-200 relative overflow-hidden group ${
                isLoading 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:shadow-2xl shadow-lg'
              }`}
            >
              <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {successMessage ? 'Redirecting...' : 'Sign In'}
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="ml-2">Signing In...</span>
                </div>
              )}
              
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -z-10 top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -z-10 bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-red-200 to-red-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
};

export default Login;