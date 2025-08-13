export default function PanelLayout({ children }: { children: React.ReactNode }){
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6 px-6 py-8">
      <aside className="col-span-12 md:col-span-3 space-y-2">
        <div className="rounded-lg border p-4">Panel Menüsü (Profil, Takım, Teslim)</div>
      </aside>
      <section className="col-span-12 md:col-span-9">{children}</section>
    </div>
  );
}
