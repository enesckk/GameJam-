"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, Filter, ChevronDown, Users, Mail, Phone, Calendar, MapPin, Building, ExternalLink, ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";
import AdminSectionCard from "../_components/admin-sectioncard";

interface Application {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  age?: number;
  type: string;
  teamName?: string;
  status: string;
  createdAt: string;
  leaderPassword?: string;
  memberPasswords?: Array<{
    email: string;
    name: string;
    password: string;
  }>;
  members?: Array<{
    name: string;
    email: string;
    role: string;
    phone: string;
    age: number;
  }>;
}

const STATUS_BADGE: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Beklemede", color: "from-yellow-500 to-orange-500", icon: Clock },
  approved: { label: "Onaylandı", color: "from-green-500 to-emerald-500", icon: CheckCircle },
  rejected: { label: "Reddedildi", color: "from-red-500 to-pink-500", icon: XCircle },
};

const ROLE_TRANSLATIONS: Record<string, string> = {
  developer: "Geliştirici",
  designer: "Tasarımcı", 
  audio: "Ses / Müzik",
  pm: "Proje Yöneticisi",
};

const getRoleTranslation = (role: string) => {
  return ROLE_TRANSLATIONS[role] || role;
};

function PageSizeSelect({
  value,
  onChange,
  options = [10, 20, 50, 100],
}: {
  value: number;
  onChange: (n: number) => void;
  options?: number[];
}) {
  const [open, setOpen] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalEl(document.body);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }
  }, [open]);

  useEffect(() => {
    if (ref.current && open) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors text-white backdrop-blur-sm"
      >
        <span>{value} / sayfa</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && portalEl && pos && createPortal(
        <div
          className="absolute z-50 bg-slate-800/90 border border-purple-500/30 rounded-xl shadow-xl min-w-[120px] backdrop-blur-sm"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-sm text-left text-white hover:bg-purple-500/20 first:rounded-t-lg last:rounded-b-lg"
            >
              {opt} / sayfa
            </button>
          ))}
        </div>,
        portalEl
      )}
    </div>
  );
}

