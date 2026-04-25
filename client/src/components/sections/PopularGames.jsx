import React from 'react';
import { FaFire, FaChevronRight } from 'react-icons/fa6';
import {
  FaAndroid,
  FaCrosshairs,
  FaGun,
  FaCrown,
  FaDragon,
} from 'react-icons/fa6';
import { FaSteam } from 'react-icons/fa';
import GameCard from '../UI/GameCard';

const PopularGames = () => {
  const games = [
    { icon: <FaAndroid />, name: 'Mobile Legend', price: 'Mulai RM 10' },
    { icon: <FaCrosshairs />, name: 'Free Fire', price: 'Mulai RM 5' },
    { icon: <FaGun />, name: 'PUBG Mobile', price: 'Mulai RM 10' },
    { icon: <FaSteam />, name: 'Steam Wallet', price: 'Mulai RM 20' },
    { icon: <FaCrown />, name: 'Valorant', price: 'Mulai RM 15' },
    { icon: <FaDragon />, name: 'Genshin Impact', price: 'Mulai RM 10' },
  ];

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">
          <FaFire />
          <h3>Lagi Populer</h3>
        </div>
        <div
          className="see-more touch-feedback"
          onClick={() => alert('Akan menampilkan semua game populer!')}
        >
          Lihat Semua <FaChevronRight />
        </div>
      </div>
      <div className="games-scroll">
        {games.map((game, index) => (
          <GameCard
            key={index}
            icon={game.icon}
            name={game.name}
            price={game.price}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularGames;
