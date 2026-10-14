// Structured data for the Perkhidmatan infographic pages. Facts only (from Company Profile v6 / Taklimat MAIJ / En Azhar).
// No costs, allocations or contractor names. Images are Unsplash placeholders: see public/img/s/CREDITS.md
const T = (ms, en) => ({ ms, en });

const ICON = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  building: 'M4 21V4h10v17M14 9h6v12M8 8h2M8 12h2M8 16h2',
  shop: 'M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM8 7h8M8 11h8',
  mosque: 'M12 3c-1 2-4 3-4 7h8c0-4-3-5-4-7zM6 10v11M18 10v11M3 21h18M10 21v-4h4v4',
  roof: 'M2 12l10-8 10 8M5 11v9h14v-9',
  bolt: 'M13 2L5 14h6l-1 8 8-12h-6z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  waves: 'M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0',
  paint: 'M5 4h12v5H5zM17 6h3v6H11v3M11 15v6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
  check: 'M6 3h12v18H6zM9 12l2 2 4-4M9 7h6',
  tools: 'M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-2z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  fire: 'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3-4z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20v-1.5A4.5 4.5 0 0 1 7 14h4a4.5 4.5 0 0 1 4.5 4.5V20M17 11a2.5 2.5 0 1 0 0-5',
  heart: 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z',
  bed: 'M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-8v6',
  ruler: 'M3 17L17 3l4 4L7 21zM8 12l2 2M11 9l2 2M14 6l2 2',
};

