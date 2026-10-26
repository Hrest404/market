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

  const handleSimulatedGoogleLogin = async () => {
    // If user clicks button directly when Google Client ID is placeholder, log in with verified demo Google profile
    setLoading(true);
    setAuthError("");
    try {
      // Create a test JWT payload simulating Google credential (UTF-8 safe base64)
      const toBase64 = (str: string) => {
        const bytes = new TextEncoder().encode(str);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };

      const demoHeader = toBase64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const demoPayload = toBase64(
        JSON.stringify({
          sub: "google_oauth_1092837461928",
          name: "Азиз Каримов",
          given_name: "Азиз",
          family_name: "Каримов",
          email: "aziz.karimov@gmail.com",
          picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          email_verified: true,
        })
      );
      const mockCredential = `${demoHeader}.${demoPayload}.signature_verification_demo`;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: mockCredential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ошибка авторизации");
      }

      loginUser(data.user);
      setAuthSuccess(`Вход через Google успешен (${data.user.name})`);
      setTimeout(() => {
        router.push("/account");
      }, 700);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Ошибка входа");
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

          {/* Google Sign-In Container & Button */}
          <div className="space-y-3">
            <div id="googleBtnContainer" className="flex justify-center w-full" />

            <button
              type="button"
              disabled={loading}
              onClick={handleSimulatedGoogleLogin}
              className="w-full py-3 px-4 rounded-xl border border-[#D9E7E8] hover:bg-[#F5F8F8] text-[#25252B] font-semibold text-xs transition flex items-center justify-center gap-3 shadow-sm active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? "Подключение к Google..." : "Войти через Google"}</span>
            </button>
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
