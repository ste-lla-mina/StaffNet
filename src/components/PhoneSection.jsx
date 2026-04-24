import React, { useState } from 'react';
import { 
  LayoutDashboard, PhoneIncoming, PhoneOutgoing, 
  ArrowLeft, LogOut, Search, Edit2, Smartphone, X, 
  TriangleAlert, FileText, CheckCircle, Plus, Menu
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LogoImg from '../assets/logo.jpg';

const PhoneSection = ({ onBack }) => {
  const staffBlue = "#2e5a88";
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({ 
    name: '', 
    class: '', 
    phoneType: 'Mara', 
    reason: 'project', 
    otherReason: '',
    dateBorrowed: new Date().toISOString().split('T')[0],
    returnDeadline: new Date().toISOString().split('T')[0],
    status: 'borrowed' 
  });

  const classes = ['Y1A', 'Y1B', 'Y1C', 'Y2A', 'Y2B', 'Y2C', 'Y3A', 'Y3B', 'Y3C', 'Y3D'];
  const phoneTypes = ['Mara', 'Samsung', 'Tecno'];

  const [phones, setPhones] = useState([
    { id: 1, name: 'ATETE KABUNDI Eunice', class: 'Y1A', phoneType: 'Samsung', reason: 'project', dateBorrowed: '2026-04-10', returnDeadline: '2026-04-15', dateReturned: '', status: 'borrowed' },
    { id: 2, name: 'GASARO IRANZI Melissa', class: 'Y1A', phoneType: 'Mara', reason: 'weout', dateBorrowed: '2026-04-07', returnDeadline: '2026-04-09', dateReturned: '2026-04-09', status: 'returned' },
    { id: 3, name: 'HARERIMANA Elyse Joyeux', class: 'Y1B', phoneType: 'Tecno', reason: 'other', otherReason: 'Research', dateBorrowed: '2026-04-05', returnDeadline: '2026-04-08', dateReturned: '', status: 'borrowed' },
  ]);

  const checkIsOverdue = (phone) => {
    if (phone.status === 'returned') return false;
    const deadline = new Date(phone.returnDeadline);
    const today = new Date();
    return today > deadline;
  };

  const handleMarkAsReturned = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setPhones(phones.map(p => p.id === id ? { ...p, status: 'returned', dateReturned: today } : p));
  };

  const handleAction = () => {
    const finalReason = formData.reason === 'other' ? formData.otherReason : formData.reason;
    if (showEditModal) {
      setPhones(phones.map(p => p.id === editingId ? { ...p, ...formData, reason: finalReason } : p));
    } else {
      setPhones([...phones, { ...formData, id: Date.now(), reason: finalReason, dateReturned: '' }]);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', class: '', phoneType: 'Mara', reason: 'project', otherReason: '', dateBorrowed: new Date().toISOString().split('T')[0], returnDeadline: new Date().toISOString().split('T')[0], status: 'borrowed' });
    setEditingId(null);
  };

  const getFilteredPhones = () => {
    let filtered = phones;
    if (activeTab === 'borrowed') filtered = filtered.filter(p => p.status === 'borrowed');
    if (activeTab === 'returned') filtered = filtered.filter(p => p.status === 'returned');
    if (selectedClass) filtered = filtered.filter(p => p.class === selectedClass);
    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  };

  const filteredPhones = getFilteredPhones();
  const borrowedCount = phones.filter(p => p.status === 'borrowed').length;
  const returnedCount = phones.filter(p => p.status === 'returned').length;
  const overdueCount = phones.filter(p => checkIsOverdue(p)).length;

  const activityData = [
    { name: 'Borrowed', value: borrowedCount, color: staffBlue },
    { name: 'Returned', value: returnedCount, color: '#cbd5e1' },
  ];

  const classData = classes.map(c => ({
    name: c,
    borrowed: phones.filter(p => p.class === c && p.status === 'borrowed').length,
    returned: phones.filter(p => p.class === c && p.status === 'returned').length,
  })).filter(d => d.borrowed > 0 || d.returned > 0);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("StaffNet Phone Borrowing Report", 14, 15);
    const tableColumn = ["Student", "Class", "Phone", "Borrowed", "Deadline", "Status"];
    const tableRows = filteredPhones.map(p => [
      p.name, p.class, p.phoneType, p.dateBorrowed, p.returnDeadline, checkIsOverdue(p) ? 'OVERDUE' : p.status.toUpperCase()
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("phone_report.pdf");
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      {/* Updated Sidebar with Mobile Toggle */}
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
          {['dashboard', 'borrowed', 'returned'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all capitalize ${activeTab === tab ? 'bg-[#2e5a88] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
              {tab === 'dashboard' ? <LayoutDashboard size={20} /> : tab === 'borrowed' ? <PhoneOutgoing size={20} /> : <PhoneIncoming size={20} />}
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button onClick={onBack} className="w-full flex items-center gap-4 px-5 py-4 text-gray-400 hover:bg-gray-50 rounded-[1.25rem] font-bold transition-all">
            <ArrowLeft size={20} /> Back
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-50 rounded-[1.25rem] font-bold transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-16 lg:py-10">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-[#2e5a88]">
            <Menu size={24} />
          </button>
          <img src={LogoImg} alt="Logo" className="w-8 h-8 object-contain" />
        </div>

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mb-12">
          <div className="bg-[#2e5a88] p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] text-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Borrowed</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-2">{borrowedCount}</h2>
          </div>
          <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Returned</p>
            <h2 className="text-2xl lg:text-3xl font-black text-[#001f3f] mt-2">{returnedCount}</h2>
          </div>
          <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Stock</p>
            <h2 className="text-2xl lg:text-3xl font-black text-[#2e5a88] mt-2">12</h2>
          </div>
          <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 shadow-sm col-span-1">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Overdue</p>
            <h2 className="text-2xl lg:text-3xl font-black text-red-500 mt-2">{overdueCount}</h2>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12">
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-gray-50 shadow-sm">
              <h3 className="text-sm font-black text-[#001f3f] mb-8 uppercase tracking-tight">Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={activityData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                      {activityData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-gray-50 shadow-sm hidden md:block">
              <h3 className="text-sm font-black text-[#001f3f] mb-8 uppercase tracking-tight">Borrowing by Class</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="borrowed" fill="#2e5a88" radius={[6, 6, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden mb-12">
          <div className="p-6 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h3 className="text-xl lg:text-2xl font-black text-[#001f3f]">Activity Log</h3>
            <div className="flex flex-wrap gap-3">
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="flex-1 lg:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none">
                <option value="">Classes</option>
                {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs outline-none" />
              </div>
              <button onClick={exportPDF} className="p-2.5 bg-white border border-gray-100 text-[#2e5a88] rounded-xl hover:bg-gray-50">
                <FileText size={18} />
              </button>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#2e5a88] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-lg">
                <Plus size={16} /> Register
              </button>
            </div>
          </div>

          {/* Desktop Table - Hidden on Mobile */}
          <div className="hidden lg:block overflow-x-auto px-6 pb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-10 py-5">Student</th>
                  <th className="px-10 py-5">Phone</th>
                  <th className="px-10 py-5">Deadline</th>
                  <th className="px-10 py-5 text-center">Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPhones.map((phone) => {
                  const overdue = checkIsOverdue(phone);
                  return (
                    <tr key={phone.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-6">
                        <p className="font-bold text-gray-700">{phone.name}</p>
                        <p className="text-[10px] font-black text-[#2e5a88] uppercase">{phone.class}</p>
                      </td>
                      <td className="px-10 py-6 text-gray-500 font-bold text-sm">{phone.phoneType}</td>
                      <td className="px-10 py-6 text-gray-500 font-medium text-sm">{phone.returnDeadline}</td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 text-white text-[9px] font-black rounded-lg uppercase shadow-sm ${overdue ? 'bg-red-500' : phone.status === 'borrowed' ? 'bg-orange-500' : 'bg-green-500'}`}>
                          {overdue ? 'overdue' : phone.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex gap-2 justify-end">
                          {phone.status === 'borrowed' && (
                            <button onClick={() => handleMarkAsReturned(phone.id)} className="p-3 text-green-500 bg-green-50 hover:bg-green-100 rounded-xl transition-all">
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button onClick={() => { setEditingId(phone.id); setFormData(phone); setShowEditModal(true); }} className="p-3 text-gray-400 bg-gray-50 hover:text-[#2e5a88] rounded-xl transition-all">
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked List - No Horizontal Scroll */}
          <div className="lg:hidden space-y-4 px-6 pb-10">
            {filteredPhones.map((phone) => {
              const overdue = checkIsOverdue(phone);
              return (
                <div key={phone.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2e5a88] font-black shadow-sm uppercase">{phone.name[0]}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{phone.name}</h4>
                        <p className="text-[10px] text-[#2e5a88] font-black uppercase">{phone.class}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-white text-[8px] font-black rounded-lg uppercase ${overdue ? 'bg-red-500' : phone.status === 'borrowed' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {overdue ? 'overdue' : phone.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Phone: <span className="text-gray-700">{phone.phoneType}</span></p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Deadline: <span className="text-gray-700">{phone.returnDeadline}</span></p>
                    </div>
                    <div className="flex gap-2">
                      {phone.status === 'borrowed' && (
                        <button onClick={() => handleMarkAsReturned(phone.id)} className="p-2 bg-green-50 text-green-600 rounded-lg">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => { setEditingId(phone.id); setFormData(phone); setShowEditModal(true); }} className="p-2 bg-white text-gray-400 rounded-lg shadow-sm">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modals with responsive widths */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl lg:text-2xl font-black text-[#001f3f] mb-6">{showEditModal ? 'Update Entry' : 'Register Borrowing'}</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none text-sm font-bold" />
              <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none text-sm font-bold">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={formData.dateBorrowed} onChange={(e) => setFormData({...formData, dateBorrowed: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold" />
                <input type="date" value={formData.returnDeadline} onChange={(e) => setFormData({...formData, returnDeadline: e.target.value})} className="w-full px-4 py-3 bg-red-50 border-none rounded-xl text-xs font-bold text-red-600" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="flex-1 px-6 py-3 text-gray-400 font-bold text-sm">Cancel</button>
                <button onClick={handleAction} className="flex-1 px-6 py-3 bg-[#2e5a88] text-white rounded-xl font-bold shadow-lg text-sm">{showEditModal ? 'Update' : 'Register'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default PhoneSection;