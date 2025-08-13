export default function Hero(){
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-[#0B1020] to-[#111827] text-white dark:from-[#0B1020] dark:to-[#111827]">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Oyna ve Kazan!</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Oyununu geliştir, puan topla, ödülleri kap. Başarılı projeler belediye mobil uygulamasına entegre edilecek.
        </p>
        <a href="/kayit" className="mt-8 inline-flex items-center rounded-xl bg-primary px-6 py-3 text-white hover:bg-primary-600 shadow-neon">
          Kayıt Ol
        </a>
      </div>
    </section>
  );
}
