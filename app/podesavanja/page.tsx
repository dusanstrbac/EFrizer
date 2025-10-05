'use client'
import { BellIcon, BuildingIcon, SettingsIcon, Shield } from "lucide-react";
import { useMemo, useState } from "react";

/* 
    Dodati logovanje aktivnosti. Ukoliko korisnik nesto promeni na ovim sekcijama ovde, 
    posati mu email sa informacijom sta je promenjeno u tom trenutku.

    Koristiti Google Authenticator za 2FA aktivaciju tog sistema.
    Postoji podrska za web, android i IOS  uredjaje.
*/

export default function PodesavanjaPage() {
    const [aktivnaSekcija, setAktivnaSekcija] = useState("Profil");
    const sekcije = [
        { naziv: "Notifikacije", ikonica: <BellIcon size={18} />},
        { naziv: "Sigurnost", ikonica: <Shield size={18} />},
        { naziv: "Račun", ikonica: <SettingsIcon size={18} />},
        { naziv: "Lokal", ikonica: <BuildingIcon size={18} />}
    ];
    const [is2FAAktivan, setIs2FAAktivan] = useState(false);
    const [staraLozinka, setStaraLozinka] = useState("");
    const [novaLozinka, setNovaLozinka] = useState("");
    const [potvrdaLozinka, setPotvrdaLozinka] = useState("");
    const [emailAktivan, setEmailAktivan] = useState(false);
    const [smsAktivan, setSmsAktivan] = useState(false);    
    const spisakObavestenja = [
        {
            id: "novoZakazivanje",
            naziv: "Novo zakazivanje",
            opis: "Obaveštenje kada se zakaže nova usluga.",
            status: true,
        },
        {
            id: "promenaSmene",
            naziv: "Promena smene",
            opis: "Obaveštenje o promenama u radnoj smeni.",
            status: false,
        },
        {
            id: "promenaRadnogVremena",
            naziv: "Promena radnog vremena",
            opis: "Obaveštenje kada se promeni radno vreme lokala.",
            status: true,
        }
    ];
    const [obavestenja, setObavestenja] = useState(spisakObavestenja);

    // Funckija za prikazivanje filter obavestenja
    const toggleObavestenje = (id: string) => {
    setObavestenja(prev =>
        prev.map(o => o.id === id ? {...o, status: !o.status} : o)
    );
    };


    const promenaLozinke = () => {
        if(novaLozinka != potvrdaLozinka) {
            alert('Lozinke se ne poklapaju');
            return;
        }
        if(novaLozinka.length < 6 || potvrdaLozinka.length < 6) {
            alert('Nova lozinka mora imati najmanje 6 karaktera');
            return;
        }
        alert('Uspesno ste promenili lozinku');
    }

    const aktiviraj2FA = () => {
        setIs2FAAktivan(!is2FAAktivan); // Od proslog stanje uradi samo kontru sa negacijom
        alert(is2FAAktivan ? '2FA deaktiviran' : '2FA aktiviran')
    }

    const sekcijaOpis = useMemo(() => {
        switch (aktivnaSekcija) {
            case "Notifikacije":
                return "Podesite kako i koja obaveštenja želite da dobijate.";
            case "Sigurnost":
                return "Promeni lozinku, aktiviraj 2FA i druge bezbednosne postavke.";
            case "Račun":
                return "Informacije o tvom nalogu i mogućnost deaktivacije.";
            case "Lokal":
                return "Informacije o lokalu i mogućnost promene podataka.";
            default:
                return "";
        }
    }, [aktivnaSekcija]);

    const renderSadrzaj = () => {
        switch (aktivnaSekcija) {
            case "Notifikacije":
                return (
                    <div className="space-y-10">
                        <div className="space-y-1">
                            <p className="text-lg font-bold">Email obaveštenja</p>
                            <p className="text-sm text-gray-600">
                                Primaćete obaveštenja putem email-a.
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-md font-medium">
                                    Status:
                                    <span className={`ml-2 font-semibold ${emailAktivan ? 'text-green-600' : 'text-red-500'}`}>
                                        {emailAktivan ? 'Aktivno' : 'Neaktivno'}
                                    </span>
                                </p>
                                <button
                                    onClick={() => setEmailAktivan(!emailAktivan)}
                                    className={`py-2 px-6 rounded-lg text-sm text-white transition ${emailAktivan ? 'bg-red-500 hover:bg-red-400' : 'bg-green-600 hover:bg-green-500'}`}
                                >
                                    {emailAktivan ? 'Isključi' : 'Uključi'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-lg font-bold">SMS obaveštenja</p>
                            <p className="text-sm text-gray-600">
                                Primaćete obaveštenja putem SMS poruka.
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-md font-medium">
                                    Status:
                                    <span className={`ml-2 font-semibold ${smsAktivan ? 'text-green-600' : 'text-red-500'}`}>
                                        {smsAktivan ? 'Aktivno' : 'Neaktivno'}
                                    </span>
                                </p>
                                <button
                                    onClick={() => setSmsAktivan(!smsAktivan)}
                                    className={`py-2 px-6 rounded-lg text-sm text-white transition ${smsAktivan ? 'bg-red-500 hover:bg-red-400' : 'bg-green-600 hover:bg-green-500'}`}
                                >
                                    {smsAktivan ? 'Isključi' : 'Uključi'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 pt-4 border-t border-gray-300 space-y-4">
                            <div>
                                <p className="text-lg font-bold">Filter obaveštenja</p>
                                <p className="text-sm text-gray-600">Filtrirajte obaveštenja koja želite da dobijate na izabrani sistem (Email, SMS).</p>
                            </div>
                            <div className="space-y-4">
                                {obavestenja.map(({ id, naziv, opis, status }) => (
                                <label key={id} className="flex items-center justify-between cursor-pointer">
                                    <div>
                                    <p className="font-medium">{naziv}</p>
                                    <p className="text-sm text-gray-600">{opis}</p>
                                    </div>
                                    <input
                                    type="checkbox"
                                    checked={status}
                                    onChange={() => toggleObavestenje(id)}
                                    className="h-5 w-5"
                                    />
                                </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "Sigurnost":
                return (
                    <div className="space-y-20">
                        <div className="">
                           <p className="text-lg font-bold mb-2">Promena lozinke</p>
                            <div className="space-y-4">
                                <div className="gap-y-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stara lozinka</label>
                                    <input
                                        type="password"
                                        name="staraLozinka"
                                        value={staraLozinka}
                                        onChange={(e) => setStaraLozinka(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nova lozinka</label>
                                    <input
                                        type="password"
                                        name="novaLozinka"
                                        value={novaLozinka}
                                        onChange={(e) => setNovaLozinka(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />                                
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Potvrda nove lozinke</label>
                                    <input
                                        type="password"
                                        name="potvrdaLozinka"
                                        value={potvrdaLozinka}
                                        onChange={(e) => setPotvrdaLozinka(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />                                
                                </div>
                                <button 
                                    className="float-right py-2 px-6 rounded-lg cursor-pointer bg-blue-500 text-white hover:bg-blue-400 shadow-lg transition-colors duration-300"
                                    onClick={promenaLozinke}
                                >
                                    Promeni lozinku
                                </button>
                            </div> 
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-lg font-bold">2FA autentifikacija</p>
                                <p className="text-sm text-gray-600">Dodajte dodatni sloj sigurnosti vašem nalogu pomoću verifikacije putem telefona ili aplikacije.</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-md font-medium">Status: <span className={`${is2FAAktivan ? 'text-green-500' : 'text-red-500'}`}>{is2FAAktivan ? 'Uključeno' : 'Isključeno'}</span></p>
                                <button 
                                className={`py-2 px-4 rounded-lg text-white ${is2FAAktivan ? 'bg-red-500' : 'bg-green-500'} hover:opacity-80 transition`}
                                onClick={aktiviraj2FA}
                                >
                                {is2FAAktivan ? 'Deaktiviraj 2FA' : 'Aktiviraj 2FA'}
                                </button>
                            </div>
                        </div>       
                    </div>
                );
            case "Račun":
                return (
                    <div>

                    </div>
                );
            case "Lokal":
                return (
                    <div>
                        <p>Napraviti da je ovo iskljucivo administratorska stranica. Mogucnost menjanja radnog vremena, lokacije ...</p>
                    </div>
                )
            default:
                return <p>Izaberite sekciju sa leve strane da bi pristupili podešavanjima.</p>;
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
                            key={sekcija.naziv}
                            className={`flex items-center gap-2 cursor-pointer hover:text-blue-600 ${
                                aktivnaSekcija === sekcija.naziv ? "text-blue-600 font-semibold" : ""
                            }`}
                            onClick={() => setAktivnaSekcija(sekcija.naziv)}
                        >
                            {sekcija.ikonica}
                            {sekcija.naziv}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Glavni sadržaj */}
            <div className="flex-1 p-6">
                <div className="mb-[20px] border-b border-gray-300 space-y-2">
                    <h1 className="text-2xl font-bold flex items-center gap-2"><span>{sekcije.find(s => s.naziv === aktivnaSekcija)?.ikonica}</span>{aktivnaSekcija}</h1>
                    <p className="text-sm text-left w-full mb-2">{sekcijaOpis}</p>
                </div>
                {renderSadrzaj()}
            </div>
        </div>
    );
}
