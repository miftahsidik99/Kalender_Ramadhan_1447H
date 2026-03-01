import { PhaseActivity } from './types';

export const getPhaseActivities = (date: string): PhaseActivity[] | undefined => {
  const activities: Record<string, PhaseActivity[]> = {
    '2026-03-05': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan Al-Qur'an (Al-Fatihah, An-Nas, Al-Falaq, Al-Ikhlas, Al-Lahab, dan An-Nashr), Membaca Asmaul Husna, Membaca Do'a Buat Kedua Orang Tua" },
          { time: '08.00 - 08.40', activity: 'Materi Akidah: Allah Maha Baik Aku Cinta Allah' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan Al-Qur'an (Al-Kafirun, Al-Kautsar, Al-Maun, Al-Quraisy, Al-Fiil, dan Al-Humazah), Membaca Asmaul Husna, Hafalan Do'a Mau Tidur" },
          { time: '08.00 - 08.40', activity: 'Materi Akidah: Iman Kepada Allah Al Malik dan Al-Quddus' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan Al-Qur'an (Al-Ashr, At-Takatsur, Al-Qoriah, Al-Adiyat, Al-Zalzalah dan Al-Bayyinah), Membaca Asmaul Husna, Membaca Do'a Masuk Rumah" },
          { time: '08.00 - 08.40', activity: 'Materi Akidah: Iman Kepada Hari Akhir dan Tanggung Jawab Amal' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-06': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan Al-Qur'an (Al-Fatihah hingga An-Nashr), Membaca Asmaul Husna, Membaca Do'a Kebaikan Dunia Akhirat" },
          { time: '08.00 - 08.40', activity: 'Materi Akhlaq: Berbicara Baik dan Sopan kepada Orang Tua dan Guru' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Kafirun hingga Al-Humazah), Membaca Asmaul Husna, Hafalan Do'a Bangun Tidur" },
          { time: '08.00 - 08.40', activity: 'Materi Akhlaq: Jujur dan Amanah dalam Kehidupan Sehari-hari' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Ashr hingga Al-Bayyinah), Membaca Asmaul Husna, Membaca Do'a Keluar Rumah" },
          { time: '08.00 - 08.40', activity: 'Materi Akhlaq: Menjadi Teladan dalam Kebaikan' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-07': [
      {
        phase: 'Semua Fase (A, B, C)',
        theme: 'Pembiasaan Baik di Rumah',
        schedule: [
          { time: 'Bebas', activity: 'Pembiasaan baik yang dilakukan oleh siswa dengan bimbingan orang tua di rumah' }
        ]
      }
    ],
    '2026-03-08': [
      {
        phase: 'Semua Fase (A, B, C)',
        theme: 'Pembiasaan Baik di Rumah',
        schedule: [
          { time: 'Bebas', activity: 'Pembiasaan baik yang dilakukan oleh siswa dengan bimbingan orang tua di rumah' }
        ]
      }
    ],
    '2026-03-09': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan Al-Qur'an (Al-Fatihah hingga An-Nashr), Membaca Asmaul Husna, Hafalan Do'a Berbuka Shaum" },
          { time: '08.00 - 08.40', activity: 'Materi Fiqh: Belajar Puasa Ramadhan dengan Hati Gembira' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Kafirun hingga Al-Humazah), Membaca Asmaul Husna, Hafalan Do'a Masuk Kamar Mandi" },
          { time: '08.00 - 08.40', activity: 'Materi Fiqh: Syarat, Rukun dan Hal Yang Membatalkan Puasa' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Ashr hingga Al-Bayyinah), Membaca Asmaul Husna, Hafalan Do'a Masuk Masjid" },
          { time: '08.00 - 08.40', activity: 'Materi Fiqh: Hikmah Puasa Ramadhan dan Zakat Fitrah' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-10': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Fatihah hingga An-Nashr), Membaca Asmaul Husna, Hafalan Do'a Sebelum Makan" },
          { time: '08.00 - 08.40', activity: 'Materi SPI: Kisah Nabi Muhammad Kecil yang Jujur (Al-Amin)' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Kafirun hingga Al-Humazah), Membaca Asmaul Husna, Hafalan Do'a Keluar Kamar Mandi" },
          { time: '08.00 - 08.40', activity: 'Materi SPI: Perjuangan Nabi di Bulan Ramadhan (Perang Badar)' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Ashr hingga Al-Bayyinah), Membaca Asmaul Husna, Hafalan Do'a Keluar Masjid" },
          { time: '08.00 - 08.40', activity: 'Materi SPI: Strategi Dakwah Rasulullah SAW di Mekah dan Madinah' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-11': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Fatihah hingga An-Nashr), Membaca Asmaul Husna, Hafalan Do'a Sesudah Makan" },
          { time: '08.00 - 08.40', activity: "Materi Al-Qur'an: Mengenal Surat Al-Ikhlash" },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Kafirun hingga Al-Humazah), Membaca Asmaul Husna, Hafalan Do'a Memakai Pakaian" },
          { time: '08.00 - 08.40', activity: "Materi Al-Qur'an: Tadabbur Surat Al-Ashr (Pentingnya Waktu)" },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Ashr hingga Al-Bayyinah), Membaca Asmaul Husna, Hafalan Do'a Naik Kendaraan" },
          { time: '08.00 - 08.40', activity: "Materi Al-Qur'an: Tadabbur Surat Al-Baqoroh: 183 (Tujuan Puasa)" },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-12': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Fatihah hingga An-Nashr), Membaca Asmaul Husna, Hafalan Do'a Ditambahkan Ilmu" },
          { time: '08.00 - 08.40', activity: 'Materi Hadits: Senyum Adalah Sedekah' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Kafirun hingga Al-Humazah), Membaca Asmaul Husna, Hafalan Do'a Melepas Pakaian" },
          { time: '08.00 - 08.40', activity: 'Materi Hadits: Hadits Tentang Keutamaan Puasa Ramadhan' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Ashr hingga Al-Bayyinah), Membaca Asmaul Husna, Hafalan Do'a Bercermin" },
          { time: '08.00 - 08.40', activity: 'Materi Hadits: Hadits Tentang Pemuda Yang Dicintai Allah SWT' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-13': [
      {
        phase: 'Fase A (Kelas 1 & 2)',
        theme: 'Aku Anak Sholih Cinta Ramadhan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Fatihah hingga An-Nashr), Membaca Asmaul Husna, Hafalan Do'a Penutup Majlis" },
          { time: '08.00 - 08.40', activity: 'Materi Fanniyah: Mewarna Kaligrafi Sederhana' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase B (Kelas 3 & 4)',
        theme: 'Ramadhan Membentuk Karakter Tangguh',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Kafirun hingga Al-Humazah), Membaca Asmaul Husna, Mengulang Hafalan Do'a-do'a" },
          { time: '08.00 - 08.40', activity: 'Materi Fanniyah: Drama mini Anak Jujur di Sekolah' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      },
      {
        phase: 'Fase C (Kelas 5 & 6)',
        theme: 'Ramadhan Upgrade Iman dan Kepemimpinan',
        schedule: [
          { time: '07.30 - 08.00', activity: "Pembukaan (Berdo'a), Sholat Dhuha, Mengulang Hafalan (Al-Ashr hingga Al-Bayyinah), Membaca Asmaul Husna, Mengulang Hafalan Do'a-do'a" },
          { time: '08.00 - 08.40', activity: 'Materi Fanniyah: Public Speaking (Lomba Kultum Singkat)' },
          { time: '08.40 - 09.55', activity: 'Mengaji' },
          { time: '09.55 - 10.00', activity: "Penutup (Berdo'a)" }
        ]
      }
    ],
    '2026-03-14': [
      {
        phase: 'Semua Fase (A, B, C)',
        theme: 'Pembiasaan Baik di Rumah',
        schedule: [
          { time: 'Bebas', activity: 'Pembiasaan baik yang dilakukan oleh siswa dengan bimbingan orang tua di rumah' }
        ]
      }
    ]
  };

  return activities[date];
};
