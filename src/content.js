// Static bilingual pages. Source: Company Profile v6, Taklimat MAIJ v1, En Azhar deck, CIDB certificate.
// Deliberately no costs, allocations or contractor names (spec: facts + scope only).
const B = (h, p, ul) => ({ h, p, ul });
const T = (ms, en) => ({ ms, en });
const L = (ms, en) => ({ ms, en });

const services = {
  'pembangunan-hartanah': {
    title: T('Pembangunan Hartanah', 'Property Development'),
    lead: T('Pembangunan tanah negeri untuk perumahan mampu milik dan komersial di seluruh Johor.', 'Development of state land for affordable housing and commercial use across Johor.'),
    blocks: [
      B(T('Apa yang kami lakukan', 'What we do'), T('Kami merancang, membangun dan memasarkan Rumah Mampu Milik Johor (RMMJ) dan Taman Perbadanan Islam (TPI) untuk kumpulan B40 dan M40 selaras Dasar Perumahan Awam Johor.', 'We plan, develop and market Rumah Mampu Milik Johor (RMMJ) and Taman Perbadanan Islam (TPI) for the B40 and M40 groups under the Johor Public Housing Policy.')),
      B(T('Pengalaman', 'Track record'), null, L(['Sekolah agama di seluruh Johor (89 unit)', 'Kompleks PIJ Holdings', 'Kuarters Polis Bukit Chagar (200 unit)', 'Pembangunan bercampur Segamat dan Muar (400 unit)', 'Taman Perbadanan Islam: Datin Halimah, Stulang Baru, Larkin, Rengit'], ['Religious schools across Johor (89 units)', 'PIJ Holdings Complex', 'Bukit Chagar Police Quarters (200 units)', 'Mixed development in Segamat and Muar (400 units)', 'Taman Perbadanan Islam: Datin Halimah, Stulang Baru, Larkin, Rengit'])),
    ],
  },
  'pengurusan-projek': {
    title: T('Pengurusan Projek & Penyelenggaraan', 'Project Management & Maintenance'),
    lead: T('Perunding pengurusan projek dan pelaksana kerja baik pulih bangunan.', 'Project management consultancy and building repair works.'),
    blocks: [
      B(T('Skop kerja', 'Scope of work'), null, L(['Baik pulih arkitektur, struktur, elektrikal dan mekanikal', 'Kerja bumbung, pendawaian, perpaipan dan pembentungan', 'Tandas, saliran longkang dan kaki lima', 'Pematuhan kehendak BOMBA dan JKKP'], ['Architectural, structural, electrical and mechanical repair', 'Roofing, wiring, piping and sewerage', 'Toilets, drains and walkways', 'Compliance with BOMBA and DOSH requirements'])),
      B(T('Pengalaman', 'Experience'), T('Kerja baik pulih Bangunan PIJ Holdings, masjid di Sungai Balang (Muar) dan Ladang Zamrud (Kahang), serta pengurusan bersama Taman Perbadanan Islam (JMB).', 'Repair works at the PIJ Holdings building, mosques at Sungai Balang (Muar) and Ladang Zamrud (Kahang), and joint management body (JMB) services for Taman Perbadanan Islam.')),
    ],
  },
  'sekolah-masjid-surau': {
    title: T('Sekolah Agama, Masjid & Surau', 'Religious Schools, Mosques & Surau'),
    lead: T('Pembinaan baharu dan penyelenggaraan prasarana pendidikan dan ibadah.', 'New construction and maintenance of religious education and worship facilities.'),
    blocks: [
      B(T('Skop kerja', 'Scope of work'), null, L(['Membina baharu dan menaik taraf bumbung', 'Sistem pendawaian baharu', 'Sistem pembentungan dan perpaipan', 'Tandas, saliran longkang dan kaki lima', 'Pejabat dan kantin'], ['New construction and roof upgrades', 'New wiring systems', 'Sewerage and piping systems', 'Toilets, drains and walkways', 'Offices and canteens'])),
      B(T('Pengalaman', 'Experience'), T('Berjaya menyiapkan 89 buah sekolah agama di seluruh Johor, sebuah masjid dan sebuah surau.', 'Successfully completed 89 religious schools across Johor, a mosque and a surau.')),
    ],
  },
  'perumahan-asnaf': {
    title: T('Perumahan Asnaf', 'Asnaf Housing'),
    lead: T('Pembinaan baharu dan baik pulih kediaman golongan asnaf fakir dan miskin.', 'New construction and repair of homes for the asnaf (poor and needy).'),
    blocks: [
      B(T('Spesifikasi rumah baharu', 'New-home specification'), null, L(['Luas lantai 660 kaki persegi', 'Tiga bilik tidur dan satu tandas', 'Dinding batu pasir dengan kemasan lepaan', 'Bumbung metal decking, tangki septik individu'], ['660 sq ft floor area', 'Three bedrooms and one bathroom', 'Sandcrete walls with plaster finish', 'Metal decking roof, individual septic tank'])),
      B(T('Kerja baik pulih', 'Repair works'), null, L(['Siling dan bumbung', 'Pendawaian baharu', 'Pembentungan dan perpaipan', 'Pintu dan tingkap, pembaikan am'], ['Ceiling and roof', 'New wiring', 'Sewerage and piping', 'Doors, windows and general repairs'])),
    ],
  },
  'wakaf-baitulmal': {
    title: T('Wakaf & Baitulmal', 'Waqf & Baitulmal'),
    lead: T('Penyelenggaraan dan pembangunan tanah serta premis wakaf dan baitulmal.', 'Maintenance and development of waqf and baitulmal land and premises.'),
    blocks: [
      B(T('Proses kerja', 'Work process'), T('Pemeriksaan, pelaporan, kenyataan kaedah (method of statement) dan kerja membaik pulih.', 'Inspection, reporting, method of statement and repair works.')),
      B(T('Bidang kerja', 'Work areas'), null, L(['Struktur: pemendapan dan keretakan', 'Arkitektur: kemasan, pengecatan, kebocoran bumbung, kalis air', 'Elektrikal: pendawaian dan fitting', 'Mekanikal: perpaipan, lif, loji rawatan kumbahan'], ['Structure: settlement and cracks', 'Architecture: finishes, painting, roof leaks, waterproofing', 'Electrical: wiring and fittings', 'Mechanical: piping, lifts, sewage treatment plant'])),
    ],
  },
};

