'use client'

import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Nalog() {

    const promenaFotografije = () => {
        alert("Menjate profilnu fotografiju")
    }

    return (
        <div className="mt-[30px]">
            {/* Profilna i osnovni podaci korisnika */}
            <div className="flex space-y-2 items-center">
                <div className="flex flex-col space-y-2 items-center flex-1">
                    <div className="w-32 h-32 relative rounded-full overflow-hidden border border-gray-300">
                        <Image 
                            src="https://randomuser.me/api/portraits/men/22.jpg"
                            alt="Profilna slika"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    {/* Dugme promeni profilnu fotografiju */}
                    <button 
                        className="px-20 py-2 rounded-lg shadow-lg transition-colors duration-300 cursor-pointer bg-sky-500 text-white hover:bg-sky-400"
                        onClick={promenaFotografije}
                    >
                        Promeni
                    </button>
                </div>
                {/* Informacije o korisniku */}
                <div className="flex flex-col flex-1 space-y-4">
                    <p className="text-lg"><span className="font-bold">Ime i prezime: </span>Dusan Markovic</p>
                    <p className="text-lg"><span className="font-bold">Adresa stanovanja: </span>Dusan Markovic</p>
                    <p className="text-lg"><span className="font-bold">Kontakt telefon: </span>Dusan Markovic</p>
                </div>
            </div>
            {/* Dodatne informacije o korisniku */}
            <div className="py-15 px-10">
                <p className="font-bold text-lg border-b border-gray-300">Dodatne informacije korisnika</p>
                <div className="mt-[10px] space-y-2">
                    <p><span className="font-bold">Uloga korisnika: </span>Frizer</p>
                    <p><span className="font-bold">Datum kreiranja naloga: </span>12.03.2023</p>
                    <p><span className="font-bold">Zabrane: </span>Nema</p>
                    <p><span className="font-bold">Broj bankovnog racuna: </span>1234567890</p>
                </div>
            </div>
        </div>
    );
};