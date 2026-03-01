import { PhaseActivity } from './types';

export const getPhaseActivities = (date: string): PhaseActivity[] | undefined => {
  const activities: Record<string, PhaseActivity[]> = {
    '2026-03-05': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab, An-Nashr), Membaca Asmaul Husna, Membaca Do'a Buat Kedua Orang Tua" },
          { time: '08.00 - 08.40', activity: 'Materi Akidah: Allah Maha Baik Aku Cinta Allah' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup (Berdo\'a)' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan (Al-Kafirun, Al-Kautsar, Al-Maun, Al-Quraisy, Al-Fiil, Al-Humazah), Asmaul Husna, Do\'a Mau Tidur' },
          { time: '08.00 - 08.40', activity: 'Materi Akidah: Iman Kepada Allah Al Malik dan Al-Quddus' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan (Al-Ashr, At-Takatsur, Al-Qoriah, Al-Adiyat, Al-Zalzalah, Al-Bayyinah), Asmaul Husna, Do\'a Masuk Rumah' },
          { time: '08.00 - 08.40', activity: 'Materi Akidah: Iman Kepada Hari Akhir dan Tanggung Jawab Amal' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-06': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Membaca Asmaul Husna, Do\'a Kebaikan Dunia Akhirat' },
          { time: '08.00 - 08.40', activity: 'Materi Akhlaq: Berbicara Baik dan Sopan kepada Orang Tua dan Guru' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Bangun Tidur. Materi Akhlaq: Jujur dan Amanah dalam Kehidupan Sehari-hari' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Keluar Rumah. Materi Akhlaq: Menjadi Teladan dalam Kebaikan' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-07': [
      {
        phase: 'Semua Fase (A, B, C)',
        theme: 'Pembiasaan Baik di Rumah',
        schedule: [
          { time: 'Bebas', activity: 'Pembiasan baik yang dilakukan oleh siswa dengan bimbingan orang tua di rumah' }
        ]
      }
    ],
    '2026-03-08': [
      {
        phase: 'Semua Fase (A, B, C)',
        theme: 'Pembiasaan Baik di Rumah',
        schedule: [
          { time: 'Bebas', activity: 'Pembiasan baik yang dilakukan oleh siswa dengan bimbingan orang tua di rumah' }
        ]
      }
    ],
    '2026-03-09': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Hafalan Do\'a Berbuka Shaum. Materi Fiqh: Belajar Puasa Ramadhan dengan Hati Gembira' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Masuk Kamar Mandi. Materi Fiqh: Syarat, Rukun dan Hal Yang Membatalkan Puasa' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Masuk Masjid. Materi Fiqh: Hikmah Puasa Ramadhan dan Zakat Fitrah' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-10': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Hafalan Do\'a Sebelum Makan. Materi SPI: Kisah Nabi Muhammad Kecil yang Jujur (Al-Amin)' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Keluar Kamar Mandi. Materi SPI: Perjuangan Nabi di Bulan Ramadhan (Perang Badar)' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Keluar Masjid. Materi SPI: Strategi Dakwah Rasulullah SAW di Mekah dan Madinah' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-11': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Hafalan Do\'a Sesudah Makan. Materi Al-Qur\'an: Mengenal Surat Al-Ikhlash' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Memakai Pakaian. Materi Al-Qur\'an: Tadabbur Surat Al-Ashr Pentingnya Waktu' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Naik Kendaraan. Materi Al-Qur\'an: Tadabbur Surat Al-Baqoroh: 183 (Tujuan Puasa)' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-12': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Hafalan Do\'a Ditambahkan Ilmu. Materi Hadits: Senyum Adalah Sedekah' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Melepas Pakaian. Materi Hadits: Hadits Tentang Keutamaan Puasa Ramadhan' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Do\'a Bercermin. Materi Hadits: Hadits Tentang Pemuda yang Dicintai Allah SWT' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-13': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Hafalan Do\'a Penutup Majlis. Materi Fanniyah: Mewarna Kaligrafi Sederhana' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Mengulang Hafalan Do\'a-do\'a. Materi Fanniyah: Drama mini Anak Jujur di Sekolah' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.40', activity: 'Pembukaan, Sholat Dhuha, Mengulang Hafalan, Asmaul Husna, Mengulang Hafalan Do\'a-do\'a. Materi Fanniyah: Public Speaking (Lomba Kultum Singkat)' },
          { time: '08.40 - 10.00', activity: 'Mengaji dan Penutup' }
        ]
      }
    ],
    '2026-03-14': [
      {
        phase: 'Semua Fase (A, B, C)',
        theme: 'Pembiasaan Baik di Rumah',
        schedule: [
          { time: 'Bebas', activity: 'Pembiasan baik yang dilakukan oleh siswa dengan bimbingan orang tua di rumah' }
        ]
      }
    ]
  };

  return activities[date];
};
