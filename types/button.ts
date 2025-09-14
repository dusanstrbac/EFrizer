import { ReactElement } from "react";

export type ButtonType = 
  | "primary" 
  | "secondary" 
  | "danger" 
  | "default"
  | "pocetna"
  | "musterije"
  | "salon"
  | "izvodi"
  | "podesavanja"
  | "nalog";


export interface ButtonProps {
    title: string;
    icon?: ReactElement;
    className?: string;
}