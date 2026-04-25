import React, { useState, useEffect } from 'react';
import { FaBolt, FaArrowRight } from 'react-icons/fa6';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Dapetin waktu reset berikutnya (jam 12 malam)
  const getNextMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // besok jam 00:00:00
    return midnight.getTime();
  };

  useEffect(() => {
    const calculateEndTime = () => {
      const savedEnd = localStorage.getItem('flashSaleEnd');
      const now = Date.now();
      const nextMidnight = getNextMidnight();

      // Kalau ga ada saved end ATAU saved end udah lewat dari midnight terakhir
      if (!savedEnd || Number(savedEnd) < now) {
        const newEnd = nextMidnight;
        localStorage.setItem('flashSaleEnd', newEnd);
        return newEnd;
      }

      return Number(savedEnd);
    };

    const endTime = calculateEndTime();

    const updateTimer = () => {
      const diff = endTime - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cek setiap menit apakah udah lewat midnight (buat yg buka tab lama)
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const savedEnd = localStorage.getItem('flashSaleEnd');
      if (savedEnd && Number(savedEnd) < Date.now()) {
        // Reset ke midnight berikutnya
        const newEnd = getNextMidnight();
        localStorage.setItem('flashSaleEnd', newEnd);
        setTimeLeft(newEnd - Date.now());
      }
    }, 60000); // cek tiap 1 menit

    return () => clearInterval(checkMidnight);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const format = (n) => String(n).padStart(2, '0');

  return (
    <div className="flash-container">
      <div className="flash-header">
        <div className="flash-title">
          <span><FaBolt /> FLASH SALE</span>
        </div>
        <div
          className="view-all touch-feedback"
          onClick={() => alert('Akan menampilkan semua flash sale!')}
        >
          Lihat Semua <FaArrowRight />
        </div>
      </div>

      <div className="time-container">
        <div className="time-box">
          <div className="time-value">{format(hours)}</div>
          <div className="time-label">Jam</div>
        </div>
        <div className="time-separator">:</div>
        <div className="time-box">
          <div className="time-value">{format(minutes)}</div>
          <div className="time-label">Menit</div>
        </div>
        <div className="time-separator">:</div>
        <div className="time-box">
          <div className="time-value">{format(seconds)}</div>
          <div className="time-label">Detik</div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;