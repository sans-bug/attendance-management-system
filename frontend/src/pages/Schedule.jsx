import React, { useState, useEffect } from 'react';
import { MapPin, User, BookOpen, Clock, X, CheckCircle, Info, ChevronRight } from 'lucide-react';

const SCHEDULE_DATA = {
  'MON': [
    { id: 1, time: '09:00', title: 'Advanced Structural Systems', location: 'Studio 402', teacher: 'Prof. Elias Thorne', type: 'Mandatory', duration: '120 MINS', color: 'primary' },
    { id: 2, time: '11:45', title: 'Sustainable Urbanism', location: 'Lecture Hall B', teacher: 'Dr. Sarah Chen', type: 'Elective', duration: '90 MINS' },
    { id: 3, time: '14:30', title: 'Architecture & Human Experience', location: 'Lab 12', teacher: 'Prof. Mark Vance', type: 'Special Session', duration: '150 MINS' },
  ],
  'TUE': [
    { id: 4, time: '10:00', title: 'Digital Fabrication Lab', location: 'Workshop A', teacher: 'Tech Lead Jonas', type: 'Practical', duration: '180 MINS', color: 'primary' },
    { id: 5, time: '14:00', title: 'History of Modernism', location: 'Room 101', teacher: 'Dr. Alice Wong', type: 'Lecture', duration: '60 MINS' },
  ],
  'WED': [
    { id: 6, time: '09:00', title: 'Physics for Architects', location: 'Science Hall', teacher: 'Prof. Higgs', type: 'Core', duration: '120 MINS' },
    { id: 7, time: '13:00', title: 'Materials Science', location: 'Workshop B', teacher: 'Prof. Iron', type: 'Workshop', duration: '120 MINS', color: 'primary' },
  ],
  'THU': [
    { id: 8, time: '09:30', title: 'Design Studio V', location: 'Main Atelier', teacher: 'Prof. Thorne', type: 'Portfolio', duration: '300 MINS', color: 'primary' },
  ],
  'FRI': [
    { id: 9, time: '10:00', title: 'Professional Practice', location: 'Zoom Session', teacher: 'Legal Dept', type: 'Seminar', duration: '90 MINS' },
    { id: 10, time: '13:00', title: 'Thesis Consultation', location: 'Office 202', teacher: 'Dept. Head', type: 'One-on-One', duration: '45 MINS', color: 'primary' },
  ]
};

