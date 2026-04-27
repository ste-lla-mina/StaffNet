import React, { useState } from 'react';
import { 
  LayoutDashboard, List, CheckCircle, XCircle, 
  ArrowLeft, LogOut, Search, Edit2, MapPin, X, FileText, Menu
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LogoImg from '../assets/logo.jpg';
import studentData from '../data/students.json';

const TicketSection = ({ onBack }) => {
  const staffBlue = "#2e5a88";
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ amount: '', location: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const locations = ["Kigali", "Musanze", "Muhanga", "Rubavu"];
  const classes = ['Y1A', 'Y1B', 'Y1C', 'Y2A', 'Y2B', 'Y2C', 'Y3A', 'Y3B', 'Y3C', 'Y3D'];

  const [tickets, setTickets] = useState(() => {
    return studentData.map(student => ({
      ...student,
      amount: student.amount,
      status: student.status || (Math.random() > 0.5 ? 'paid' : 'unpaid'),
      location: student.location
    }));
  });

  const totalTickets = tickets.length;
  const paidCount = tickets.filter(t => t.status === 'paid').length;
  const unpaidCount = totalTickets - paidCount;
  const totalCollected = tickets
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const handleMarkAsPaid = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'paid' } : t));
  };

  const handleEditUpdate = () => {
    setTickets(tickets.map(t => 
      t.id === editingId ? { ...t, amount: formData.amount, location: formData.location } : t
    ));
    setShowEditModal(false);
    setEditingId(null);
  };

  const filteredTickets = (() => {
    let filtered = tickets;
    if (activeTab === 'paid') filtered = filtered.filter(t => t.status === 'paid');
    if (activeTab === 'unpaid') filtered = filtered.filter(t => t.status === 'unpaid');
    if (selectedClass) filtered = filtered.filter(t => t.class === selectedClass);
    if (selectedLocation) filtered = filtered.filter(t => t.location === selectedLocation);
    if (searchQuery) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  })();

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(46, 90, 136);
    doc.text("StaffNet - Ticket Report", 14, 22);
    const tableColumn = ["Student Name", "Class", "Amount", "Location", "Status"];
    const tableRows = filteredTickets.map(t => [
      t.name, t.class, t.amount.toLocaleString(), t.location, t.status.toUpperCase()
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      headStyles: { fillColor: [46, 90, 136] }
    });
    doc.save("StaffNet_Report.pdf");
  };

  const pieData = [
    { name: 'Paid', value: paidCount, color: staffBlue },
    { name: 'Unpaid', value: unpaidCount, color: '#001f3f' },
  ];

  const barData = locations.map(loc => ({
    location: loc,
    paid: tickets.filter(t => t.location === loc && t.status === 'paid').length,
    unpaid: tickets.filter(t => t.location === loc && t.status === 'unpaid').length,
  }));

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl shadow-xl mb-2 inline-block p-1">
              <img src={LogoImg} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-2xl font-black text-[#2e5a88] tracking-tight">StaffNet</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-6 space-y-2">
          {['dashboard', 'all', 'paid', 'unpaid'].map((tab) => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all ${activeTab === tab ? 'bg-[#2e5a88] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {tab === 'dashboard' && <LayoutDashboard size={20} />}
              {tab === 'all' && <List size={20} />}
              {tab === 'paid' && <CheckCircle size={20} />}
              {tab === 'unpaid' && <XCircle size={20} />}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mb-12">
          <div className="bg-[#2e5a88] p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] text-white shadow-xl">
            <p className="text-[10px] font-black uppercase opacity-70">Total</p>
            <h2 className="text-2xl lg:text-4xl font-black mt-1">{totalTickets}</h2>
          </div>
          <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase">Paid</p>
            <h2 className="text-2xl lg:text-4xl font-black text-[#001f3f] mt-1">{paidCount}</h2>
          </div>
          <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase">Unpaid</p>
            <h2 className="text-2xl lg:text-4xl font-black text-red-500 mt-1">{unpaidCount}</h2>
          </div>
          <div className="bg-white p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase">Collected</p>
            <h2 className="text-2xl lg:text-4xl font-black text-[#2e5a88] mt-1">{(totalCollected/1000).toFixed(1)}k</h2>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-gray-50 shadow-sm">
              <h3 className="text-lg font-black text-[#001f3f] mb-8 uppercase">Payment Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={10} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-gray-50 shadow-sm hidden md:block">
              <h3 className="text-lg font-black text-[#001f3f] mb-8 uppercase">Locations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="location" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="paid" fill="#2e5a88" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm mb-12">
          <div className="p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <h3 className="text-xl font-black text-[#001f3f]">Student Directory</h3>
              <div className="flex flex-wrap gap-3">
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="flex-1 lg:flex-none px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none">
                  <option value="">Locations</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="flex-1 lg:flex-none px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none">
                  <option value="">Classes</option>
                  {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-6 py-2 bg-gray-50 border-none rounded-xl text-sm outline-none" />
                </div>
                <button onClick={exportPDF} className="w-full lg:w-auto flex items-center justify-center gap-2 bg-[#2e5a88] text-white px-6 py-2 rounded-xl font-black text-sm">
                  <FileText size={18} /> Export
                </button>
              </div>
            </div>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="px-10 py-5">Student</th>
                    <th className="px-10 py-5">Class</th>
                    <th className="px-10 py-5">Amount</th>
                    <th className="px-10 py-5">Location</th>
                    <th className="px-10 py-5 text-center">Status</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2e5a88] font-black text-xs">{ticket.name[0]}</div>
                          <span className="font-bold text-gray-700">{ticket.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-gray-500 font-bold text-sm">{ticket.class}</td>
                      <td className="px-10 py-6 font-black text-[#001f3f] text-sm">{ticket.amount.toLocaleString()} RWF</td>
                      <td className="px-10 py-6 text-gray-500 font-bold text-sm">{ticket.location}</td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-5 py-2 text-white text-[10px] font-black rounded-xl uppercase ${ticket.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}>{ticket.status}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleMarkAsPaid(ticket.id)} disabled={ticket.status === 'paid'} className={`p-3 rounded-xl ${ticket.status === 'paid' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}><CheckCircle size={18} /></button>
                          <button onClick={() => { setEditingId(ticket.id); setFormData({ amount: ticket.amount, location: ticket.location }); setShowEditModal(true); }} className="p-3 text-gray-400 hover:text-[#2e5a88]"><Edit2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2e5a88] font-black shadow-sm">{ticket.name[0]}</div>
                      <div>
                        <h4 className="font-bold text-gray-800">{ticket.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase">{ticket.class} • {ticket.location}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-white text-[9px] font-black rounded-lg uppercase ${ticket.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}>{ticket.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-black text-[#001f3f]">{ticket.amount.toLocaleString()} RWF</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleMarkAsPaid(ticket.id)} disabled={ticket.status === 'paid'} className="p-2 bg-white rounded-lg text-gray-400"><CheckCircle size={18} /></button>
                      <button onClick={() => { setEditingId(ticket.id); setFormData({ amount: ticket.amount, location: ticket.location }); setShowEditModal(true); }} className="p-2 bg-white rounded-lg text-gray-400"><Edit2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#001f3f]">Edit Ticket</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold outline-none" placeholder="Amount" />
              <select value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold outline-none">
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-3 text-gray-400 font-bold">Cancel</button>
                <button onClick={handleEditUpdate} className="flex-1 px-6 py-3 bg-[#2e5a88] text-white rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default TicketSection;