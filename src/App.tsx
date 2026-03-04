/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  School, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Moon, 
  Edit3, 
  Check, 
  X,
  BookOpen,
  Users,
  Heart,
  Coffee,
  ArrowRight,
  ExternalLink,
  FileText,
  PlayCircle,
  BarChart3,
  Star,
  MousePointerClick,
  ListTodo,
  Sparkles,
  User
} from 'lucide-react';
import { RAMADAN_EVENTS, type SchoolInfo, type CalendarEvent, type PhaseActivity, type MaterialContent } from './types';
import { getPhaseActivities } from './activityData';
import { MATERIALS, getMaterialById } from './materialData';

import { StudentDashboard } from './components/StudentDashboard';

const DAYS_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const FLASH_CARDS = [
  {
    title: "Regulasi",
    icon: <FileText size={24} />,
    link: "https://drive.google.com/drive/folders/1I-caNlfvfiq0vCVjdHPgIsI1cWpv9iMV?usp=drive_link",
    color: "bg-blue-500"
  },
  {
    title: "KKG PAI SD KAB BANDUNG",
    icon: <Users size={24} />,
    link: "https://drive.google.com/drive/folders/1TzLmke0b_FOfXcaO8xaLzhzZ0aSKvsYL?usp=drive_link",
    color: "bg-emerald-500"
  },
  {
    title: "Kemendikdasmen",
    icon: <School size={24} />,
    link: "https://drive.google.com/drive/folders/1i3smJL-qBzKgCJjovBE5LbjihRxiS-_-?usp=drive_link",
    color: "bg-amber-500"
  },
  {
    title: "Foto & Video Player",
    icon: <PlayCircle size={24} />,
    link: "https://drive.google.com/drive/folders/1Dus0HbnGiKqHT6JmogtYGZXqVponBygM?usp=drive_link",
    color: "bg-purple-500"
  },
  {
    title: "Monitoring",
    icon: <BarChart3 size={24} />,
    link: "https://drive.google.com/drive/folders/1Poh7_FMTutAi7568nsPMkgRKX4RrcsEN?usp=drive_link",
    color: "bg-rose-500"
  }
];

