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
  Award,
  FileText,
  X
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [paperSize, setPaperSize] = useState<'A4' | 'F4'>('A4');
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

  const handleCheckAllRamadhan = (dayIndex: number) => {
    const newData = [...jurnalRamadhan];
    const currentDay = newData[dayIndex];
    const isAllChecked = 
      currentDay.puasa && 
      currentDay.salat.subuh && 
      currentDay.salat.dzuhur && 
      currentDay.salat.ashar && 
      currentDay.salat.maghrib && 
      currentDay.salat.isya && 
      currentDay.tarawih && 
      currentDay.mengaji && 
      currentDay.sedekah;

    newData[dayIndex] = {
      ...currentDay,
      puasa: !isAllChecked,
      salat: {
        subuh: !isAllChecked,
        dzuhur: !isAllChecked,
        ashar: !isAllChecked,
        maghrib: !isAllChecked,
        isya: !isAllChecked,
      },
      tarawih: !isAllChecked,
      mengaji: !isAllChecked,
      sedekah: !isAllChecked,
    };
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

  const handleCheckAllKAIH = (dayIndex: number) => {
    const newData = [...jurnalKAIH];
    const currentDay = newData[dayIndex];
    const isAllChecked = 
      currentDay.bangunPagi && 
      currentDay.beribadah && 
      currentDay.berolahraga && 
      currentDay.gemarBelajar && 
      currentDay.makanBergizi && 
      currentDay.bermasyarakat && 
      currentDay.tidurCepat;

    newData[dayIndex] = {
      ...currentDay,
      bangunPagi: !isAllChecked,
      beribadah: !isAllChecked,
      berolahraga: !isAllChecked,
      gemarBelajar: !isAllChecked,
      makanBergizi: !isAllChecked,
      bermasyarakat: !isAllChecked,
      tidurCepat: !isAllChecked,
    };
    saveKAIH(newData);
  };

  const handleDownload = () => {
    setShowPrintModal(true);
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Create PDF document
      const format = paperSize === 'A4' ? 'a4' : [215.9, 330.2]; // F4 size in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: format
      });

      // Get the two pages
      const pages = printRef.current.children;
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Render to canvas
        const canvas = await html2canvas(page, {
          scale: 2, // Higher resolution
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate dimensions to fit page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Add image to PDF
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      // Download the PDF
      pdf.save(`Jurnal_Ramadhan_${student.name.replace(/\s+/g, '_')}.pdf`);
      setShowPrintModal(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
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
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 print:bg-white print:pb-0">
      <style>
        {`
          @media print {
            @page {
              size: ${paperSize === 'A4' ? 'A4' : '215.9mm 330.2mm'};
              margin: 15mm;
            }
          }
        `}
      </style>

      {/* Print Options Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrintModal(false)}
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
                  <FileText className="text-emerald-500" />
                  Pengaturan Cetak PDF
                </h3>
                <button onClick={() => setShowPrintModal(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-stone-600">Pilih ukuran kertas untuk laporan jurnal Anda:</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaperSize('A4')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paperSize === 'A4' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-stone-200 hover:border-emerald-200 text-stone-500'
                    }`}
                  >
                    <span className="text-xl font-black">A4</span>
                    <span className="text-xs">210 x 297 mm</span>
                  </button>
                  <button
                    onClick={() => setPaperSize('F4')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paperSize === 'F4' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-stone-200 hover:border-emerald-200 text-stone-500'
                    }`}
                  >
                    <span className="text-xl font-black">F4</span>
                    <span className="text-xs">215.9 x 330.2 mm</span>
                  </button>
                </div>

                <button 
                  onClick={handlePrint}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-emerald-600/20"
                >
                  <Download size={20} />
                  <span>Lanjutkan Cetak PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-emerald-900 text-white sticky top-0 z-30 shadow-lg print:hidden">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 print:hidden">
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
                    <p className="text-emerald-100 max-w-lg mb-2">
                      Unduh laporan lengkap pengisian jurnal Ramadhan dan 7 KAIH sebagai bukti pelaksanaan kegiatan Pesantren Ramadhan 1447H.
                    </p>
                    <p className="text-emerald-300 text-sm italic">
                      *Klik tombol di samping untuk mengunduh file PDF secara langsung.
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
                    <span>{isDownloading ? 'Menyiapkan PDF...' : 'Unduh File PDF'}</span>
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
                        <td className="px-4 py-3 text-center font-bold text-stone-500 border-r border-stone-100">
                          <div className="flex flex-col items-center gap-1">
                            <span>{entry.day}</span>
                            <button 
                              onClick={() => handleCheckAllRamadhan(idx)}
                              className="text-[10px] text-emerald-600 hover:text-emerald-800 font-medium bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors"
                              title="Ceklis semua ibadah di hari ini"
                            >
                              Semua
                            </button>
                          </div>
                        </td>
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
                        <td className="px-4 py-3 text-center font-bold text-stone-500 border-r border-stone-100">
                          <div className="flex flex-col items-center gap-1">
                            <span>{entry.day}</span>
                            <button 
                              onClick={() => handleCheckAllKAIH(idx)}
                              className="text-[10px] text-amber-600 hover:text-amber-800 font-medium bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition-colors"
                              title="Ceklis semua kebiasaan di hari ini"
                            >
                              Semua
                            </button>
                          </div>
                        </td>
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

      {/* Hidden Printable Area for PDF Generation */}
      <div className="absolute top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
        <div ref={printRef} style={{ width: '1000px', backgroundColor: '#ffffff', color: '#1c1917', fontFamily: 'sans-serif', padding: '40px' }}>
          {/* PAGE 1: JURNAL RAMADHAN */}
          <div style={{ minHeight: '1300px', position: 'relative', marginBottom: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', color: '#064e3b' }}>Laporan Jurnal Ramadhan 1447 H</h1>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#3f3f46' }}>Pesantren Ramadhan</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '2px solid #d4d4d8', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '16px', margin: 0 }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '120px' }}>Nama Siswa</span>: {student.name}</p>
                <p style={{ fontSize: '16px', margin: 0 }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '120px' }}>Kelas</span>: {student.className}</p>
                <p style={{ fontSize: '16px', margin: 0 }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '120px' }}>Nama Orang Tua</span>: {student.parentName}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Capaian Ibadah</p>
                <p style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#064e3b' }}>{ramadhanProgress}%</p>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid #a1a1aa', marginBottom: '48px' }}>
              <thead style={{ backgroundColor: '#f4f4f5' }}>
                <tr>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Hari</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Puasa</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Salat 5 Waktu</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Tarawih</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Mengaji</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Sedekah</th>
                </tr>
              </thead>
              <tbody>
                {jurnalRamadhan.map((entry, idx) => {
                  const salatCount = [entry.salat.subuh, entry.salat.dzuhur, entry.salat.ashar, entry.salat.maghrib, entry.salat.isya].filter(Boolean).length;
                  return (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>{entry.day}</td>
                      <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.puasa ? '✓' : ''}</td>
                      <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{salatCount}/5</td>
                      <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.tarawih ? '✓' : ''}</td>
                      <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.mengaji ? '✓' : ''}</td>
                      <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.sedekah ? '✓' : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '64px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '64px', margin: 0 }}>Mengetahui, Orang Tua/Wali</p>
                <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0, marginTop: '64px' }}>{student.parentName}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '64px', margin: 0 }}>Siswa/Siswi</p>
                <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0, marginTop: '64px' }}>{student.name}</p>
              </div>
            </div>
          </div>

          {/* PAGE 2: JURNAL KAIH */}
          <div style={{ minHeight: '1300px', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', color: '#78350f' }}>Laporan Jurnal 7 KAIH</h1>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#3f3f46' }}>Kebiasaan Anak Indonesia Hebat</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '2px solid #d4d4d8', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '16px', margin: 0 }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '120px' }}>Nama Siswa</span>: {student.name}</p>
                <p style={{ fontSize: '16px', margin: 0 }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '120px' }}>Kelas</span>: {student.className}</p>
                <p style={{ fontSize: '16px', margin: 0 }}><span style={{ fontWeight: 'bold', display: 'inline-block', width: '120px' }}>Nama Orang Tua</span>: {student.parentName}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#71717a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Capaian 7 KAIH</p>
                <p style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: '#78350f' }}>{kaihProgress}%</p>
              </div>
            </div>

            <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid #a1a1aa', marginBottom: '16px' }}>
              <thead style={{ backgroundColor: '#f4f4f5' }}>
                <tr>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }}>Hari</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Bangun Pagi">1</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Beribadah">2</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Berolahraga">3</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Gemar Belajar">4</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Makan Bergizi">5</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Bermasyarakat">6</th>
                  <th style={{ border: '1px solid #a1a1aa', padding: '6px', textAlign: 'center' }} title="Tidur Cepat">7</th>
                </tr>
              </thead>
              <tbody>
                {jurnalKAIH.map((entry, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>{entry.day}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.bangunPagi ? '✓' : ''}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.beribadah ? '✓' : ''}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.berolahraga ? '✓' : ''}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.gemarBelajar ? '✓' : ''}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.makanBergizi ? '✓' : ''}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.bermasyarakat ? '✓' : ''}</td>
                    <td style={{ border: '1px solid #a1a1aa', padding: '4px', textAlign: 'center' }}>{entry.tidurCepat ? '✓' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ marginBottom: '48px', fontSize: '10px', color: '#52525b' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Keterangan 7 KAIH:</strong></p>
              <p style={{ margin: 0 }}>1: Bangun Pagi, 2: Beribadah, 3: Berolahraga, 4: Gemar Belajar, 5: Makan Bergizi, 6: Bermasyarakat, 7: Tidur Cepat</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '64px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '64px', margin: 0 }}>Mengetahui, Orang Tua/Wali</p>
                <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0, marginTop: '64px' }}>{student.parentName}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '64px', margin: 0 }}>Siswa/Siswi</p>
                <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0, marginTop: '64px' }}>{student.name}</p>
              </div>
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
