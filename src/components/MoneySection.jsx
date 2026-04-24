import React, { useState } from 'react';
import { 
  LayoutDashboard, Wallet, History, 
  ArrowLeft, LogOut, Plus, Search, Trash2, 
  CheckCircle2, X, ShieldCheck, Menu
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import LogoImg from '../assets/logo.jpg';

const MoneySection = ({ onBack }) => {
  const staffBlue = "#2e5a88";
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const classes = ['Y1A', 'Y1B', 'Y1C', 'Y2A', 'Y2B', 'Y2C', 'Y3A', 'Y3B', 'Y3C', 'Y3D'];

  const [studentBalances, setStudentBalances] = useState([
    { id: 1, name: 'Sonia', class: 'Y1B', amount: 500000, status: 'Stored', date: '04/05/2026' },
    { id: 2, name: 'John', class: 'Y2A', amount: 150000, status: 'Returned', date: '04/11/2026' },
    { id: 3, name: 'Mary', class: 'Y1A', amount: 250000, status: 'Stored', date: '04/10/2026' },
    { id: 4, name: 'Peter', class: 'Y3B', amount: 100000, status: 'Returned', date: '04/09/2026' },
  ]);

  const handleMarkAsReturned = (id) => {
    setStudentBalances(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Returned', date: new Date().toLocaleDateString() };
      }
      return item;
    }));
  };

  const handleDeleteRecord = (id) => {
    setStudentBalances(prev => prev.filter(item => item.id !== id));
  };

  const totalStored = studentBalances.filter(s => s.status === 'Stored').reduce((acc, curr) => acc + curr.amount, 0);
  const totalReturned = studentBalances.filter(s => s.status === 'Returned').reduce((acc, curr) => acc + curr.amount, 0);

  const distributionData = [
    { name: 'Stored', value: totalStored, color: staffBlue },
    { name: 'Returned', value: totalReturned, color: '#ef4444' }, 
  ];

  const filteredData = studentBalances.filter(item => {
    const matchesTab = activeTab === 'dashboard' ? true : item.status.toLowerCase() === activeTab;
    const matchesClass = selectedClass ? item.class === selectedClass : true;
    return matchesTab && matchesClass;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 relative">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl shadow-xl inline-block p-1">
              <img src={LogoImg} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-2xl font-black text-[#2e5a88] tracking-tight">StaffNet</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#2e5a88] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('stored'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all ${activeTab === 'stored' ? 'bg-[#2e5a88] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
            <Wallet size={20} /> Stored
          </button>
          <button onClick={() => { setActiveTab('returned'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all ${activeTab === 'returned' ? 'bg-[#2e5a88] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
            <History size={20} /> Returned
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50 space-y-2">
          <button onClick={onBack} className="w-full flex items-center gap-4 px-5 py-4 text-gray-400 hover:bg-gray-50 rounded-[1.25rem] font-bold transition-all">
            <ArrowLeft size={20} /> Back
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-50 rounded-[1.25rem] font-bold transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-16 lg:py-10">
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-[#2e5a88]">
            <Menu size={24} />
          </button>
          <img src={LogoImg} alt="Logo" className="w-8 h-8 object-contain" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 mb-12">
          <div className="bg-[#2e5a88] p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Currently Stored</p>
            <h2 className="text-2xl lg:text-4xl font-black mt-2">{totalStored.toLocaleString()} <span className="text-sm font-normal">RWF</span></h2>
          </div>
          <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border border-gray-50 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Returned</p>
            <h2 className="text-2xl lg:text-4xl font-black text-red-500 mt-2">{totalReturned.toLocaleString()} <span className="text-sm font-normal text-gray-400">RWF</span></h2>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border border-gray-50 shadow-sm mb-12">
            <h3 className="text-xs lg:text-sm font-black text-[#2e5a88] mb-8 uppercase tracking-widest text-center">Custody Overview</h3>
            <div className="h-56 lg:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                    {distributionData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-6 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <h3 className="text-xl lg:text-2xl font-black text-[#001f3f] capitalize">
              {activeTab === 'dashboard' ? 'Recent Activity' : `${activeTab} List`}
            </h3>
            <div className="flex gap-3 w-full lg:w-auto">
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="flex-1 lg:flex-none px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase outline-none">
                <option value="">Classes</option>
                {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
              {activeTab !== 'returned' && (
                <button onClick={() => setShowAddModal(true)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#2e5a88] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg">
                  <Plus size={16} /> New Entry
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block overflow-x-auto px-10 pb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-50">
                  <th className="px-6 py-5">Student</th>
                  <th className="px-6 py-5">Class</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-6 font-bold text-gray-700">{item.name}</td>
                    <td className="px-6 py-6 text-gray-400 font-bold text-xs uppercase">{item.class}</td>
                    <td className={`px-6 py-6 font-black ${item.status === 'Stored' ? 'text-[#2e5a88]' : 'text-slate-400'}`}>
                      {item.amount.toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'Stored' ? 'bg-blue-50 text-[#2e5a88]' : 'bg-red-50 text-red-500'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {item.status === 'Stored' && (
                          <button 
                            onClick={() => handleMarkAsReturned(item.id)}
                            className="bg-green-50 text-green-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            <CheckCircle2 size={14} /> Mark Returned
                          </button>
                        )}
                        <button onClick={() => handleDeleteRecord(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4 p-6">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase">{item.class}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.status === 'Stored' ? 'bg-blue-50 text-[#2e5a88]' : 'bg-red-50 text-red-500'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className={`font-black ${item.status === 'Stored' ? 'text-[#2e5a88]' : 'text-slate-400'}`}>
                    {item.amount.toLocaleString()} RWF
                  </span>
                  <div className="flex gap-2">
                    {item.status === 'Stored' && (
                      <button onClick={() => handleMarkAsReturned(item.id)} className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDeleteRecord(item.id)} className="p-2 bg-white text-gray-300 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 max-w-md w-full shadow-2xl">
            <h2 className="text-xl lg:text-2xl font-black text-[#001f3f] mb-8">Store Money</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Student Name" className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-none" />
              <input type="number" placeholder="Amount (RWF)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-none" />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-4 text-gray-400 font-black text-xs uppercase">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-[#2e5a88] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default MoneySection;