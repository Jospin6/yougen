"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { postLogin } from "@/features/userSlice";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    setError("");

    try {
      const response = await dispatch(postLogin(data)).unwrap();
      if (!response) {
        throw new Error("Échec de l'inscription");
      }
      redirect("/");
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" {...register("email")} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Mot de passe</label>
          <input type="password" {...register("password")} className="w-full p-2 border rounded" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <div className="mt-4 flex text-sm justify-center">
        <span className="pr-2">Don't have an account?</span>
        <Link href="/registration" className="text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
