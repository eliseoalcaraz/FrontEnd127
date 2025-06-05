"use client";

interface HeaderProps {
  title: string;
  onClick?: () => void;
}

export default function Header({ title, onClick }: HeaderProps) {
  return (
    <div className="bg-myred text-white py-6 px-4 flex items-center justify-between w-full">
      <button onClick={onClick} className="cursor-pointer">
        <img src="/back.svg" alt="Back" className="h-10 w-10" />
      </button>
      <span className="text-center flex-1 text-lg font-medium -ml-5">
        {title}
      </span>
    </div>
  );
}
