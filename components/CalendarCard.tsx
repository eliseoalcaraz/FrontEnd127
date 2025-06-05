"use client"

import React from 'react';

interface CardProps {
    title: string;
    onClick?: () => void;
}

const Card = ({ title, onClick }: CardProps) => {
    return (
        <div
            className="border-solid w-full h-30 bg-[#ebebeb] flex flex-col cursor-pointer rounded-sm"
            onClick={onClick}
        >
            <div className="bg-myred h-6 w-full rounded-t-sm" />
            <div className="flex-1 flex items-center justify-center">
                <span className="text-lg text-thin text-center">{title}</span>
            </div>
        </div>
    );
};

export default Card;