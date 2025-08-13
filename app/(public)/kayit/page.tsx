"use client";
import { useState } from "react";

export default function Kayit(){
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
  name: form.get("name"),
  email: form.get("email"),
  role: form.get("role"),                   // "developer" | "designer" | "audio" | "pm"
  consentKVKK: form.get("consentKVKK") === "on", // boolean
};

    const res = await fetch("/api/apply", { method:"POST", body: JSON.stringify(payload) });
    if(res.ok) setMsg("Başvurun alındı! E-postanı kontrol et.");
    else setMsg("Formu kontrol et: Zorunlu alan/format hatası olabilir.");
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">Kayıt</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input name="name" placeholder="Ad Soyad" className="w-full rounded border px-3 py-2" required />
        <input name="email" placeholder="E-posta" type="email" className="w-full rounded border px-3 py-2" required />
        <select name="role" className="w-full rounded border px-3 py-2">
          <option value="developer">Yazılımcı</option>
          <option value="designer">Tasarımcı</option>
          <option value="audio">Ses/Müzik</option>
          <option value="pm">İçerik/PM</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="consentKVKK" required /> KVKK metnini okudum, onaylıyorum.
        </label>
        <button className="rounded bg-primary px-5 py-2 text-white hover:bg-primary-600 shadow-neon">Başvuruyu Gönder</button>
      </form>
      {msg && <p className="mt-4 text-sm">{msg}</p>}
    </div>
  );
}
