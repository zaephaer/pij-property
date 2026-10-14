// Privacy Notice (PDPA 2010) draft text, BM + EN. Facts follow the decisions agreed with the owner:
// shared within the group (PIJ Holdings), 12-month retention then anonymised, consent checkbox, no tracking cookies.
// ponytail: draft only: must be reviewed by the company's legal adviser before go-live (tracked on the admin Dashboard).
const T = (ms, en) => ({ ms, en });

module.exports = {
  title: T('Notis Privasi', 'Privacy Notice'),
  lead: T(
    'Notis ini dikeluarkan di bawah Akta Perlindungan Data Peribadi 2010 (Akta 709) untuk menerangkan bagaimana kami mengendalikan data peribadi anda.',
    'This notice is issued under the Personal Data Protection Act 2010 (Act 709) to explain how we handle your personal data.'),
  sections: [
    { h: T('1. Siapa kami', '1. Who we are'),
      p: T('Pengguna data ialah PIJ Property Development Sdn. Bhd. ({company_no}), anak syarikat milik penuh PIJ Holdings Sdn Bhd. Alamat: {address}.',
           'The data user is PIJ Property Development Sdn. Bhd. ({company_no}), a wholly owned subsidiary of PIJ Holdings Sdn Bhd. Address: {address}.') },
    { h: T('2. Data peribadi yang kami kumpul', '2. Personal data we collect'),
      ul: T(['Nama', 'Nombor telefon', 'Alamat emel', 'Projek yang anda minati', 'Kandungan mesej yang anda tulis', 'Tarikh dan masa anda memberi persetujuan'],
            ['Name', 'Telephone number', 'Email address', 'The project you are interested in', 'The content of the message you write', 'The date and time you gave consent']),
      p: T('Data ini dikumpul apabila anda menghantar borang Daftar Minat atau borang Hubungi di laman ini.',
           'This data is collected when you submit the Register Interest or Contact form on this website.') },
    { h: T('3. Tujuan pemprosesan', '3. Purpose of processing'),
      ul: T(['Membalas pertanyaan anda', 'Memberi maklumat projek yang anda minati', 'Urusan pentadbiran dalaman yang berkaitan dengan pertanyaan anda'],
            ['To respond to your enquiry', 'To provide information on the project you are interested in', 'Internal administration related to your enquiry']) },
    { h: T('4. Pendedahan kepada pihak lain', '4. Disclosure to others'),
      p: T('Data anda dikongsi hanya dalam Kumpulan PIJ Holdings (PIJ Property Development Sdn. Bhd. dan PIJ Holdings Sdn Bhd) untuk tujuan di atas. Kami tidak menjual data anda dan tidak mendedahkannya kepada pihak lain kecuali dikehendaki oleh undang-undang.',
           'Your data is shared only within the PIJ Holdings Group (PIJ Property Development Sdn. Bhd. and PIJ Holdings Sdn Bhd) for the purposes above. We do not sell your data and do not disclose it to any other party except as required by law.') },
    { h: T('5. Tempoh simpanan', '5. Retention'),
      p: T('Data peribadi anda disimpan selama 12 bulan dari tarikh pertanyaan diterima. Selepas itu, nama, nombor telefon, emel dan mesej anda dipadamkan daripada rekod kami; hanya maklumat statistik tanpa identiti (tarikh dan projek) yang kekal.',
           'Your personal data is kept for 12 months from the date your enquiry is received. After that, your name, telephone number, email and message are erased from our records; only non-identifying statistical information (date and project) remains.') },
    { h: T('6. Hak anda', '6. Your rights'),
      ul: T(['Meminta akses kepada data peribadi anda', 'Meminta pembetulan data yang tidak tepat', 'Menarik balik persetujuan atau menghadkan pemprosesan', 'Meminta data anda dipadamkan sebelum tempoh simpanan tamat'],
            ['Request access to your personal data', 'Request correction of inaccurate data', 'Withdraw consent or limit processing', 'Request erasure of your data before the retention period ends']),
      p: T('Menarik balik persetujuan mungkin menyebabkan kami tidak dapat membalas pertanyaan anda.',
           'Withdrawing consent may mean we are unable to respond to your enquiry.') },
    { h: T('7. Sama ada anda wajib memberi data', '7. Whether you must provide data'),
      p: T('Nama dan sekurang-kurangnya satu cara hubungan (telefon atau emel) diperlukan supaya kami dapat membalas. Medan lain adalah pilihan.',
           'Your name and at least one contact method (telephone or email) are required so that we can reply. Other fields are optional.') },
    { h: T('8. Keselamatan', '8. Security'),
      p: T('Kami mengambil langkah munasabah untuk melindungi data anda, termasuk akses admin yang dilindungi kata laluan dan hadnya kepada kakitangan yang berkenaan. Laman ini tidak menggunakan kuki penjejakan atau pengiklanan.',
           'We take reasonable steps to protect your data, including password-protected admin access limited to the relevant staff. This website does not use tracking or advertising cookies.') },
    { h: T('9. Menghubungi kami', '9. Contact us'),
      p: T('Untuk sebarang permintaan atau pertanyaan berkaitan data peribadi anda, hubungi: {contact}.',
           'For any request or question about your personal data, contact: {contact}.') },
    { h: T('10. Bahasa dan kemaskini', '10. Language and updates'),
      p: T('Notis ini disediakan dalam Bahasa Malaysia dan Bahasa Inggeris. Jika terdapat percanggahan, versi Bahasa Malaysia diguna pakai. Kemas kini terakhir: 14 Oktober 2026.',
           'This notice is provided in Bahasa Malaysia and English. If there is any inconsistency, the Bahasa Malaysia version prevails. Last updated: 14 October 2026.') },
  ],
};