const about = {
  profil: {
    image: '/img/p/pij-holdings-jb.jpg',
    imageAlt: T('Bangunan PIJ Holdings, Johor Bahru', 'PIJ Holdings Building, Johor Bahru'),
    title: T('Profil Syarikat', 'Company Profile'),
    lead: T('Anak syarikat milik penuh PIJ Holdings Sdn Bhd, cabang perniagaan Perbadanan Islam Johor.', 'A wholly owned subsidiary of PIJ Holdings Sdn Bhd, the business arm of Perbadanan Islam Johor.'),
    blocks: [
      B(T('Maklumat syarikat', 'Company particulars'), null, L(['PIJ Property Development Sdn. Bhd. 199401037712 (323394-D)', 'Ditubuhkan 14 November 1994', 'Modal dibenarkan RM10,000,000; modal berbayar RM5,216,489', '100% ekuiti Bumiputera', 'Lesen LS 0010041'], ['PIJ Property Development Sdn. Bhd. 199401037712 (323394-D)', 'Incorporated 14 November 1994', 'Authorised capital RM10,000,000; paid-up capital RM5,216,489', '100% Bumiputera equity', 'Licence LS 0010041'])),
      B(T('Pengurusan', 'Management'), T('Diuruskan oleh pegawai kanan Perkhidmatan Awam Johor dan pasukan pengurusan berpengalaman. Objektif utama ialah menjadi pembangun hartanah dan perunding pengurusan projek yang terkemuka.', 'Managed by senior Johor Civil Service officers and an experienced management team. Our main objective is to be a reputable property developer and project management consultant.')),
    ],
  },
  'visi-misi': {
    title: T('Visi, Misi & Falsafah', 'Vision, Mission & Philosophy'),
    lead: T('Pelopor pemaju hartanah mampu milik di Johor.', 'Pioneer of affordable property development in Johor.'),
    blocks: [
      B(T('Visi', 'Vision'), T('Menjadi pemaju hartanah dengan produk dan perkhidmatan bertaraf dunia yang memperkaya kualiti hidup, memberi kepercayaan dan mencipta nilai kepada pihak berkepentingan.', 'To be a property developer with world-class products and services that enrich quality of life, provide trust and create value for stakeholders.')),
      B(T('Misi', 'Mission'), null, L(['Menyampaikan produk dan perkhidmatan unggul', 'Memupuk kerjasama dengan rakan kongsi, kontraktor dan pihak berkuasa tempatan', 'Memacu pulangan kewangan yang mampan', 'Menyediakan peluang pertumbuhan kepada pekerja'], ['Deliver superior products and services', 'Foster cooperation with partners, contractors and local authorities', 'Drive sustainable financial returns', 'Provide growth opportunities for employees'])),
      B(T('Nilai teras', 'Core values'), null, L(['Kerja berpasukan', 'Komitmen', 'Kejujuran dan integriti', 'Berorientasikan pelanggan', 'Menghormati manusia', 'Tanggungjawab kepada komuniti dan alam sekitar', 'Disiplin dan penambahbaikan berterusan', 'Keadilan'], ['Teamwork', 'Commitment', 'Honesty and integrity', 'Customer orientation', 'Respect for people', 'Responsibility to community and environment', 'Discipline and continuous improvement', 'Fairness'])),
    ],
  },
  struktur: {
    title: T('Struktur Kumpulan PIJ Holdings', 'PIJ Holdings Group Structure'),
    lead: T('PIJ Property Development ialah sebahagian daripada Kumpulan PIJ Holdings.', 'PIJ Property Development is part of the PIJ Holdings Group.'),
    blocks: [
      B(T('Kumpulan', 'Group'), T('PIJ Holdings Sdn Bhd (dahulu Perisind Holdings Sdn Bhd) ialah cabang perniagaan Perbadanan Islam Johor, ditubuhkan untuk memajukan sosioekonomi ummah melalui tanah, pertanian, perumahan, perusahaan, perlombongan dan perdagangan.', 'PIJ Holdings Sdn Bhd (formerly Perisind Holdings Sdn Bhd) is the business arm of Perbadanan Islam Johor, set up to advance the socio-economy of the ummah through land, agriculture, housing, enterprise, mining and trade.')),
    ],
  },
  integriti: {
    title: T('Integriti & Anti-Rasuah', 'Integrity & Anti-Bribery'),
    lead: T('Komitmen kami terhadap urus tadbir yang telus, beretika dan bebas daripada rasuah.', 'Our commitment to transparent, ethical and bribery-free governance.'),
    blocks: [],
  },
  pensijilan: {
    title: T('Pensijilan', 'Certification'),
    lead: T('Pendaftaran dan pensijilan yang dipegang oleh syarikat.', 'Registrations and certifications held by the company.'),
    blocks: [
      B(T('Perakuan Pendaftaran CIDB', 'CIDB Registration Certificate'), null, L(['No. pendaftaran: 0120160620-JH175989', 'Gred G7 (tiada had nilai tender)', 'Kategori B (B04), CE (CE04, CE21), ME (M15)', 'Sah sehingga 29 Ogos 2028 — status aktif'], ['Registration no.: 0120160620-JH175989', 'Grade G7 (no tender value limit)', 'Categories B (B04), CE (CE04, CE21), ME (M15)', 'Valid until 29 August 2028 — active status'])),
    ],
  },
};

const groups = {
  about: ['profil', 'visi-misi', 'struktur', 'pensijilan', 'integriti'],
  services: Object.keys(services),
};

module.exports = { services, about, groups };