export default function App() {
  const [view, setView] = useState<'landing' | 'calendar' | 'activity-detail' | 'material-detail' | 'student-dashboard'>('landing');
  const [activeActivityDate, setActiveActivityDate] = useState<string | null>(null);
  const [activeMaterialId, setActiveMaterialId] = useState<string | null>(null);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(() => {
    const saved = localStorage.getItem('student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  const [loginForm, setLoginForm] = useState({ name: '', className: '', parentName: '' });

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem('school_identity');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse school info", e);
      }
    }
    return {
      name: 'SD Negeri 01 Indonesia',
      address: 'Jl. Merdeka No. 1, Jakarta Pusat',
      logoUrl: 'https://picsum.photos/seed/school/100/100'
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempSchoolInfo, setTempSchoolInfo] = useState<SchoolInfo>(schoolInfo);

  // Sync tempSchoolInfo when schoolInfo changes (e.g. after loading from storage)
  useEffect(() => {
    setTempSchoolInfo(schoolInfo);
  }, [schoolInfo]);
  
  const [currentMonth, setCurrentMonth] = useState(1); // 0-indexed, so 1 is February
  const [currentYear] = useState(2026);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth, currentYear]);

  const getEventForDay = (day: number) => {
    if (!day) return null;
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = date.getDay();

    const explicitEvent = RAMADAN_EVENTS.find(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });

    if (explicitEvent) {
      const phaseActivities = getPhaseActivities(dateStr);
      return { ...explicitEvent, phaseActivities, clickedDate: dateStr } as CalendarEvent;
    }

    if (currentMonth === 2 && (dayOfWeek === 0 || dayOfWeek === 6)) {
      return {
        id: `march-weekend-${dateStr}`,
        startDate: dateStr,
        endDate: dateStr,
        title: 'Pembiasaan Baik',
        description: 'pembiasaan baik yang di lakukan oleh siswa dengan bimbingan orang tua siswa di rumah',
        type: 'weekend',
        color: 'bg-red-100 border-red-500 text-red-800'
      } as CalendarEvent;
    }

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        id: `weekend-${dateStr}`,
        startDate: dateStr,
        endDate: dateStr,
        title: 'Libur Akhir Pekan',
        description: `Hari ${dayOfWeek === 0 ? 'Minggu' : 'Sabtu'} adalah hari libur belajar di sekolah.`,
        type: 'weekend',
        color: 'bg-rose-50 border-rose-200 text-rose-600'
      } as CalendarEvent;
    }

    return null;
  };

  const handleSaveSchoolInfo = () => {
    setSchoolInfo(tempSchoolInfo);
    localStorage.setItem('school_identity', JSON.stringify(tempSchoolInfo));
    setIsEditing(false);
  };

  const nextMonth = () => {
    if (currentMonth < 2) setCurrentMonth(prev => prev + 1);
  };

  const prevMonth = () => {
    if (currentMonth > 1) setCurrentMonth(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen flex flex-col items-center justify-center relative p-4 bg-emerald-950 text-white"
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <Moon className="absolute top-10 right-10 w-64 h-64 text-emerald-400 rotate-12" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-900 to-transparent" />
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-white rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3}px`,
                    height: `${Math.random() * 3}px`,
                    opacity: Math.random()
                  }}
                />
              ))}
            </div>

            <div className="max-w-4xl w-full z-10 space-y-12 text-center">
              {/* School Identity */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden">
                  {schoolInfo.logoUrl ? (
                    <img src={schoolInfo.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white">
                      <School size={40} />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">{schoolInfo.name}</h2>
                  <p className="text-emerald-300 text-sm flex items-center justify-center gap-1">
                    <MapPin size={14} />
                    {schoolInfo.address}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setTempSchoolInfo(schoolInfo);
                    setIsEditing(true);
                  }}
                  className="text-emerald-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Edit3 size={14} />
                  Edit Identitas
                </button>
              </motion.div>

              {/* Hero Text */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">
                  RAMADAN <span className="text-emerald-400">1447H</span>
                </h1>
                <p className="text-lg sm:text-xl text-emerald-200 font-medium max-w-xl mx-auto">
                  Panduan Pembelajaran & Kalender Interaktif Tahun 2026 Masehi
                </p>
              </motion.div>

              {/* Flash Cards */}
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
              >
                {FLASH_CARDS.map((card, i) => (
                  <motion.a
                    key={i}
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-all group"
                  >
                    <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                      {card.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-tight">
                      {card.title}
                    </span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Roadmap */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-emerald-900/40 backdrop-blur-md border border-emerald-800/50 rounded-3xl p-6 md:p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-emerald-300 font-bold text-xs uppercase tracking-widest mb-8 relative z-10">Cara Penggunaan Aplikasi</h3>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 relative z-10">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-emerald-800/50 -z-10" />
                  
                  {/* Connecting Line (Mobile) */}
                  <div className="md:hidden absolute top-[10%] bottom-[10%] left-6 w-[2px] bg-emerald-800/50 -z-10" />

                  {[
                    { icon: <MousePointerClick size={20} />, title: 'Pilih Tanggal', desc: 'Klik tanggal pada kalender' },
                    { icon: <ListTodo size={20} />, title: 'Cek Jadwal', desc: 'Lihat jadwal sesuai fase kelas' },
                    { icon: <BookOpen size={20} />, title: 'Buka Materi', desc: 'Klik aktivitas bertanda materi' },
                    { icon: <Sparkles size={20} />, title: 'Praktikkan', desc: 'Lakukan pembiasaan baik' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 w-full md:w-1/4">
                      <div className="w-12 h-12 rounded-full bg-emerald-800 border-4 border-emerald-950 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                        {step.icon}
                      </div>
                      <div className="text-left md:text-center">
                        <h4 className="font-bold text-emerald-50 text-sm">{step.title}</h4>
                        <p className="text-xs text-emerald-300/80 mt-1 leading-relaxed max-w-[200px] md:mx-auto">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={() => setView('calendar')}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <span>BUKA KALENDER</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => {
                    if (studentProfile) {
                      setView('student-dashboard');
                    } else {
                      setShowStudentLogin(true);
                    }
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <User size={20} />
                  <span>{studentProfile ? 'DASHBOARD SISWA' : 'LOGIN SISWA'}</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : view === 'calendar' ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Calendar Header */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
              <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('landing')}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg overflow-hidden"
                  >
                    {schoolInfo.logoUrl ? (
                      <img src={schoolInfo.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <School size={20} />
                    )}
                  </motion.div>
                  <div>
                    <h1 className="text-sm font-bold tracking-tight leading-tight">{schoolInfo.name}</h1>
                    <div className="flex items-center gap-1 text-stone-500 text-[10px]">
                      <MapPin size={10} />
                      <span>{schoolInfo.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setView('landing')}
                    className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Beranda
                  </button>
                  <button 
                    onClick={() => {
                      setTempSchoolInfo(schoolInfo);
                      setIsEditing(true);
                    }}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-emerald-600"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 flex-grow">
              {/* Title Section */}
              <section className="text-center space-y-2">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  <Moon size={14} className="fill-emerald-700" />
                  <span>Ramadan 1447 Hijriah</span>
                </motion.div>
                <h2 className="text-3xl font-black tracking-tighter sm:text-4xl">
                  Panduan Pembelajaran Ramadan
                </h2>
                <p className="text-stone-500 max-w-2xl mx-auto text-sm sm:text-base">
                  Sesuai Surat Edaran Bersama Menteri Pendidikan Dasar dan Menengah, Menteri Agama, dan Menteri Dalam Negeri Tahun 2026.
                </p>
              </section>

              {/* Calendar Control */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden">
                    <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarIcon size={24} />
                        <h3 className="text-xl font-bold">{MONTHS[currentMonth]} {currentYear}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={prevMonth}
                          disabled={currentMonth <= 1}
                          className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-30"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={nextMonth}
                          disabled={currentMonth >= 2}
                          className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-30"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-7 mb-4">
                        {DAYS_OF_WEEK.map(day => (
                          <div key={day} className="text-center text-xs font-bold text-stone-400 uppercase tracking-widest py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {calendarDays.map((day, idx) => {
                          const event = day ? getEventForDay(day) : null;
                          return (
                            <motion.button
                              key={idx}
                              whileHover={day ? { scale: 1.05 } : {}}
                              whileTap={day ? { scale: 0.95 } : {}}
                              onClick={() => event && setSelectedEvent(event)}
                              className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all border-2 ${
                                !day 
                                  ? 'bg-transparent border-transparent' 
                                  : event 
                                    ? `${event.color} cursor-pointer` 
                                    : 'bg-stone-50 border-stone-100 hover:border-stone-200 text-stone-400'
                              }`}
                            >
                              {day && (
                                <>
                                  <span className="text-sm sm:text-lg font-bold">{day}</span>
                                  {event && (
                                    <div className="absolute bottom-1 sm:bottom-2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-current opacity-50" />
                                  )}
                                </>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 px-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <span>Mandiri (Senin-Jumat)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Sekolah (Senin-Jumat)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>Libur Idulfitri</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Pembiasaan Baik</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Masuk Kembali</span>
                    </div>
                  </div>
                </div>

                {/* Guidelines Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-stone-200 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Info size={20} />
                      <h3 className="font-bold">Informasi Penting</h3>
                    </div>
                    <div className="space-y-4 text-sm text-stone-600">
                      <div className="flex gap-3">
                        <div className="mt-1 p-1 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                          <BookOpen size={16} />
                        </div>
                        <p>Pembelajaran mandiri diharapkan tidak membebani murid dengan PR berlebihan.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-1 p-1 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                          <Users size={16} />
                        </div>
                        <p>Kegiatan di sekolah fokus pada peningkatan iman, takwa, dan karakter mulia.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-1 p-1 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                          <Heart size={16} />
                        </div>
                        <p>Penyesuaian aktivitas fisik (PJOK) selama bulan Ramadan.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-1 p-1 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                          <Coffee size={16} />
                        </div>
                        <p>Libur Idulfitri dimanfaatkan untuk silaturahmi dan persaudaraan.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                      <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-widest">Target Karakter</h4>
                      <p className="text-lg font-medium leading-snug italic">"Membentuk karakter mulia dan kepribadian utama bagi seluruh peserta didik."</p>
                    </div>
                    <Moon className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-800/30 rotate-12" />
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="max-w-5xl mx-auto px-4 py-12 text-center text-stone-400 text-xs space-y-2">
              <p>© 2026 {schoolInfo.name}. All rights reserved.</p>
              <p>Aplikasi ini dibuat berdasarkan Juknis Pembelajaran Ramadan 1447H.</p>
            </footer>
          </motion.div>
        ) : view === 'activity-detail' ? (
          <motion.div
            key="activity-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-stone-50 text-stone-900 p-4 sm:p-8"
          >
            <div className="max-w-5xl mx-auto space-y-8">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button 
                  onClick={() => setView('calendar')}
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-bold group w-fit"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <ChevronLeft size={24} />
                  </div>
                  <span>Kembali ke Kalender</span>
                </button>
                <div className="sm:text-right">
                  <h2 className="text-3xl font-black tracking-tight text-emerald-950">JADWAL KEGIATAN</h2>
                  <p className="text-emerald-600 font-bold flex items-center sm:justify-end gap-2">
                    <CalendarIcon size={18} />
                    {activeActivityDate && new Date(activeActivityDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </header>

              <div className="space-y-12">
                {activeActivityDate && getPhaseActivities(activeActivityDate)?.map((phase, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                    className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-xl shadow-emerald-900/5"
                  >
                    <div className="p-8 bg-emerald-600 text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
                          PESANTREN RAMADAN 1447H
                        </span>
                        <h3 className="text-2xl font-black tracking-tight uppercase">{phase.phase}</h3>
                        <p className="text-emerald-100 font-medium mt-1">Tema: {phase.theme}</p>
                      </div>
                      <Moon className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50/50 border-b border-stone-100">
                            <th className="px-8 py-5 text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] w-40">Waktu</th>
                            <th className="px-8 py-5 text-[11px] font-black text-stone-400 uppercase tracking-[0.2em]">Aktivitas Kegiatan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                          {phase.schedule.map((item, sIdx) => (
                            <tr 
                              key={sIdx} 
                              className={`transition-colors group ${item.materialId ? 'cursor-pointer hover:bg-emerald-50' : 'hover:bg-stone-50/50'}`}
                              onClick={() => {
                                if (item.materialId) {
                                  setActiveMaterialId(item.materialId);
                                  setView('material-detail');
                                }
                              }}
                            >
                              <td className="px-8 py-6 whitespace-nowrap align-top">
                                <span className={`px-4 py-2 rounded-xl text-sm font-mono font-black border transition-colors ${
                                  item.materialId 
                                    ? 'bg-emerald-600 text-white border-emerald-700 group-hover:bg-emerald-700' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:bg-emerald-100'
                                }`}>
                                  {item.time}
                                </span>
                              </td>
                              <td className="px-8 py-6 align-top">
                                <div className="flex items-start justify-between gap-4">
                                  <p className={`text-base leading-relaxed font-medium ${item.materialId ? 'text-emerald-900' : 'text-stone-700'}`}>
                                    {item.activity}
                                  </p>
                                  {item.materialId && (
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs uppercase tracking-wider shrink-0 bg-emerald-100 px-2 py-1 rounded-md group-hover:bg-emerald-200 transition-colors">
                                      <span>Materi</span>
                                      <ArrowRight size={14} />
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ))}
              </div>

              <footer className="pt-12 pb-8 text-center border-t border-stone-200">
                <p className="text-stone-400 text-sm font-medium">© 2026 {schoolInfo.name}</p>
                <p className="text-stone-300 text-xs mt-1 italic">Aplikasi ini dibuat berdasarkan Juknis Pembelajaran Ramadan 1447H Kabupaten Bandung</p>
              </footer>
            </div>
          </motion.div>
        ) : view === 'material-detail' && activeMaterialId ? (
          <motion.div
            key="material-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-stone-50 pb-20"
          >
            {/* Header */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
              <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                <button
                  onClick={() => setView('activity-detail')}
                  className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-medium transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <ChevronLeft size={20} />
                  </div>
                  <span>Kembali ke Jadwal</span>
                </button>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{getMaterialById(activeMaterialId)?.category}</p>
                  <p className="text-sm font-medium text-stone-400">{getMaterialById(activeMaterialId)?.fase}</p>
                </div>
              </div>
            </header>

            <article className="max-w-3xl mx-auto px-6 py-16">
              {/* Title Section */}
              <div className="mb-16 text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-serif font-black text-stone-900 mb-6 leading-tight"
                >
                  {getMaterialById(activeMaterialId)?.title}
                </motion.h1>
                {getMaterialById(activeMaterialId)?.introduction && (
                  <p className="text-xl text-stone-600 font-medium leading-relaxed italic max-w-2xl mx-auto">
                    "{getMaterialById(activeMaterialId)?.introduction}"
                  </p>
                )}
              </div>

              {/* Content Sections */}
              <div className="space-y-16">
                {getMaterialById(activeMaterialId)?.sections.map((section, idx) => (
                  <motion.section 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                      <h2 className="text-2xl font-serif font-bold text-stone-800">{section.title}</h2>
                    </div>

                    <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
                      {section.content.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {section.points && (
                      <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-600" />
                            </div>
                            <span className="font-medium text-stone-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.dalil && (
                      <div className="mt-10 bg-emerald-900 text-white p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="relative z-10">
                          <p className="text-3xl md:text-4xl font-serif text-right mb-8 leading-[1.8] font-medium" dir="rtl">
                            {section.dalil.arabic}
                          </p>
                          <div className="space-y-4 border-l-2 border-emerald-500/50 pl-6">
                            <p className="text-emerald-100 italic text-lg leading-relaxed">
                              "{section.dalil.translation}"
                            </p>
                            <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest">
                              — {section.dalil.source}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.section>
                ))}

                {/* Activities Section */}
                {getMaterialById(activeMaterialId)?.activities && (
                  <section className="bg-stone-100 rounded-[2.5rem] p-10 md:p-16 border border-stone-200">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                        <PlayCircle size={24} />
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-stone-800">Aktivitas & Tantangan</h2>
                    </div>
                    <div className="space-y-4">
                      {getMaterialById(activeMaterialId)?.activities?.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-emerald-300 transition-colors">
                          <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-black text-stone-400 shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-stone-700 font-medium leading-relaxed">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Key Messages */}
                {getMaterialById(activeMaterialId)?.keyMessages && (
                  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getMaterialById(activeMaterialId)?.keyMessages?.map((msg, idx) => (
                      <div key={idx} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                          <Star size={24} fill="currentColor" />
                        </div>
                        <p className="text-stone-800 font-bold leading-relaxed">
                          {msg}
                        </p>
                      </div>
                    ))}
                  </section>
                )}

                {/* Closing Doa */}
                {getMaterialById(activeMaterialId)?.closingDoa && (
                  <section className="text-center py-10 border-t border-stone-200">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                      Doa Penutup
                    </div>
                    <p className="text-2xl font-serif font-medium text-stone-800 mb-4 max-w-2xl mx-auto leading-relaxed">
                      "{getMaterialById(activeMaterialId)?.closingDoa?.text}"
                    </p>
                    {getMaterialById(activeMaterialId)?.closingDoa?.translation && (
                      <p className="text-stone-500 italic">
                        {getMaterialById(activeMaterialId)?.closingDoa?.translation}
                      </p>
                    )}
                  </section>
                )}
              </div>
            </article>

            {/* Footer */}
            <footer className="max-w-4xl mx-auto px-6 pt-10 border-t border-stone-200 text-center text-stone-400 text-sm">
              <p>© 2026 {schoolInfo.name} • Panduan Pesantren Ramadhan 1447H</p>
            </footer>
          </motion.div>
        ) : view === 'student-dashboard' && studentProfile ? (
          <StudentDashboard 
            student={studentProfile} 
            onBack={() => setView('landing')} 
            onLogout={() => {
              setStudentProfile(null);
              localStorage.removeItem('student_profile');
              setView('landing');
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Shared Modals */}
      {/* Student Login Modal */}
      <AnimatePresence>
        {showStudentLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStudentLogin(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <User className="text-emerald-500" />
                  Login Siswa
                </h3>
                <button onClick={() => setShowStudentLogin(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (loginForm.name && loginForm.className && loginForm.parentName) {
                  const profile = {
                    ...loginForm,
                    lastLogin: new Date().toISOString()
                  };
                  setStudentProfile(profile);
                  localStorage.setItem('student_profile', JSON.stringify(profile));
                  setShowStudentLogin(false);
                  setView('student-dashboard');
                }
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nama Lengkap Siswa/Siswi</label>
                  <input 
                    type="text" 
                    required
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="Contoh: Ahmad Fulan"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Kelas / Fase</label>
                  <input 
                    type="text" 
                    required
                    value={loginForm.className}
                    onChange={(e) => setLoginForm({...loginForm, className: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="Contoh: Kelas 3 (Fase B)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Nama Orang Tua / Wali</label>
                  <input 
                    type="text" 
                    required
                    value={loginForm.parentName}
                    onChange={(e) => setLoginForm({...loginForm, parentName: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="Contoh: Bapak Fulan"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-emerald-600/20"
                >
                  <Check size={20} />
                  <span>Masuk ke Jurnal</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className={`h-24 ${selectedEvent.color.split(' ')[0]} flex items-end p-6`}>
                <h3 className="text-xl font-black tracking-tight">{selectedEvent.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
                  <CalendarIcon size={16} />
                  <span>{new Date(selectedEvent.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</span>
                  {selectedEvent.startDate !== selectedEvent.endDate && (
                    <>
                      <span>-</span>
                      <span>{new Date(selectedEvent.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </>
                  )}
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {selectedEvent.description}
                </p>
                {selectedEvent.phaseActivities && (
                  <button 
                    onClick={() => {
                      setActiveActivityDate(selectedEvent.clickedDate || selectedEvent.startDate);
                      setView('activity-detail');
                      setSelectedEvent(null);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen size={18} />
                    <span>Lihat Detail Kegiatan</span>
                  </button>
                )}
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit School Info Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Edit Identitas Sekolah</h3>
                <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nama Sekolah</label>
                  <input 
                    type="text" 
                    value={tempSchoolInfo.name}
                    onChange={(e) => setTempSchoolInfo({...tempSchoolInfo, name: e.target.value})}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Alamat Sekolah</label>
                  <input 
                    type="text" 
                    value={tempSchoolInfo.address}
                    onChange={(e) => setTempSchoolInfo({...tempSchoolInfo, address: e.target.value})}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">URL Logo (Opsional)</label>
                  <input 
                    type="text" 
                    value={tempSchoolInfo.logoUrl}
                    onChange={(e) => setTempSchoolInfo({...tempSchoolInfo, logoUrl: e.target.value})}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveSchoolInfo}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  <span>Simpan</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