const Schedule = () => {
  const today = new Date();
  const currentDayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [activeDay, setActiveDay] = useState(currentDayNames[today.getDay()] === 'SUN' || currentDayNames[today.getDay()] === 'SAT' ? 'MON' : currentDayNames[today.getDay()]);
  const [selectedClass, setSelectedClass] = useState(null);

  const getWeekDays = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const name = currentDayNames[d.getDay()];
      return {
        day: name,
        date: d.getDate().toString(),
      };
    });
  };

  const days = getWeekDays();
  const currentSchedule = SCHEDULE_DATA[activeDay] || [];

  return (
    <div className="py-6 space-y-8 pb-20 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-4xl font-bold font-sans tracking-tight leading-none text-textMain pb-2">Weekly <br/>Schedule</h1>
          <p className="text-[10px] uppercase tracking-widest text-textMuted font-semibold mt-2 underline decoration-primary/40 underline-offset-4">Academic Term {today.getFullYear()}</p>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
           <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Cloud Sync Active</span>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sticky top-16 bg-background z-20 transition-all">
        {days.map((d, i) => (
          <button 
            key={i} 
            onClick={() => setActiveDay(d.day)}
            className={`min-w-[4.5rem] h-[5.5rem] rounded-2xl flex flex-col items-center justify-center border font-bold transition-all active:scale-95 duration-300
              ${activeDay === d.day
                ? 'bg-primary border-primary text-[#141312] shadow-xl shadow-primary/10 -translate-y-1' 
                : 'bg-surface/50 border-border/30 text-textMuted hover:border-primary/30'
              }`}
          >
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">{d.day}</span>
            <span className="text-3xl mt-0.5 tracking-tighter">{d.date}</span>
            {activeDay === d.day && <div className="w-1.5 h-1.5 bg-[#141312] rounded-full mt-2"></div>}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-6 mt-8 relative before:absolute before:left-[45px] before:top-4 before:bottom-0 before:w-px before:bg-border/30">
        
        {currentSchedule.map((item, idx) => (
          <div key={item.id} className="flex gap-4 relative group">
            <div className="w-12 pt-1 font-bold text-[11px] text-textMuted font-mono">
              {item.time}
            </div>
            
            <button 
              onClick={() => setSelectedClass(item)}
              className={`flex-1 text-left card border-border/30 p-5 relative overflow-hidden transition-all hover:border-primary/40 active:scale-[0.98]
                ${item.color === 'primary' ? 'bg-surface/80 border-l-4 border-l-primary' : 'bg-surface/40'}
              `}
            >
              <div className="absolute right--2 top--2 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <BookOpen size={80} />
              </div>

              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                    <span className={`text-[8px] uppercase tracking-widest px-2 py-1 rounded font-bold
                      ${item.color === 'primary' ? 'bg-primary text-[#141312]' : 'bg-background text-textMuted'}
                    `}>{item.type}</span>
                    {idx === 1 && idx ===1 && <span className="flex items-center gap-1 text-[8px] text-primary font-bold animate-pulse uppercase"><CheckCircle size={8}/> Happening Now</span>}
                 </div>
                 <span className="text-[10px] text-textMuted font-mono">{item.duration}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-textMuted font-medium">
                 <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary"/> {item.location}</span>
                 <span className="flex items-center gap-1.5"><User size={12} /> {item.teacher}</span>
              </div>

              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                 <ChevronRight size={20} className="text-primary" />
              </div>
            </button>
          </div>
        ))}

        {/* Intermission placeholder */}
        <div className="flex items-center gap-4 py-6 opacity-40">
           <div className="w-12 font-semibold text-[10px] text-textMuted font-mono">13:00</div>
           <div className="flex-1 flex items-center justify-center">
              <div className="h-px bg-border/50 flex-1"></div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-textMuted font-bold mx-4 italic">Noon Recess</span>
              <div className="h-px bg-border/50 flex-1"></div>
           </div>
        </div>

      </div>

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedClass(null)}></div>
          
          <div className="bg-surface w-full max-w-lg rounded-3xl border border-border overflow-hidden relative z-10 animate-slide-up shadow-2xl">
             <div className="h-2 w-full bg-primary/30"></div>
             
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{selectedClass.type}</p>
                      <h2 className="text-3xl font-bold text-white tracking-tight">{selectedClass.title}</h2>
                   </div>
                   <button onClick={() => setSelectedClass(null)} className="p-2 bg-background border border-border rounded-full text-textMuted hover:text-white transition">
                      <X size={20} />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-background/50 p-4 rounded-2xl border border-border/20">
                      <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold mb-2">Time Slot</p>
                      <div className="flex items-center gap-2 text-white">
                         <Clock size={16} className="text-primary" />
                         <span className="font-bold">{selectedClass.time}</span>
                      </div>
                   </div>
                   <div className="bg-background/50 p-4 rounded-2xl border border-border/20">
                      <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold mb-2">Location</p>
                      <div className="flex items-center gap-2 text-white">
                         <MapPin size={16} className="text-primary" />
                         <span className="font-bold">{selectedClass.location}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border/30">
                   <div className="w-12 h-12 bg-border rounded-xl flex items-center justify-center text-textMuted">
                      <User size={24} />
                   </div>
                   <div>
                      <p className="text-[9px] uppercase tracking-widest text-textMuted font-bold">Instructor</p>
                      <p className="text-sm font-bold text-white">{selectedClass.teacher}</p>
                   </div>
                </div>

                <div className="flex gap-3 pt-4">
                   <button className="flex-1 bg-primary text-[#141312] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Check In Now
                   </button>
                   <button className="px-6 bg-surface border border-border text-textMain rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-border transition-all">
                      <Info size={16} />
                   </button>
                </div>
             </div>
             
             <div className="bg-border/10 p-4 text-center">
                <p className="text-[8px] text-textMuted uppercase tracking-widest font-bold">Biometric Authentication Required for Check-in</p>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Schedule;