export default function BasvurularPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/applications");
      const data = await response.json();
      if (data.ok) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Başvurular yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const response = await fetch("/api/admin/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      
      const data = await response.json();
      if (data.ok) {
        await fetchApplications();
      } else {
        alert("Güncelleme başarısız: " + data.message);
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Güncelleme başarısız");
    }
  };

  const filteredApplications = useMemo(() => {
    let filtered = applications;
    
    // Status filter
    if (filter !== "all") {
      filtered = filtered.filter(app => app.status === filter);
    }
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        (app.teamName && app.teamName.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [applications, filter, searchTerm]);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredApplications.slice(start, end);
  }, [filteredApplications, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  const getStatusBadge = (status: string) => {
    const badge = STATUS_BADGE[status] || STATUS_BADGE.pending;
    const Icon = badge.icon;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${badge.color} text-white`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Başvurular</h1>
            <p className="text-slate-400">Game Jam başvurularını yönetin</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:18px_18px] opacity-40 sm:opacity-50" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 blur-lg opacity-60 sm:opacity-75" />
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 shadow-lg">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
                Başvurular
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                Game Jam başvurularını yönetin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-300" />
              <input
                type="text"
                placeholder="İsim, e-posta veya takım ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              />
            </div>
            <PageSizeSelect value={pageSize} onChange={setPageSize} />
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <AdminSectionCard title="Filtreler">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Tümü", count: applications.length },
            { key: "pending", label: "Beklemede", count: applications.filter(a => a.status === "pending").length },
            { key: "approved", label: "Onaylandı", count: applications.filter(a => a.status === "approved").length },
            { key: "rejected", label: "Reddedildi", count: applications.filter(a => a.status === "rejected").length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === key
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-slate-700/80 text-slate-300 hover:bg-slate-600 border border-slate-500/50 hover:border-purple-500/50"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </AdminSectionCard>

      {/* Başvuru Listesi */}
      <AdminSectionCard title={`${filteredApplications.length} Başvuru`}>
        <div className="space-y-4">
          {paginatedApplications.map((app) => (
            <div key={app.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      {app.type === "team" ? (
                        <Building className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Users className="w-5 h-5 text-green-400" />
                      )}
                      <h3 className="text-lg font-semibold text-white">
                        {app.type === "team" ? app.teamName : app.name}
                      </h3>
                    </div>
                    {getStatusBadge(app.status)}
                    {app.type === "team" && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                        Takım Başvurusu
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span><strong>Takım Kaptanı:</strong> {app.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span><strong>E-posta:</strong> {app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span><strong>Telefon:</strong> {app.phone || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span><strong>Rol:</strong> {getRoleTranslation(app.role)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span><strong>Yaş:</strong> {app.age || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span><strong>Tarih:</strong> {new Date(app.createdAt).toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>

                  {/* Takım Üyeleri */}
                  {app.type === "team" && (
                    <div className="mt-6">
                      {app.members && app.members.length > 0 ? (
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Takım Üyeleri ({app.members.length} kişi)</span>
                            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="mt-4 space-y-3 pl-6 border-l-2 border-blue-500/30">
                            {app.members.map((member, index) => (
                              <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span><strong>İsim:</strong> {member.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span><strong>E-posta:</strong> {member.email}</span>
                                  </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                  <span><strong>Rol:</strong> {getRoleTranslation(member.role)}</span>
                                </div>
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span><strong>Telefon:</strong> {member.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span><strong>Yaş:</strong> {member.age}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-yellow-300">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">Takım üyeleri bilgisi bulunamadı</span>
                          </div>
                          <p className="text-yellow-200 text-sm mt-1">
                            Bu başvuru eski sistemde yapılmış olabilir. Yeni başvurularda takım üyeleri görünecektir.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Şifreler - Sadece onaylanmış başvurular için */}
                  {app.status === "approved" && (app.leaderPassword || app.memberPasswords) && (
                    <div className="mt-6">
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-green-400 hover:text-green-300 flex items-center gap-2">
                          <span>🔐 Giriş Şifreleri</span>
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-4 space-y-3 pl-6 border-l-2 border-green-500/30">
                          {/* Lider şifresi */}
                          {app.leaderPassword && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 text-green-300 mb-2">
                                <span className="font-medium">👑 Takım Kaptanı Şifresi</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="text-green-200">
                                  <strong>E-posta:</strong> {app.email}
                                </div>
                                <div className="text-green-200">
                                  <strong>Şifre:</strong> 
                                  <code className="ml-2 bg-green-800/50 px-2 py-1 rounded text-green-100 font-mono">
                                    {app.leaderPassword}
                                  </code>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Üye şifreleri */}
                          {app.memberPasswords && app.memberPasswords.length > 0 && (
                            <div className="space-y-2">
                              {app.memberPasswords.map((member, index) => (
                                <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                  <div className="flex items-center gap-2 text-green-300 mb-2">
                                    <span className="font-medium">👤 {member.name}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div className="text-green-200">
                                      <strong>E-posta:</strong> {member.email}
                                    </div>
                                    <div className="text-green-200">
                                      <strong>Şifre:</strong> 
                                      <code className="ml-2 bg-green-800/50 px-2 py-1 rounded text-green-100 font-mono">
                                        {member.password}
                                      </code>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  )}
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-3 ml-6">
                    <button
                      onClick={() => updateApplicationStatus(app.id, "approved")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Onayla
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "rejected")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                {filter === "all" ? "Henüz başvuru yok" : `${filter === "pending" ? "Beklemede" : filter === "approved" ? "Onaylandı" : "Reddedildi"} başvuru yok`}
              </h3>
              <p className="text-slate-500">
                {filter === "all" ? "İlk başvuru geldiğinde burada görünecek" : "Bu kategoride başvuru bulunmuyor"}
              </p>
            </div>
          )}
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              {filteredApplications.length} başvurudan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredApplications.length)} arası gösteriliyor
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Önceki
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </AdminSectionCard>
    </div>
  );
}
