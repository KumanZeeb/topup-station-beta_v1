import React from 'react';

const GameCard = ({ icon, name, price }) => {
  const handleClick = () => {
    alert(`Anda memilih: ${name}\n${price}`);
  };

  return (
    <div className="game-card touch-feedback" onClick={handleClick}>
      <div className="game-icon">{icon}</div>
      <p>{name}</p>
      <div className="price">{price}</div>
    </div>
  );
};

export default GameCard;