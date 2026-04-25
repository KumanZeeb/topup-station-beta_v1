import React from 'react';

const DescriptionSection = ({ product }) => {
  const description = product?.description || 'Top up Diamond Mobile Legends dengan harga termurah. Proses otomatis 24 jam tanpa perlu menunggu lama. Diamond akan langsung masuk ke akun game Anda dalam hitungan detik.';

  const steps = product?.steps || [
    'Masukkan ID & Server Mobile Legends Anda',
    'Pilih jumlah Diamond yang diinginkan',
    'Masukkan nomor WhatsApp aktif',
    'Klik "Bayar Sekarang via WhatsApp"',
    'Konfirmasi pesanan di WhatsApp',
    'Diamond akan otomatis masuk ke akun game'
  ];

  const note = product?.note || 'Pastikan ID dan Server yang dimasukkan benar. Diamond akan masuk secara otomatis dalam 1-5 menit setelah pembayaran berhasil.';

  return (
    <div className="description">
      <h3><i className="fa-solid fa-circle-info"></i> Deskripsi Produk</h3>
      <div className="description-content">
        {description}
        
        <div className="steps-list">
          <strong>Cara Top Up:</strong>
          <ol>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="note-box">
          <strong>Catatan Penting:</strong><br />
          {note}
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;