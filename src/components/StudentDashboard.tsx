import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  LogOut, 
  Book, 
  Star, 
  CheckCircle2, 
  Download,
  ChevronLeft,
  Calendar as CalendarIcon,
  Activity,
  Award
} from 'lucide-react';
import html2canvas from 'html2canvas';
import type { StudentProfile, JurnalRamadhanEntry, JurnalKAIHEntry } from '../types';

interface StudentDashboardProps {
  onBack: () => void;
  student: StudentProfile;
  onLogout: () => void;
}

type Tab = 'overview' | 'jurnal-ramadhan' | 'jurnal-kaih';

export function StudentDashboard({ onBack, student, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [jurnalRamadhan, setJurnalRamadhan] = useState<JurnalRamadhanEntry[]>([]);
  const [jurnalKAIH, setJurnalKAIH] = useState<JurnalKAIHEntry[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load data from localStorage
    const savedRamadhan = localStorage.getItem(`jurnal_ramadhan_${student.name}`);
    const savedKAIH = localStorage.getItem(`jurnal_kaih_${student.name}`);

    if (savedRamadhan) {
      setJurnalRamadhan(JSON.parse(savedRamadhan));
    } else {
      // Initialize 30 days
      const initial: JurnalRamadhanEntry[] = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        puasa: false,
        salat: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
        sedekah: false,
        mengaji: false,
        tarawih: false
      }));
      setJurnalRamadhan(initial);
    }

    if (savedKAIH) {
      setJurnalKAIH(JSON.parse(savedKAIH));
    } else {
      const initial: JurnalKAIHEntry[] = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        bangunPagi: false,
        beribadah: false,
        berolahraga: false,
        gemarBelajar: false,
        makanBergizi: false,
        bermasyarakat: false,
        tidurCepat: false
      }));
      setJurnalKAIH(initial);
    }
  }, [student.name]);

  const saveRamadhan = (data: JurnalRamadhanEntry[]) => {
    setJurnalRamadhan(data);
    localStorage.setItem(`jurnal_ramadhan_${student.name}`, JSON.stringify(data));
  };

  const saveKAIH = (data: JurnalKAIHEntry[]) => {
    setJurnalKAIH(data);
    localStorage.setItem(`jurnal_kaih_${student.name}`, JSON.stringify(data));
  };

  const handleRamadhanChange = (dayIndex: number, field: string, subField?: string) => {
    const newData = [...jurnalRamadhan];
    if (subField) {
      newData[dayIndex] = {
        ...newData[dayIndex],
        [field]: {
          ...(newData[dayIndex] as any)[field],
          [subField]: !(newData[dayIndex] as any)[field][subField]
        }
      };
    } else {
      newData[dayIndex] = {
        ...newData[dayIndex],
        [field]: !(newData[dayIndex] as any)[field]
      };
    }
    saveRamadhan(newData);
  };

  const handleKAIHChange = (dayIndex: number, field: keyof JurnalKAIHEntry) => {
    const newData = [...jurnalKAIH];
    newData[dayIndex] = {
      ...newData[dayIndex],
      [field]: !newData[dayIndex][field]
    };
    saveKAIH(newData);
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Laporan_Jurnal_Ramadhan_${student.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Gagal mengunduh laporan. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculate progress
  const totalRamadhanTasks = 30 * 9; // 30 days * (1 puasa + 5 salat + 1 sedekah + 1 mengaji + 1 tarawih)
  const completedRamadhanTasks = jurnalRamadhan.reduce((acc, day) => {
    let count = 0;
    if (day.puasa) count++;
    if (day.salat.subuh) count++;
    if (day.salat.dzuhur) count++;
    if (day.salat.ashar) count++;
    if (day.salat.maghrib) count++;
    if (day.salat.isya) count++;
    if (day.sedekah) count++;
    if (day.mengaji) count++;
    if (day.tarawih) count++;
    return acc + count;
  }, 0);
  const ramadhanProgress = Math.round((completedRamadhanTasks / totalRamadhanTasks) * 100) || 0;

  const totalKAIHTasks = 30 * 7; // 30 days * 7 habits
  const completedKAIHTasks = jurnalKAIH.reduce((acc, day) => {
    let count = 0;
    if (day.bangunPagi) count++;
    if (day.beribadah) count++;
    if (day.berolahraga) count++;
    if (day.gemarBelajar) count++;
    if (day.makanBergizi) count++;
    if (day.bermasyarakat) count++;
    if (day.tidurCepat) count++;
    return acc + count;
  }, 0);
  const kaihProgress = Math.round((completedKAIHTasks / totalKAIHTasks) * 100) || 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Header */}
      <header className="bg-emerald-900 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline font-medium">Kembali</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-lg leading-tight">{student.name}</p>
              <p className="text-emerald-300 text-sm">Kelas {student.className}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center border-2 border-emerald-500">
              <User size={20} />
            </div>
            <button
              onClick={onLogout}
              className="ml-2 p-2 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-stone-200">
          {[
            { id: 'overview', label: 'Ringkasan', icon: <Activity size={18} /> },
            { id: 'jurnal-ramadhan', label: 'Jurnal Ramadhan', icon: <Book size={18} /> },
            { id: 'jurnal-kaih', label: 'Jurnal 7 KAIH', icon: <Star size={18} /> }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === t.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Infographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-6">Progres Jurnal Ramadhan</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-100" />
                      <circle 
                        cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - ramadhanProgress / 100)}`}
                        className="text-emerald-500 transition-all duration-1000 ease-out" 
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-emerald-950">{ramadhanProgress}%</span>
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm">Telah menyelesaikan {completedRamadhanTasks} dari {totalRamadhanTasks} target ibadah.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-6">Progres Jurnal 7 KAIH</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-100" />
                      <circle 
                        cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - kaihProgress / 100)}`}
                        className="text-amber-500 transition-all duration-1000 ease-out" 
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-amber-900">{kaihProgress}%</span>
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm">Telah menerapkan {completedKAIHTasks} dari {totalKAIHTasks} target kebiasaan baik.</p>
                </div>
              </div>

              {/* Download Section */}
              <div className="bg-emerald-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                      <Award className="text-emerald-400" />
                      Laporan Jurnal Ramadhan
                    </h3>
                    <p className="text-emerald-100 max-w-lg">
                      Unduh laporan lengkap pengisian jurnal Ramadhan dan 7 KAIH sebagai bukti pelaksanaan kegiatan Pesantren Ramadhan 1447H.
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full md:w-auto px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isDownloading ? (
                      <div className="w-5 h-5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={20} />
                    )}
                    <span>{isDownloading ? 'Menyiapkan...' : 'Unduh Laporan (PNG)'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'jurnal-ramadhan' && (
            <motion.div
              key="jurnal-ramadhan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden"
            >
              <div className="p-6 bg-emerald-50 border-b border-emerald-100">
                <h2 className="text-xl font-bold text-emerald-900">Jurnal Ramadhan 1447 H</h2>
                <p className="text-emerald-700 text-sm mt-1">Beri tanda centang (✓) pada kotak jika kamu melaksanakan ibadah tersebut.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3 text-center border-r border-stone-200 w-16">Hari</th>
                      <th className="px-4 py-3 text-center border-r border-stone-200">Puasa</th>
                      <th className="px-4 py-3 text-center border-r border-stone-200" colSpan={5}>Salat Fardhu</th>
                      <th className="px-4 py-3 text-center border-r border-stone-200">Tarawih</th>
                      <th className="px-4 py-3 text-center border-r border-stone-200">Mengaji</th>
                      <th className="px-4 py-3 text-center">Sedekah</th>
                    </tr>
                    <tr className="text-xs bg-stone-100/50">
                      <th className="border-r border-stone-200"></th>
                      <th className="border-r border-stone-200"></th>
                      <th className="px-2 py-2 text-center border-r border-stone-200 font-medium">S</th>
                      <th className="px-2 py-2 text-center border-r border-stone-200 font-medium">D</th>
                      <th className="px-2 py-2 text-center border-r border-stone-200 font-medium">A</th>
                      <th className="px-2 py-2 text-center border-r border-stone-200 font-medium">M</th>
                      <th className="px-2 py-2 text-center border-r border-stone-200 font-medium">I</th>
                      <th className="border-r border-stone-200"></th>
                      <th className="border-r border-stone-200"></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {jurnalRamadhan.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 text-center font-bold text-stone-500 border-r border-stone-100">{entry.day}</td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.puasa} onChange={() => handleRamadhanChange(idx, 'puasa')} />
                        </td>
                        <td className="px-2 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.salat.subuh} onChange={() => handleRamadhanChange(idx, 'salat', 'subuh')} />
                        </td>
                        <td className="px-2 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.salat.dzuhur} onChange={() => handleRamadhanChange(idx, 'salat', 'dzuhur')} />
                        </td>
                        <td className="px-2 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.salat.ashar} onChange={() => handleRamadhanChange(idx, 'salat', 'ashar')} />
                        </td>
                        <td className="px-2 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.salat.maghrib} onChange={() => handleRamadhanChange(idx, 'salat', 'maghrib')} />
                        </td>
                        <td className="px-2 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.salat.isya} onChange={() => handleRamadhanChange(idx, 'salat', 'isya')} />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.tarawih} onChange={() => handleRamadhanChange(idx, 'tarawih')} />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.mengaji} onChange={() => handleRamadhanChange(idx, 'mengaji')} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Checkbox checked={entry.sedekah} onChange={() => handleRamadhanChange(idx, 'sedekah')} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'jurnal-kaih' && (
            <motion.div
              key="jurnal-kaih"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden"
            >
              <div className="p-6 bg-amber-50 border-b border-amber-100">
                <h2 className="text-xl font-bold text-amber-900">Jurnal 7 KAIH (Kebiasaan Anak Indonesia Hebat)</h2>
                <p className="text-amber-700 text-sm mt-1">Beri tanda centang (✓) pada kotak jika kamu melaksanakan kebiasaan baik tersebut.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-4 text-center border-r border-stone-200 w-16">Hari</th>
                      <th className="px-4 py-4 text-center border-r border-stone-200">Bangun Pagi</th>
                      <th className="px-4 py-4 text-center border-r border-stone-200">Beribadah</th>
                      <th className="px-4 py-4 text-center border-r border-stone-200">Berolahraga</th>
                      <th className="px-4 py-4 text-center border-r border-stone-200">Gemar Belajar</th>
                      <th className="px-4 py-4 text-center border-r border-stone-200">Makan Bergizi</th>
                      <th className="px-4 py-4 text-center border-r border-stone-200">Bermasyarakat</th>
                      <th className="px-4 py-4 text-center">Tidur Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {jurnalKAIH.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                        <td className="px-4 py-3 text-center font-bold text-stone-500 border-r border-stone-100">{entry.day}</td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.bangunPagi} onChange={() => handleKAIHChange(idx, 'bangunPagi')} color="amber" />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.beribadah} onChange={() => handleKAIHChange(idx, 'beribadah')} color="amber" />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.berolahraga} onChange={() => handleKAIHChange(idx, 'berolahraga')} color="amber" />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.gemarBelajar} onChange={() => handleKAIHChange(idx, 'gemarBelajar')} color="amber" />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.makanBergizi} onChange={() => handleKAIHChange(idx, 'makanBergizi')} color="amber" />
                        </td>
                        <td className="px-4 py-3 text-center border-r border-stone-100">
                          <Checkbox checked={entry.bermasyarakat} onChange={() => handleKAIHChange(idx, 'bermasyarakat')} color="amber" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Checkbox checked={entry.tidurCepat} onChange={() => handleKAIHChange(idx, 'tidurCepat')} color="amber" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Hidden Printable Area */}
      <div className="absolute top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
        <div ref={printRef} className="w-[1200px] bg-white p-12 font-sans text-stone-900 border-[16px] border-emerald-900 relative">
          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-emerald-600" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-600" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-emerald-600" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-emerald-600" />

          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-emerald-950 uppercase tracking-widest mb-2">Laporan Jurnal Ramadhan 1447 H</h1>
            <h2 className="text-2xl font-bold text-emerald-800">Pesantren Ramadhan & 7 KAIH</h2>
          </div>

          <div className="flex justify-between items-end mb-10 border-b-2 border-emerald-100 pb-6">
            <div className="space-y-2">
              <p className="text-lg"><span className="font-bold w-32 inline-block">Nama Siswa</span>: {student.name}</p>
              <p className="text-lg"><span className="font-bold w-32 inline-block">Kelas</span>: {student.className}</p>
              <p className="text-lg"><span className="font-bold w-32 inline-block">Nama Orang Tua</span>: {student.parentName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-stone-500 font-bold uppercase tracking-wider mb-1">Capaian Jurnal</p>
              <div className="flex gap-4">
                <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-bold">Ibadah</p>
                  <p className="text-xl font-black text-emerald-900">{ramadhanProgress}%</p>
                </div>
                <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 font-bold">7 KAIH</p>
                  <p className="text-xl font-black text-amber-900">{kaihProgress}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Ramadhan Print Table */}
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-4 bg-emerald-50 py-2 px-4 rounded-t-xl border-b-2 border-emerald-200">Jurnal Ibadah Ramadhan</h3>
              <table className="w-full text-xs text-left border-collapse border border-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="border border-stone-200 p-2 text-center">Hari</th>
                    <th className="border border-stone-200 p-2 text-center">Puasa</th>
                    <th className="border border-stone-200 p-2 text-center">Salat 5 Waktu</th>
                    <th className="border border-stone-200 p-2 text-center">Tarawih</th>
                    <th className="border border-stone-200 p-2 text-center">Mengaji</th>
                    <th className="border border-stone-200 p-2 text-center">Sedekah</th>
                  </tr>
                </thead>
                <tbody>
                  {jurnalRamadhan.map((entry, idx) => {
                    const salatCount = [entry.salat.subuh, entry.salat.dzuhur, entry.salat.ashar, entry.salat.maghrib, entry.salat.isya].filter(Boolean).length;
                    return (
                      <tr key={idx}>
                        <td className="border border-stone-200 p-1.5 text-center font-bold">{entry.day}</td>
                        <td className="border border-stone-200 p-1.5 text-center">{entry.puasa ? '✓' : ''}</td>
                        <td className="border border-stone-200 p-1.5 text-center">{salatCount}/5</td>
                        <td className="border border-stone-200 p-1.5 text-center">{entry.tarawih ? '✓' : ''}</td>
                        <td className="border border-stone-200 p-1.5 text-center">{entry.mengaji ? '✓' : ''}</td>
                        <td className="border border-stone-200 p-1.5 text-center">{entry.sedekah ? '✓' : ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* KAIH Print Table */}
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-4 bg-amber-50 py-2 px-4 rounded-t-xl border-b-2 border-amber-200">Jurnal 7 KAIH</h3>
              <table className="w-full text-xs text-left border-collapse border border-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="border border-stone-200 p-2 text-center">Hari</th>
                    <th className="border border-stone-200 p-2 text-center" title="Bangun Pagi">1</th>
                    <th className="border border-stone-200 p-2 text-center" title="Beribadah">2</th>
                    <th className="border border-stone-200 p-2 text-center" title="Berolahraga">3</th>
                    <th className="border border-stone-200 p-2 text-center" title="Gemar Belajar">4</th>
                    <th className="border border-stone-200 p-2 text-center" title="Makan Bergizi">5</th>
                    <th className="border border-stone-200 p-2 text-center" title="Bermasyarakat">6</th>
                    <th className="border border-stone-200 p-2 text-center" title="Tidur Cepat">7</th>
                  </tr>
                </thead>
                <tbody>
                  {jurnalKAIH.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="border border-stone-200 p-1.5 text-center font-bold">{entry.day}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.bangunPagi ? '✓' : ''}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.beribadah ? '✓' : ''}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.berolahraga ? '✓' : ''}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.gemarBelajar ? '✓' : ''}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.makanBergizi ? '✓' : ''}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.bermasyarakat ? '✓' : ''}</td>
                      <td className="border border-stone-200 p-1.5 text-center">{entry.tidurCepat ? '✓' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-[10px] text-stone-500 space-y-1">
                <p><strong>Keterangan 7 KAIH:</strong></p>
                <p>1: Bangun Pagi, 2: Beribadah, 3: Berolahraga, 4: Gemar Belajar, 5: Makan Bergizi, 6: Bermasyarakat, 7: Tidur Cepat</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-between items-end">
            <div className="text-center">
              <p className="mb-16">Mengetahui, Orang Tua/Wali</p>
              <p className="font-bold underline">{student.parentName}</p>
            </div>
            <div className="text-center">
              <p className="mb-16">Siswa/Siswi</p>
              <p className="font-bold underline">{student.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange, color = 'emerald' }: { checked: boolean, onChange: () => void, color?: 'emerald' | 'amber' }) {
  const bgClass = color === 'emerald' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-amber-500 border-amber-500 text-white';

  return (
    <button
      onClick={onChange}
      className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
        checked 
          ? bgClass 
          : 'bg-white border-stone-300 hover:border-stone-400'
      }`}
    >
      {checked && <CheckCircle2 size={16} strokeWidth={3} />}
    </button>
  );
}
