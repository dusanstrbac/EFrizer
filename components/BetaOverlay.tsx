'use client';
import { ReactNode } from "react";

interface BlockerProps {
    isBlocked: boolean; 
    children: ReactNode;
}

export default function BetaOverlay({ isBlocked, children}: BlockerProps) {
    const message = "Funkcija je u toku izrade i ne može se koristiti.";
    return (
        <div className="relative">
            {children}
            {isBlocked && (
                <div 
                    className="absolute inset-0 z-50 flex items-center justify-center"
                    style={{ 
                        pointerEvents: 'all', 
                        backgroundColor: 'rgba(0,0,0,0.5)', // tamnija poluprovidna pozadina
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        padding: '1rem',
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
