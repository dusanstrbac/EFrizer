"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const loginSchema = z.object({
  korisnickoIme: z.string().min(1, "Email ili korisničko ime je obavezno."),
  lozinka: z.string().min(3, "Lozinka mora imati najmanje 3 karaktera."),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Pogrešno korisničko ime ili lozinka.");
        }
        throw new Error("Greška prilikom slanja zahteva.");
      }

      const rezultat = await res.json();
      console.log("REZULTAT LOGIN:", rezultat); // opcionalno za debug

      if (rezultat.token) {
          setCookie("AuthToken", rezultat.token, {
              maxAge: 60 * 60 * 24 * 5,
              path: "/",
              sameSite: "lax",
              encode: (value) => value,
          });
      }

      window.localStorage.setItem("AuthToken", rezultat.token);

      // ⬇️ Redirect
      const ruta = await Promise.resolve(getCookie("poslednjaRuta"));
      const redirectTo = typeof ruta === "string" && ruta.length > 0 ? ruta : "/";

      window.location.href = redirectTo;


    } catch (error: unknown) {
      console.log("Greška prilikom logovanja:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Došlo je do greške. Pokušajte ponovo.");
      }
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Prijava
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Korisničko ime ili Email adresa
          </label>
          <input
            type="text"
            {...register("korisnickoIme")}
            placeholder="Unesite email..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.korisnickoIme
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.korisnickoIme && (
            <p className="text-red-500 text-sm mt-1">
              {errors.korisnickoIme.message}
            </p>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-2">
            Lozinka
          </label>
          <input
            type="password"
            {...register("lozinka")}
            placeholder="Unesite lozinku..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.lozinka
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.lozinka && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lozinka.message}
            </p>
          )}
        </div>

        <div className="text-right mb-6">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            Zaboravili ste lozinku?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Prijavljujem se..." : "Prijavi se"}
        </button>

        {errorMessage && (
          <p className="text-red-600 text-center text-sm mt-4">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
