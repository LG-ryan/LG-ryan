import React from "react";

interface CharacterCardProps {
  avatar: string;
  name: string;
  vehicleType: string;
  backendStatus: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ avatar, name, vehicleType, backendStatus }) => {
  return (
    <div className="character-card">
      <div className="avatar">{avatar}</div>
      <div className="info">
        <h3>{name || "이름 없음"}</h3>
        <p>타입: {vehicleType}</p>
        <small>상태: {backendStatus}</small>
      </div>
    </div>
  );
};

export default CharacterCard;
