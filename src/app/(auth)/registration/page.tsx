"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { User } from "@/helpers/types";
import { postUser } from "@/features/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [error, setError] = useState("");

  const onSubmit = async (data: User) => {
    setError("");
    try {
          const response = await dispatch(postUser(data)).unwrap();
          if (!response) {
            throw new Error("Échec de l'inscription");
          }
          redirect("/");
        } catch (error) {
          console.error("Une erreur est survenue :", error);
        }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input {...register("name")} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
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
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
      <div className="mt-4 flex text-sm justify-center">
        <span className="pr-2">Already have an account?</span>
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
