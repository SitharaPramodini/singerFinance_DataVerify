import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (formData.username && formData.password) {
      setIsLoading(true);
      // Simulate login process
      setTimeout(() => {
        alert('Login successful! (This is a demo)');
        setIsLoading(false);
      }, 2000);
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
                <img src='logo2.png' className='h-16 mx-auto mb-4'/>
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1> */}
            <p className="text-gray-600 text-sm">Please sign in to your counter account</p>
          </div>

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
                className={`w-full px-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none ${
                  focusedField === 'username' 
                    ? 'border-[#ed1b24] shadow-lg shadow-red-100 transform -translate-y-1' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
                className={`w-full px-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 outline-none ${
                  focusedField === 'password' 
                    ? 'border-[#ed1b24] shadow-lg shadow-red-100 transform -translate-y-1' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
              disabled={isLoading}
              className={`w-full py-4 px-6 bg-gradient-to-r from-[#ed1b24] to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-200 relative overflow-hidden group ${
                isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-2xl shadow-lg'
              }`}
            >
              <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Sign In
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
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
};

export default Login;