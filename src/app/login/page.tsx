"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Lock, EnvelopeSimple, ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useStore();
  const [email, setEmail] = useState("user@example.uz");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleGoogleCallback = async (response: any) => {
    setLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ошибка авторизации Google");
      }

      loginUser(data.user);
      setAuthSuccess(`С возвращением, ${data.user.name}!`);
      setTimeout(() => {
        router.push("/account");
      }, 800);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Не удалось выполнить вход через Google");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      id: "usr_email_" + Date.now(),
      name: email.split("@")[0],
      email: email,
    });
    router.push("/account");
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.google?.accounts?.id && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: handleGoogleCallback,
              auto_select: false,
            });
            const btnContainer = document.getElementById("googleBtnContainer");
            if (btnContainer) {
              window.google.accounts.id.renderButton(btnContainer, {
                theme: "outline",
                size: "large",
                width: 340,
                text: "signin_with",
                shape: "rectangular",
              });
            }
          }
        }}
      />

      <div className="max-w-md mx-auto py-12">
        <div className="bg-white rounded-3xl border border-[#D9E7E8] p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#528A9A] text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-md">
              A
            </div>
            <h1 className="text-2xl font-extrabold text-[#25252B] tracking-tight">
              Вход в аккаунт
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Для синхронизации заказов, корзины и избранного
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <WarningCircle size={18} weight="fill" className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 rounded-xl bg-[#D9E7E8] border border-[#BFD7D9] text-xs text-[#25252B] font-semibold flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-[#375E6A] shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Google Sign-In Official Button */}
          <div className="flex justify-center w-full min-h-[44px]">
            <div id="googleBtnContainer" className="flex justify-center w-full" />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#D9E7E8] w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium absolute">
              или по email
            </span>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Войти в личный кабинет
            <ArrowRight size={14} weight="bold" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Нет учетной записи?{" "}
          <Link href="/register" className="text-[#528A9A] font-semibold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
