"use client"

import { Button } from "./ui/button"


type CourseCardProps = {
    title: string;
    onClick?: () => void;
}


const CourseCard = ({ title, onClick}: CourseCardProps) => {
  return (
    <div className="w-full">
        <Button onClick={onClick} className="w-full h-24 bg-myred text-white font-medium text-lg rounded-2xl shadow-md backdrop-blur-[4px]">
            {title}
        </Button>
    </div>
  )
}

export default CourseCard;