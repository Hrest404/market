"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, EnvelopeSimple, User, ArrowRight } from "@phosphor-icons/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/account");
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white rounded-3xl border border-[#D9E7E8] p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#528A9A] text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-md">
            A
          </div>
          <h1 className="text-2xl font-extrabold text-[#25252B] tracking-tight">
            Регистрация
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Создайте аккаунт для сохранения истории и быстрой доставки
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Ваше имя
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
              />
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Электронная почта
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
              />
              <EnvelopeSimple size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Пароль
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
              />
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#528A9A]/20"
          >
            Создать аккаунт
            <ArrowRight size={14} weight="bold" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-[#528A9A] font-semibold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
