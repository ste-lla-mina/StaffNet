import React, { useState } from 'react';
import { Lock, User, LogIn, ShieldCheck, CheckCircle2 } from 'lucide-react';
import LogoImg from '../assets/logo.jpg'; 

const AuthPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


const handleLogin = (e) => {
  e.preventDefault();
  onLoginSuccess(email);
};

const handleSubmit = (e) => {
  e.preventDefault();
  onLogin(email); 
};
  return (
    <div className="min-h-screen flex font-sans bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-[#000042] items-center justify-center text-white p-12">
      <div className="relative z-10 text-center">
          <div className="bg-white rounded-2xl shadow-xl mb-4 inline-block p-4">
            <img 
              src={LogoImg} 
              alt="StaffNet Logo" 
              className="w-16 h-16 object-contain" 
            />
          </div>
          <h1  className="text-6xl font-extrabold tracking-tight">StaffNet.</h1>
          <p className="mt-4 text-blue-200 text-lg font-light italic">Secure Workforce & Discipline Management.</p>
          </div>
      </div>
      <div className="w-full lg:w-1/2 bg-[#f8fafc] flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          
          <div className="lg:hidden text-center mb-10">
             <div className="inline-block bg-white p-4 rounded-2xl shadow-xl mb-4">
                <img src={LogoImg} alt="Logo" className="w-12 h-12" />
             </div>
             <h1 className="text-3xl font-black text-[#2e5a88]">StaffNet</h1>
          </div>

          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-[#000053] tracking-tight px-14">Welcome Back.</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#000042] uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#000042] transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#001f3f] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#000042] uppercase tracking-widest ml-1">Secret Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#000042] transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#001f3f] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#000052] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#2e5a88] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Access Dashboard <LogIn size={18} /></>
                )}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
              <ShieldCheck size={16} />
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">Authorized Access Only</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">© 2026 StaffNet Infrastructure. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;