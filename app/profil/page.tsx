'use client'
import { ArrowUpDown, BanIcon, CalendarDays, CreditCard, FileText, GraduationCap, TreePalm, UserIcon } from "lucide-react";
import Image from "next/image";

export default function Nalog() {

    const promenaFotografije = () => {
        alert("Menjate profilnu fotografiju")
    }

    const odjaviKorisnika = () => {
        alert("Uspešno ste se odjavili sa naloga")
    }

    return (
        <div className="mt-[30px]">
            {/* Profilna i osnovni podaci korisnika */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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
                <div className="flex flex-col flex-1 space-y-4 text-center md:text-start">
                    <p className="text-lg"><span className="font-bold">Ime i prezime: </span>Dusan Markovic</p>
                    <p className="text-lg"><span className="font-bold">Adresa stanovanja: </span>Dusan Markovic</p>
                    <p className="text-lg"><span className="font-bold">Kontakt telefon: </span>Dusan Markovic</p>
                </div>
            </div>
            {/* Dodatne informacije o korisniku */}
            <div className="py-15 px-10">
                <p className="font-bold text-lg border-b border-gray-300">Dodatne informacije korisnika</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mt-[10px] space-y-3">
                        <p className="flex gap-2 items-center"><UserIcon width={25} height={25} color="darkblue"/><span className="font-bold">Uloga korisnika: </span>Frizer</p>
                        <p className="flex gap-2 items-center"><CalendarDays width={25} height={25} color="darkblue"/><span className="font-bold">Datum kreiranja naloga: </span>12.03.2023</p>
                        <p className="flex gap-2 items-center"><BanIcon width={25} height={25} color="red"/><span className="font-bold">Zabrane: </span>Nema</p>
                        <p className="flex gap-2 items-center"><CreditCard width={25} height={25} color="gray"/><span className="font-bold">Broj tekućeg racuna: </span>1234567890</p>
                        <p className="flex gap-2 items-center"><ArrowUpDown width={25} height={25} color="black"/><span className="font-bold">Status zaposlenja: </span>Na odmoru</p>
                        <p className="flex gap-2 items-center"><TreePalm width={25} height={25} color="green"/><span className="font-bold">Broj dana godišnjeg odmora: </span>5 / 22</p>
                        <p className="flex gap-2 items-center"><GraduationCap width={25} height={25} color="black"/><span className="font-bold">Stručna specijalizacija: </span>Muški frizer</p>
                        <p className="flex gap-2 items-center"><FileText width={25} height={25} color="gray"/><span className="font-bold">Licence / Sertifikati: </span>Nema</p>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold mt-[5px] mb-1">Radni zadaci:</h1>
                        <ul className="list-disc ml-[30px] mt-[10px] space-y-1">
                            <li>Izvrsavanje usluga</li>
                            <li>Narucivanje robe za lokal</li>
                            <li>Ciscenje i sredjivanje lokala</li>
                        </ul>
                    </div>
                </div>
            </div>
            <button
                className="fixed bottom-5 right-5 z-50 border border-red-500 rounded-xl py-2 px-6 font-bold text-white bg-red-500 hover:bg-red-400 hover:border-red-400 cursor-pointer shadow-lg transition-colors duration-300"
                onClick={odjaviKorisnika}
            >
                Odjavi se
            </button>

        </div>
    );
};