import { jwtDecode } from "jwt-decode"; // bez {} ako koristiš default export
import { getCookie } from "cookies-next";

type DekodiranToken = {
  sub: string;        // korisničko ime
  role: string;
  ime: string;
  email: string;
  telefon: string;
  jti: string;        // jedinstveni id tokena
  exp: number;        // unix timestamp
  iss: string;
  aud: string;
};

export type KorisnikToken = {
  korisnickoIme: string;
  uloga: string;
  ime: string;
  email: string;
  telefon: string;
  tokenIstice: Date | null;
};

export function dajKorisnikaIzTokena(token?: string): KorisnikToken | null {
  const t = token || getCookie("AuthToken");
  if (!t || typeof t !== "string") return null;

  try {
    const decoded = jwtDecode<DekodiranToken>(t); // default import
    return {
      korisnickoIme: decoded.sub,
      uloga: decoded.role,
      ime: decoded.ime,
      email: decoded.email,
      telefon: decoded.telefon,
      tokenIstice: decoded.exp ? new Date(decoded.exp * 1000) : null,
    };
  } catch (error) {
    console.error("Greška pri dekodiranju tokena:", error);
    return null;
  }
}
