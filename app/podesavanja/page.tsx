'use client'
import { useMemo, useState } from "react";

export default function PodesavanjaPage() {
    const [aktivnaSekcija, setAktivnaSekcija] = useState("Profil");
    const sekcije = ["Profil", "Notifikacije", "Sigurnost", "Račun"];

    const sekcijaOpis = useMemo(() => {
        switch (aktivnaSekcija) {
            case "Profil":
                return "Ovde možete menjati podešavanja profila.";
            case "Notifikacije":
                return "Podesite kako i kada želite da primate obaveštenja.";
            case "Sigurnost":
                return "Promeni lozinku, aktiviraj 2FA i druge bezbednosne postavke.";
            case "Račun":
                return "Informacije o tvom nalogu i mogućnost deaktivacije.";
            default:
                return "";
        }
    }, [aktivnaSekcija]);

    const renderSadrzaj = () => {
        switch (aktivnaSekcija) {
            case "Profil":
                return 
            case "Notifikacije":
                return (
                    <p>Notifikacije</p>
                )
            case "Sigurnost":
                return (
                    <p>Promeni lozinku, aktiviraj 2FA i druge bezbednosne postavke.</p>
                )
            case "Račun":
                return (
                    <p>Informacije o tvom nalogu i mogućnost deaktivacije.</p>
                )
            default:
                return <p>Izaberite sekciju sa leve strane.</p>;
        }
    };

    return (
        <div className="flex h-[90vh] border border-gray-300 mt-[10px]">
            {/* Levi meni */}
            <div className="w-1/5 p-4 border-r border-gray-300 bg-gray-100">
                <h2 className="text-lg font-semibold mb-4">Podešavanja</h2>
                <ul className="space-y-2">
                    {sekcije.map((sekcija) => (
                        <li
                            key={sekcija}
                            className={`cursor-pointer hover:text-blue-600 ${
                                aktivnaSekcija === sekcija ? "text-blue-600 font-semibold" : ""
                            }`}
                            onClick={() => setAktivnaSekcija(sekcija)}
                        >
                            {sekcija}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Glavni sadržaj */}
            <div className="flex-1 p-6">
                <div className="mb-[20px] border-b border-gray-300 space-y-2">
                    <h1 className="text-2xl font-bold">{aktivnaSekcija}</h1>
                    <p className="text-sm text-left w-full mb-2">{sekcijaOpis}</p>
                </div>
                {renderSadrzaj()}
            </div>
        </div>
    );
}
