'use client'
import { Korisnik } from "@/types/korisnik";
import { ArrowUpDown, BanIcon, CalendarDays, FileText, GraduationCap, TreePalm, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { dajKorisnikaIzTokena, KorisnikToken } from "@/lib/auth";

export default function Nalog() {
  const router = useRouter();
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);

  const formatirajDatum = (datum: string) => {
    return new Date(datum).toLocaleDateString("sr-RS");
  };

  useEffect(() => {
    const fetchKorisnik = async () => {
      try {
        
        // 1️⃣ Dobij token iz cookie-ja
        const token = getCookie("AuthToken");
        if (!token || typeof token !== "string") {
          console.log("Nema AuthToken cookie-a");
          return;
        }

        // 2️⃣ Dekodiraj token
        const korisnikIzTokena: KorisnikToken | null = dajKorisnikaIzTokena(token);
        console.log("Korisnik iz tokena:", korisnikIzTokena);
        if (!korisnikIzTokena) return;

        // 3️⃣ Postavi barem osnovne podatke odmah
        setKorisnik({
          ime: korisnikIzTokena.ime,
          uloga: korisnikIzTokena.uloga,
          email: korisnikIzTokena.email,
          telefon: korisnikIzTokena.telefon,
          datumKreiranja: "", // placeholder dok fetchujemo sa servera
          godisnjiOdmor: [],  // prazna lista
        });

        // 4️⃣ Fetch dodatnih podataka sa servera
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Korisnik/DajKorisnika?emailKorisnika=${korisnikIzTokena.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Greška prilikom učitavanja korisnika");

        const data = await res.json();
        setKorisnik(prev => ({ ...prev, ...data })); // Spoji server data sa tokenom
      } catch (error) {
        console.error(error);
      }
    };

    fetchKorisnik();
  }, []);

  const promenaFotografije = () => {
    alert("Menjate profilnu fotografiju");
  };

  const odjaviKorisnika = () => {
    deleteCookie("AuthToken");
    router.push("/login");
  };

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
          <button 
            className="px-20 py-2 rounded-lg shadow-lg transition-colors duration-300 cursor-pointer bg-sky-500 text-white hover:bg-sky-400"
            onClick={promenaFotografije}
          >
            Promeni
          </button>
        </div>

        <div className="flex flex-col flex-1 space-y-4 text-center md:text-start">
          <p className="text-lg"><span className="font-bold">Ime i prezime: </span>{korisnik?.ime}</p>
          <p className="text-lg"><span className="font-bold">Adresa stanovanja: </span>{korisnik?.adresaStanovanja}</p>
          <p className="text-lg"><span className="font-bold">Kontakt telefon: </span>{korisnik?.telefon}</p>
        </div>
      </div>

      {/* Dodatne informacije o korisniku */}
      <div className="py-15 px-10">
        <p className="font-bold text-lg border-b border-gray-300">Dodatne informacije korisnika</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mt-[10px] space-y-3">
            <p className="flex gap-2 items-center"><UserIcon width={25} height={25} color="darkblue"/><span className="font-bold">Uloga korisnika: </span>{korisnik?.uloga}</p>
            <p className="flex gap-2 items-center"><CalendarDays width={25} height={25} color="darkblue"/><span className="font-bold">Datum kreiranja naloga: </span>{korisnik?.datumKreiranja && formatirajDatum(korisnik.datumKreiranja)}</p>
            <p className="flex gap-2 items-center"><BanIcon width={25} height={25} color="red"/><span className="font-bold">Zabrane: </span>Nema</p>
            <p className="flex gap-2 items-center"><ArrowUpDown width={25} height={25} color="black"/><span className="font-bold">Status korisnika: </span>Na odmoru</p>
            <p className="flex gap-2 items-center"><TreePalm width={25} height={25} color="green"/><span className="font-bold">Broj dana godišnjeg odmora: </span> {korisnik?.godisnjiOdmor?.[0]?.preostaloDana} / {korisnik?.godisnjiOdmor?.[0]?.ukupnoDana}</p>
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
}
