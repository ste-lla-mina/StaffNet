import React, { useState, useEffect } from 'react';
import timetableData from '../data/timetable.json';
import LogoImg from '../assets/logo.jpg';
import { 
  Clock, CheckCircle, XCircle, LayoutGrid, List, 
  LayoutDashboard, Calendar, CalendarDays, LogOut, 
  ArrowLeft, Download, Plus, X, Menu, Search
} from 'lucide-react';

const AttendanceSection = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [viewMode, setViewMode] = useState('grid');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportPDF = () => {
    window.print(); 
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900 relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col shadow-sm transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl shadow-xl p-1 border border-slate-50">
              <img src={LogoImg} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-black text-[#2e5a88] tracking-tight">StaffNet</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: 'live', label: 'Live Status', icon: LayoutDashboard },
            { id: 'timetable', label: 'Timetable', icon: Calendar },
            { id: 'leave', label: 'Leave Requests', icon: CalendarDays },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-[#2e5a88] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-2">
          <button onClick={onBack} className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold transition-all">
            <ArrowLeft size={20}/> Back
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-50 rounded-2xl font-bold transition-all">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-6 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-xl text-[#2e5a88]">
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg lg:text-2xl font-black text-slate-800 tracking-tight capitalize">{activeTab} Monitor</h2>
              <p className="text-[#2e5a88] font-bold uppercase text-[9px] lg:text-[10px] tracking-[0.2em]">{currentTime.toDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button onClick={handleExportPDF} className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={18} className="text-[#2e5a88]"/> Export
            </button>
            <div className="flex items-center gap-2 lg:gap-3 bg-[#2e5a88]/5 px-3 lg:px-4 py-2 rounded-xl border border-[#2e5a88]/10">
              <Clock size={16} className="text-[#2e5a88]" />
              <span className="font-black text-[#2e5a88] text-sm lg:text-base tabular-nums">
                {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto">
          {activeTab === 'live' && (
            <LiveView 
              currentTime={currentTime} 
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          {activeTab === 'timetable' && <TimetableView />}
          {activeTab === 'leave' && <LeaveView showForm={() => setShowLeaveForm(true)} />}
        </div>
      </main>

      {showLeaveForm && <LeaveForm close={() => setShowLeaveForm(false)} />}
    </div>
  );
};

const LiveView = ({ currentTime, viewMode, setViewMode }) => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = dayNames[currentTime.getDay()];
  const nowStr = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dayData = timetableData.find(d => d.day === today);
  const currentPeriod = dayData ? Object.entries(dayData.schedule).find(([time]) => {
    const [start, end] = time.split('-');
    return nowStr >= start && nowStr <= end;
  }) : null;

  const sessions = currentPeriod ? Object.entries(currentPeriod[1]) : [];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg lg:text-xl font-black text-slate-800">Ongoing Classes</h3>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow text-[#2e5a88]' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow text-[#2e5a88]' : 'text-slate-400'}`}><List size={18}/></button>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" : "space-y-4"}>
          {sessions.map(([className, details], i) => (
            <div key={i} className="bg-white p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-[#2e5a88] border border-slate-100">
                  {details.teacher?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-800 truncate">{details.teacher}</h4>
                  <p className="text-[9px] font-black text-[#2e5a88] uppercase tracking-wider truncate">
                    {details.subject} • {className}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#2e5a88] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1e3f63] transition-colors shadow-sm">
                  Mark Present
                </button>
                <button className="px-4 bg-red-50 text-red-500 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100">
                  <XCircle size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 lg:py-24 text-center bg-white rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-slate-100">
          <Clock size={40} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold px-6">No active classes detected for {nowStr}</p>
        </div>
      )}
    </div>
  );
};

const TimetableView = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const allTimeSlots = Array.from(
    new Set(
      timetableData.flatMap(day => Object.keys(day.schedule))
    )
  ).sort();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#2e5a88]">
              <th className="p-6 text-left text-white font-black text-xs uppercase tracking-widest border-r border-white/10 w-32">
                Time
              </th>
              {days.map(day => (
                <th key={day} className="p-6 text-center text-white font-black text-xs uppercase tracking-widest border-r border-white/10">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTimeSlots.map((timeSlot) => (
              <tr key={timeSlot} className="group border-b border-slate-50 last:border-0">
                <td className="p-5 bg-slate-50/50 border-r border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#2e5a88]" />
                    <span className="text-[11px] font-black text-[#2e5a88] tabular-nums tracking-tighter">
                      {timeSlot}
                    </span>
                  </div>
                </td>
                {days.map((dayName) => {
                  const dayData = timetableData.find(d => d.day === dayName);
                  const classesAtTime = dayData?.schedule?.[timeSlot];
                  const hasClasses = classesAtTime && Object.keys(classesAtTime).length > 0;

                  return (
                    <td 
                      key={dayName} 
                      className={`p-4 border-r border-slate-50 transition-all duration-300 min-w-[180px] ${
                        !hasClasses ? 'bg-slate-50/40' : 'group-hover:bg-blue-50/30'
                      }`}
                    >
                      {hasClasses ? (
                        <div className="space-y-3">
                          {Object.entries(classesAtTime).map(([className, details]) => {
                            if (!details || !details.teacher) return null;
                            return (
                              <div key={className} className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[12px] font-black text-slate-800 truncate pr-1">
                                    {details.teacher}
                                  </span>
                                  <span className="text-[7px] bg-[#2e5a88]/10 text-[#2e5a88] px-1.5 py-0.5 rounded font-bold">
                                    {className}
                                  </span>
                                </div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">
                                  {details.subject}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center py-4">
                          <div className="h-3 w-8 bg-[#d3d3d3] rounded-full opacity-40"></div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LeaveView = ({ showForm }) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h3 className="text-lg lg:text-xl font-black text-slate-800">Permissions & Leave</h3>
      <button onClick={showForm} className="w-full sm:w-auto bg-[#2e5a88] text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-[#1e3f63] transition-all">
        <Plus size={18}/> New Request
      </button>
    </div>
    <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 font-black text-[9px] lg:text-[10px] uppercase text-slate-400 tracking-widest">
            <tr>
              <th className="px-6 lg:px-8 py-5">Staff</th>
              <th className="px-6 lg:px-8 py-5">Reason</th>
              <th className="px-6 lg:px-8 py-5">Date</th>
              <th className="px-6 lg:px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 lg:px-8 py-6 text-sm font-bold">Stanley</td>
              <td className="px-6 lg:px-8 py-6 text-sm text-slate-500">Official Workshop</td>
              <td className="px-6 lg:px-8 py-6 text-sm text-slate-500">22 Apr 2026</td>
              <td className="px-6 lg:px-8 py-6">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">Approved</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const LeaveForm = ({ close }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-lg rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
      <button onClick={close} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors">
        <X size={24}/>
      </button>
      <h3 className="text-xl lg:text-2xl font-black text-slate-800 mb-2">New Permission</h3>
      <p className="text-slate-400 text-xs lg:text-sm mb-8 font-medium">Submit your leave or permission request for approval.</p>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#2e5a88] mb-2 ml-1">Staff Member</label>
          <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-slate-700 text-sm focus:ring-2 focus:ring-[#2e5a88]/20 transition-all outline-none" placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#2e5a88] mb-2 ml-1">Leave Reason</label>
          <textarea className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-slate-700 text-sm focus:ring-2 focus:ring-[#2e5a88]/20 transition-all h-32 outline-none resize-none" placeholder="Reason for leave..."></textarea>
        </div>
        <button className="w-full bg-[#2e5a88] text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#1e3f63] transition-all text-xs lg:text-sm">
          Submit Request
        </button>
      </form>
    </div>
  </div>
);

export default AttendanceSection;