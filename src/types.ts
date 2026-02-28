/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolInfo {
  name: string;
  address: string;
  logoUrl?: string;
}

export interface CalendarEvent {
  id: string;
  startDate: string; // ISO format YYYY-MM-DD
  endDate: string;   // ISO format YYYY-MM-DD
  title: string;
  description: string;
  type: 'mandiri' | 'sekolah' | 'libur' | 'kembali' | 'weekend';
  color: string;
}

export const RAMADAN_EVENTS: CalendarEvent[] = [
  {
    id: 'march-1',
    startDate: '2026-03-01',
    endDate: '2026-03-01',
    title: 'Pembiasaan Baik',
    description: 'pembiasaan baik yang di lakukan oleh siswa dengan bimbingan orang tua siswa di rumah',
    type: 'weekend',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    id: 'march-7',
    startDate: '2026-03-07',
    endDate: '2026-03-07',
    title: 'Pembiasaan Baik',
    description: 'pembiasaan baik yang di lakukan oleh siswa dengan bimbingan orang tua siswa di rumah',
    type: 'weekend',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    id: 'march-8',
    startDate: '2026-03-08',
    endDate: '2026-03-08',
    title: 'Pembiasaan Baik',
    description: 'pembiasaan baik yang di lakukan oleh siswa dengan bimbingan orang tua siswa di rumah',
    type: 'weekend',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    id: '1',
    startDate: '2026-02-18',
    endDate: '2026-02-20',
    title: 'Pembelajaran Mandiri',
    description: 'Kegiatan pembelajaran dilaksanakan secara mandiri di lingkungan keluarga, tempat ibadah, dan masyarakat (Hari Efektif).',
    type: 'mandiri',
    color: 'bg-amber-100 border-amber-500 text-amber-800'
  },
  {
    id: '1-sat',
    startDate: '2026-02-21',
    endDate: '2026-02-21',
    title: 'Libur Akhir Pekan',
    description: 'Hari Sabtu adalah hari libur belajar di sekolah.',
    type: 'weekend',
    color: 'bg-rose-50 border-rose-200 text-rose-600'
  },
  {
    id: 'feb-28',
    startDate: '2026-02-28',
    endDate: '2026-02-28',
    title: 'Pembiasaan Baik',
    description: 'pembiasaan baik yang di lakukan oleh siswa dengan bimbingan orang tua siswa di rumah',
    type: 'weekend',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    id: '2',
    startDate: '2026-02-23',
    endDate: '2026-03-13',
    title: 'Pembelajaran di Satuan Pendidikan',
    description: 'Kegiatan bermanfaat untuk meningkatkan iman, takwa, akhlak mulia, kepemimpinan, dan sosial pada hari efektif (Senin-Jumat).',
    type: 'sekolah',
    color: 'bg-emerald-100 border-emerald-500 text-emerald-800'
  },
  {
    id: '3',
    startDate: '2026-03-15',
    endDate: '2026-03-27',
    title: 'Libur Bersama Idulfitri',
    description: 'Libur bersama idul fitri',
    type: 'libur',
    color: 'bg-rose-100 border-rose-500 text-rose-800 shadow-inner'
  },
  {
    id: 'weekend-28',
    startDate: '2026-03-28',
    endDate: '2026-03-28',
    title: 'Libur Akhir Pekan',
    description: 'hari libur tidak efektif',
    type: 'weekend',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    id: 'weekend-29',
    startDate: '2026-03-29',
    endDate: '2026-03-29',
    title: 'Libur Akhir Pekan',
    description: 'libur hari tidak efektif',
    type: 'weekend',
    color: 'bg-red-100 border-red-500 text-red-800'
  },
  {
    id: '5',
    startDate: '2026-03-30',
    endDate: '2026-03-30',
    title: 'Masuk Kembali',
    description: 'Kegiatan pembelajaran di sekolah dilaksanakan kembali (Hari Senin).',
    type: 'kembali',
    color: 'bg-blue-100 border-blue-500 text-blue-800'
  }
];
