export interface Korisnik {
  ime: string;
  prezime?: string;
  adresaStanovanja?: string;
  telefon?: string;
  email?: string;
  uloga: string;
  datumKreiranja?: string;  // ⬅️ opcionalno
  godisnjiOdmor?: GodisnjiOdmor[]; // ⬅️ opcionalno
}

export interface GodisnjiOdmor {
  ukupnoDana: number;
  preostaloDana: number;
}
