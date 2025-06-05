"use client"

import React from "react";

interface TitleCardProps {
  title: string;
  onClick?: () => void;
}

const FolderCard = ({ title, onClick }: TitleCardProps) => (
  <div className="flex flex-col items-center justify-center cursor-pointer" onClick={onClick}>
    <svg width="260" height="170" viewBox="0 0 260 170" className="block">
      {/* Folder outline */}
      <path
        d="M10 40 Q10 20 30 20 H90 Q100 20 110 40 H240 Q250 40 250 50 V150 Q250 160 240 160 H20 Q10 160 10 150 Z"
        fill="#fff"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Folder tab */}
      <rect x="10" y="40" width="240" height="30" fill="#890000" stroke="#000" strokeWidth="2" />
      {/* Card body */}
      <rect x="10" y="70" width="240" height="80" fill="#e3e3e3" stroke="#000" strokeWidth="2" />
      {/* Title */}
      <text
        x="130"
        y="120"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#222"
        fontFamily="sans-serif"
      >
        {title}
      </text>
    </svg>
  </div>
);

export default FolderCard;