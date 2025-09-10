import { ReactElement } from "react";

export type ButtonType = "primary" | "secondary" | "danger" | "default";

export interface ButtonProps {
    title: string;
    icon?: ReactElement;
    className?: string;
}