import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Ticket, 
  Banknote, 
  Smartphone, 
  ClipboardCheck, 
  UserCircle, 
  LogOut, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  X,
  Edit2
} from 'lucide-react';
import LogoImg from '../assets/logo.jpg';

const Dashboard = ({ onLogout, onSectionClick, userEmail }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const extractName = (email) => {
    if (!email) return "Staff Member";
    return email.split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\d+/g, '')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const [profileData, setProfileData] = useState({
    name: extractName(userEmail),
    email: userEmail || 'staff@staffnet.edu',
    phone: '+250 788 123 456',
    position: 'School Administrator',
    department: 'Administration',
    joinDate: 'January 15, 2024',
    address: 'Kigali, Rwanda'
  });

  useEffect(() => {
    if (userEmail) {
      setProfileData(prev => ({
        ...prev,
        name: extractName(userEmail),
        email: userEmail
      }));
    }
  }, [userEmail]);

  const [editForm, setEditForm] = useState(profileData);
  
  const sections = [
    {
      id: "tickets",
      title: "Tickets",
      desc: "Manage student ticket payments, track paid & unpaid students.",
      icon: <Ticket className="text-white" size={22} />,
    },
    {
      id: "money",
      title: "Money",
      desc: "Track money kept for students, balances and transactions.",
      icon: <Banknote className="text-white" size={22} />,
    },
    {
      id: "phones",
      title: "Phones",
      desc: "Track borrowed and returned student phones.",
      icon: <Smartphone className="text-white" size={22} />,
    },
    {
      id: "attendance",
      title: "Lessons' Tracking",
      desc: "Monitor daily teaching progress of the faculty.",
      icon: <ClipboardCheck className="text-white" size={22} />,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="sticky top-0 z-50 bg-[#2e5a88] text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
           <div className="bg-white rounded-2xl shadow-xl mb-2 inline-block p-2">
                       <img 
                         src={LogoImg} 
                         alt="StaffNet Logo" 
                         className="w-6 h-6 object-contain" 
                       />
                     </div>
          <span className="text-xl font-bold tracking-tight">StaffNet</span>
        </div>
        
        <div className="flex items-center gap-5">
          <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-xl transition-all">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center border border-white/20 font-bold text-[#2e5a88]">
              {profileData.name[0]}
            </div>
            <span className="hidden sm:inline font-semibold text-sm text-gray-200">{profileData.name.split(' ')[0]}</span>
          </button>
    
          <button 
            onClick={onLogout}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all" 
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white rounded-2xl shadow-xl mb-4 inline-block p-4">
                      <img 
                        src={LogoImg} 
                        alt="StaffNet Logo" 
                        className="w-16 h-16 object-contain" 
                      />
                    </div>
          <h1 className="text-5xl font-black text-[#2e5a88] tracking-tight">StaffNet.</h1>
          <p className="text-gray-500 mt-3 font-semibold text-lg">School Staff Management System</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSectionClick(item.id)}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#2e5a88]/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="bg-[#2e5a88] w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>

              <h3 className="text-2xl font-extrabold text-[#2e5a88] mb-3 group-hover:text-gray-900 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {item.desc}
              </p>
              <div className="flex items-center text-[11px] font-black text-[#2e5a88] uppercase tracking-[0.15em] border-t border-gray-50 pt-6">
                Enter Section 
                <ChevronRight size={14} className="ml-1 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-8 text-center">
        <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">
          © 2026 StaffNet — Secure Workforce Management
        </p>
      </footer>

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2e5a88] to-[#1e3f63] p-8 text-white flex justify-between items-center">
              <h2 className="text-3xl font-black">My Profile</h2>
              <button onClick={() => { setShowProfile(false); setIsEditing(false); }} className="hover:bg-white/20 p-2 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#2e5a88] rounded-full flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg">
                  {profileData.name[0]}
                </div>
                <h3 className="text-2xl font-black text-[#001f3f]">{profileData.name}</h3>
                <p className="text-gray-500 font-semibold">{profileData.position}</p>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-[#2e5a88]" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                      <p className="font-semibold text-gray-700">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Phone size={18} className="text-[#2e5a88]" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                      <p className="font-semibold text-gray-700">{profileData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Briefcase size={18} className="text-[#2e5a88]" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Department</p>
                      <p className="font-semibold text-gray-700">{profileData.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <MapPin size={18} className="text-[#2e5a88]" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Address</p>
                      <p className="font-semibold text-gray-700">{profileData.address}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <p className="text-xs text-gray-400 font-semibold mb-3">JOINED</p>
                    <p className="text-gray-700 font-bold">{profileData.joinDate}</p>
                  </div>

                  <button 
                    onClick={() => { setIsEditing(true); setEditForm(profileData); }} 
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-[#2e5a88] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1e3f63] transition-all"
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2e5a88]"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2e5a88]"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2e5a88]"
                  />
                  <input 
                    type="text" 
                    placeholder="Position" 
                    value={editForm.position} 
                    onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2e5a88]"
                  />
                  <input 
                    type="text" 
                    placeholder="Department" 
                    value={editForm.department} 
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2e5a88]"
                  />
                  <input 
                    type="text" 
                    placeholder="Address" 
                    value={editForm.address} 
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#2e5a88]"
                  />

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => { setIsEditing(false); setEditForm(profileData); }} 
                      className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => { setProfileData(editForm); setIsEditing(false); }} 
                      className="flex-1 px-6 py-3 bg-[#2e5a88] text-white rounded-xl font-bold hover:bg-[#1e3f63] transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;