const services = {
  'pembangunan-hartanah': {
    image: 'pembangunan-hartanah-1.jpg', image2: 'pembangunan-hartanah-2.jpg',
    stats: [
      { v: '7,862', l: T('Unit kediaman', 'Residential units') },
      { v: '100', l: T('Ruang niaga', 'Commercial units') },
      { v: 'RM2.64b', l: T('GDV projek strategik 2017–2028', 'GDV of strategic projects 2017–2028') },
      { v: '30+', l: T('Tahun pengalaman', 'Years of experience') },
    ],
    scopeTitle: T('Apa yang kami bangunkan', 'What we develop'),
    scope: [
      { i: 'home', t: T('Rumah Mampu Milik Johor (RMMJ)', 'Rumah Mampu Milik Johor (RMMJ)'), d: T('RMMJ A hingga D untuk kumpulan B40 dan M40', 'RMMJ A to D for B40 and M40 households') },
      { i: 'building', t: T('Pangsapuri & Pangsapuri Perkhidmatan', 'Apartments & Serviced Apartments'), d: T('Menara kediaman berbilang plot', 'Multi-plot residential towers') },
      { i: 'roof', t: T('Rumah Teres', 'Terrace Houses'), d: T('Sebuah dan dua tingkat', 'Single and double storey') },
      { i: 'shop', t: T('Kedai Pejabat', 'Shop-Offices'), d: T('Premis komersial untuk komuniti', 'Commercial premises for communities') },
      { i: 'layers', t: T('Inkubator Perniagaan', 'Business Incubators'), d: T('Unit sewa untuk usahawan kecil', 'Rental units for small entrepreneurs') },
    ],
    stepsTitle: T('Jejak kami', 'Our track record'),
    steps: [
      { n: '1985', t: T('Sekolah agama seluruh Johor', 'Religious schools across Johor') },
      { n: '2000', t: T('Kuarters Polis Bukit Chagar', 'Bukit Chagar Police Quarters') },
      { n: '2014', t: T('Taman Perbadanan Islam pertama', 'First Taman Perbadanan Islam') },
      { n: '2026', t: T('TPI Rengit siap, Telok Permata dibangunkan', 'TPI Rengit completed, Telok Permata under way') },
    ],
    cta: { href: 'projek', label: T('Lihat semua projek', 'View all projects') },
  },
  'pengurusan-projek': {
    image: 'pengurusan-projek-1.jpg', image2: 'pengurusan-projek-2.jpg',
    stats: [
      { v: '4', l: T('Pembangunan diuruskan (JMB)', 'Developments managed (JMB)') },
      { v: '2', l: T('Masjid dibaik pulih', 'Mosques repaired') },
      { v: '1', l: T('Bangunan korporat dipatuhi BOMBA & JKKP', 'Corporate building brought to BOMBA & DOSH compliance') },
    ],
    scopeTitle: T('Skop kerja', 'Scope of work'),
    scope: [
      { i: 'layers', t: T('Struktur', 'Structure'), d: T('Pemeriksaan dan baik pulih struktur', 'Structural inspection and repair') },
      { i: 'paint', t: T('Arkitektur', 'Architecture'), d: T('Kemasan, bumbung dan kalis air', 'Finishes, roofing and waterproofing') },
      { i: 'bolt', t: T('Elektrikal', 'Electrical'), d: T('Pendawaian dan fitting', 'Wiring and fittings') },
      { i: 'drop', t: T('Mekanikal & paip', 'Mechanical & plumbing'), d: T('Perpaipan dan pembentungan', 'Piping and sewerage') },
      { i: 'fire', t: T('Pematuhan', 'Compliance'), d: T('Kehendak BOMBA dan JKKP', 'BOMBA and DOSH requirements') },
    ],
    stepsTitle: T('Pengalaman terpilih', 'Selected experience'),
    steps: [
      { n: '01', t: T('Bangunan PIJ Holdings', 'PIJ Holdings Building') },
      { n: '02', t: T('Masjid Sungai Balang, Muar', 'Masjid Sungai Balang, Muar') },
      { n: '03', t: T('Masjid Ladang Zamrud, Kahang', 'Masjid Ladang Zamrud, Kahang') },
      { n: '04', t: T('TPI Datin Halimah, Stulang Baru, Larkin dan Alif Sejahtera (JMB)', 'TPI Datin Halimah, Stulang Baru, Larkin and Alif Sejahtera (JMB)') },
    ],
    cta: { href: 'hubungi', label: T('Hubungi kami', 'Contact us') },
  },
  'sekolah-masjid-surau': {
    image: 'sekolah-masjid-surau-1.webp', image2: 'sekolah-masjid-surau-2.jpg',
    stats: [
      { v: '89', l: T('Sekolah agama disiapkan', 'Religious schools completed') },
      { v: '1', l: T('Masjid disiapkan', 'Mosque completed') },
      { v: '1', l: T('Surau disiapkan', 'Surau completed') },
    ],
    scopeTitle: T('Kerja membina dan menaik taraf', 'Build and upgrade works'),
    scope: [
      { i: 'roof', t: T('Bumbung', 'Roofing'), d: T('Binaan baharu dan naik taraf', 'New and upgraded') },
      { i: 'bolt', t: T('Pendawaian baharu', 'New wiring'), d: T('Sistem elektrikal selamat', 'Safe electrical systems') },
      { i: 'drop', t: T('Pembentungan & paip', 'Sewerage & piping'), d: T('Sistem perpaipan lengkap', 'Complete piping systems') },
      { i: 'waves', t: T('Saliran & kaki lima', 'Drains & walkways'), d: T('Longkang dan laluan', 'Drains and pathways') },
      { i: 'users', t: T('Tandas', 'Toilets'), d: T('Baik pulih kemudahan asas', 'Basic facilities repair') },
      { i: 'building', t: T('Pejabat & kantin', 'Offices & canteens'), d: T('Kemudahan sokongan', 'Support facilities') },
    ],
    stepsTitle: T('Premis yang kami layani', 'Premises we serve'),
    steps: [
      { n: '', i: 'book', t: T('Sekolah Agama Kerajaan Johor, Maahad, SRAB & Sekolah Menengah Agama', 'Johor Government Religious Schools, Maahad, SRAB & Religious Secondary Schools') },
      { n: '', i: 'mosque', t: T('Masjid Kariah Negeri Johor', 'Johor Mosques') },
      { n: '', i: 'home', t: T('Surau', 'Surau') },
    ],
    cta: { href: 'hubungi', label: T('Hubungi kami', 'Contact us') },
  },
  'perumahan-asnaf': {
    image: 'perumahan-asnaf-1.jpg', image2: null,
    stats: [
      { v: '660', l: T('Kaki persegi', 'Sq ft floor area') },
      { v: '3', l: T('Bilik tidur', 'Bedrooms') },
      { v: '1', l: T('Tandas', 'Bathroom') },
    ],
    scopeTitle: T('Spesifikasi rumah baharu', 'New-home specification'),
    scope: [
      { i: 'layers', t: T('Dinding', 'Walls'), d: T('Batu pasir dengan kemasan lepaan', 'Sandcrete with plaster finish') },
      { i: 'ruler', t: T('Lantai', 'Floor'), d: T('Konkrit 100mm, kemasan lepaan simen', '100mm concrete, cement screed') },
      { i: 'roof', t: T('Bumbung', 'Roof'), d: T('Metal decking, siling plaster board', 'Metal decking, plasterboard ceiling') },
      { i: 'drop', t: T('Sanitari', 'Sanitary'), d: T('Tangki septik individu', 'Individual septic tank') },
      { i: 'bolt', t: T('Elektrikal', 'Electrical'), d: T('1 kipas, 8 lampu, 9 soket', '1 fan, 8 lights, 9 sockets') },
    ],
    stepsTitle: T('Kerja membaik pulih', 'Repair works'),
    steps: [
      { n: '', i: 'roof', t: T('Siling & bumbung', 'Ceiling & roof') },
      { n: '', i: 'bolt', t: T('Pendawaian baharu', 'New wiring') },
      { n: '', i: 'drop', t: T('Pembentungan & paip', 'Sewerage & piping') },
      { n: '', i: 'tools', t: T('Pintu, tingkap & pembaikan am', 'Doors, windows & general repairs') },
    ],
    cta: { href: 'hubungi', label: T('Hubungi kami', 'Contact us') },
  },
  'wakaf-baitulmal': {
    image: 'wakaf-baitulmal-1.jpg', image2: 'wakaf-baitulmal-2.jpg',
    stats: [
      { v: '4', l: T('Peringkat proses kerja', 'Work-process stages') },
      { v: '4', l: T('Bidang kerja', 'Work areas') },
    ],
    scopeTitle: T('Bidang kerja', 'Work areas'),
    scope: [
      { i: 'layers', t: T('Struktur', 'Structure'), d: T('Pemendapan dan keretakan bangunan', 'Building settlement and cracks') },
      { i: 'paint', t: T('Arkitektur', 'Architecture'), d: T('Kemasan, cat, bumbung bocor, kalis air', 'Finishes, paint, roof leaks, waterproofing') },
      { i: 'bolt', t: T('Elektrikal', 'Electrical'), d: T('Pendawaian dan fitting kipas/lampu', 'Wiring and fan/light fittings') },
      { i: 'drop', t: T('Mekanikal', 'Mechanical'), d: T('Perpaipan, lif, loji rawatan kumbahan', 'Piping, lifts, sewage treatment plant') },
    ],
    stepsTitle: T('Proses kerja', 'Work process'),
    steps: [
      { n: '1', i: 'search', t: T('Pemeriksaan', 'Inspection') },
      { n: '2', i: 'doc', t: T('Pelaporan', 'Reporting') },
      { n: '3', i: 'check', t: T('Method of Statement', 'Method of Statement') },
      { n: '4', i: 'tools', t: T('Membaik pulih', 'Repair works') },
    ],
    cta: { href: 'hubungi', label: T('Hubungi kami', 'Contact us') },
  },
};

module.exports = { services, ICON };
