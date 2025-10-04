"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/prisma";
import AdminHeader from "../_components/admin-header";
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
}

export default function BasvurularPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

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

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "approved": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Beklemede";
      case "approved": return "Onaylandı";
      case "rejected": return "Reddedildi";
      default: return "Bilinmiyor";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Başvurular" desc="Game Jam başvurularını yönetin" />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Başvurular" desc="Game Jam başvurularını yönetin" />

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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          {filteredApplications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>E-posta:</strong> {app.email}
                    </div>
                    <div>
                      <strong>Telefon:</strong> {app.phone || "Belirtilmemiş"}
                    </div>
                    <div>
                      <strong>Rol:</strong> {app.role}
                    </div>
                    <div>
                      <strong>Yaş:</strong> {app.age || "Belirtilmemiş"}
                    </div>
                    <div>
                      <strong>Takım Adı:</strong> {app.teamName || "Bireysel"}
                    </div>
                    <div>
                      <strong>Başvuru Tarihi:</strong> {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => updateApplicationStatus(app.id, "approved")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "rejected")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {filter === "all" ? "Henüz başvuru yok" : `${getStatusText(filter)} başvuru yok`}
            </div>
          )}
        </div>
      </AdminSectionCard>
    </div>
  );
}
