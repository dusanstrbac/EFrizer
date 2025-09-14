import React, { useState, useEffect } from "react";
import { ButtonProps, ButtonType } from "@/types/button";

const Button = ({
  title,
  icon,
  className,
  action,
  buttonType = "default",
  disabled = false, 
  isActive = false, 
}: ButtonProps & { 
  action?: () => void; 
  buttonType?: ButtonType; 
  disabled?: boolean;
  isActive?: boolean;
}) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Funkcija za odabir boje dugmeta u zavisnosti od aktivnog stanja
  const getButtonStyle = (buttonType: ButtonType, isActive: boolean) => {
    let baseStyle = '';
    let hoverStyle = '';

    // Logika za boje dugmadi sa hover i aktivnim stanjima
    switch (buttonType) {
      case "pocetna":
        baseStyle = isActive ? "bg-sky-800 text-white" : "bg-white text-sky-800 border-sky-800"; 
        hoverStyle = "hover:bg-sky-700 hover:text-white hover:border-sky-700";
        break;
      case "musterije":
        baseStyle = isActive ? "bg-green-500 text-white" : "bg-white text-green-500 border-green-500"; 
        hoverStyle = "hover:bg-green-400 hover:text-white hover:border-green-400";
        break;
      case "izvodi":
        baseStyle = isActive ? "bg-yellow-500 text-white" : "bg-white text-yellow-500 border-yellow-500"; 
        hoverStyle = "hover:bg-yellow-400 hover:text-white hover:border-yellow-400";
        break;
      case "podesavanja":
        baseStyle = isActive ? "bg-sky-500 text-white" : "bg-white text-sky-500 border-sky-500"; 
        hoverStyle = "hover:bg-sky-400 hover:text-white hover:border-sky-400";
        break;
      case "salon":
        baseStyle = isActive ? "bg-purple-300 text-white" : "bg-white text-purple-300 border-purple-300"; 
        hoverStyle = "hover:bg-purple-200 hover:text-white hover:border-purple-400";
        break;
      case "nalog": 
        baseStyle = isActive ? "bg-red-500 text-white" : "bg-white text-red-500 border-red-500"; 
        hoverStyle = "hover:bg-red-400 hover:text-white hover:border-red-400"; 
        break;
      default:
        baseStyle = "bg-white text-black border-gray-300"; 
        hoverStyle = "hover:bg-gray-200 hover:text-black hover:border-gray-400";
        break;
    }

    // Ako je dugme aktivno, koristi iste stilove kao hover
    return `${baseStyle} ${hoverStyle}`;
  };

  if (!isMounted) {
    return null; // Ne renderuj dok se komponenta ne montira
  }

  return (
    <button
      onClick={action} 
      disabled={disabled} 
      className={`w-full border py-1 text-md rounded-lg text-center cursor-pointer flex items-center justify-center space-x-2 
        ${getButtonStyle(buttonType, isActive)} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {/* Ikona */}
      {icon && <span className="mr-2 text-inherit">{icon}</span>} {/* Koristi text-inherit za ikonu */}

      {/* Tekst dugmeta */}
      <span className="text-inherit">{title}</span> {/* Dodaj text-inherit da boje teksta budu ujednačene */}
    </button>
  );
};

export default Button;
