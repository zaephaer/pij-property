// Integriti & Anti-Rasuah page: static labels + default commitment draft (editable in admin > Tetapan).
// ponytail: default commitment is a draft: management must review/replace it before go-live.
const T = (ms, en) => ({ ms, en });

module.exports = {
  title: T('Integriti & Anti-Rasuah', 'Integrity & Anti-Bribery'),
  lead: T('Komitmen kami terhadap urus tadbir yang telus, beretika dan bebas daripada rasuah.',
          'Our commitment to transparent, ethical and bribery-free governance.'),
  commitmentH: T('Komitmen pengurusan', 'Management commitment'),
  commitmentBy: T('Pengurusan PIJ Property Development Sdn. Bhd.', 'Management of PIJ Property Development Sdn. Bhd.'),
  certH: T('Pensijilan sistem pengurusan anti-rasuah', 'Anti-bribery management system certification'),
  certNote: T('Sijil di bawah dipaparkan selagi masih sah.', 'The certificates below are displayed while they remain valid.'),
  reportH: T('Saluran aduan salah laku', 'Whistleblowing channel'),
  reportP: T('Jika anda mengesyaki atau mengetahui sebarang salah laku, rasuah atau pelanggaran etika yang melibatkan syarikat kami, sila laporkan melalui saluran di bawah. Aduan dikendalikan secara sulit.',
             'If you suspect or know of any misconduct, bribery or ethical breach involving our company, please report it through the channel below. Reports are handled in confidence.'),
  sprm: T('Anda juga boleh melapor terus kepada Suruhanjaya Pencegahan Rasuah Malaysia (SPRM).',
          'You may also report directly to the Malaysian Anti-Corruption Commission (MACC).'),
  sprmUrl: 'https://www.sprm.gov.my/',
  allCerts: T('Lihat semua pensijilan', 'View all certifications'),
  defaultCommitment: T(
    'PIJ Property Development Sdn. Bhd. komited menjalankan perniagaan dengan integriti, telus dan mematuhi undang-undang. Kami tidak bertolak ansur terhadap sebarang bentuk rasuah, termasuk dalam urusan dengan pembeli, kontraktor, pembekal dan agensi kerajaan. Semua kakitangan dan pihak yang bertindak bagi pihak kami dikehendaki mematuhi komitmen ini.',
    'PIJ Property Development Sdn. Bhd. is committed to conducting business with integrity, transparency and in compliance with the law. We have zero tolerance for any form of bribery, including in dealings with buyers, contractors, suppliers and government agencies. All staff and parties acting on our behalf are required to comply with this commitment.'),
};
