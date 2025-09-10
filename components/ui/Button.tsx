import { ButtonProps, ButtonType } from "@/types/button";
import React from "react";

const Button = ({
  title,
  icon,
  className,
  action,
  buttonType = "default", // Tip dugmeta sa podrazumevanom vrednošću
  disabled = false, // Provera da li je dugme onemogućeno
}: ButtonProps & { 
  action?: () => void; 
  buttonType?: ButtonType; 
  disabled?: boolean; 
}) => {

  // Funkcija za odabir stila na osnovu tipa dugmeta
  const getButtonStyle = (buttonType: ButtonType) => {
    switch (buttonType) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "secondary":
        return "bg-gray-300 text-black hover:bg-gray-400";
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      case "default":
      default:
        return "bg-white text-black hover:bg-gray-300";
    }
  };

  return (
    <button
      onClick={action} // Pozivanje funkcije pri kliku
      disabled={disabled} // Onemogućavanje dugmeta
      className={`border w-full py-1 text-md rounded-lg text-center cursor-pointer flex items-center justify-center space-x-2 
        ${getButtonStyle(buttonType)} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{title}</span>
    </button>
  );
};

export default Button;
