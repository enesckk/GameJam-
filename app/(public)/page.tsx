import Hero from "@/components/hero";
import IntroCards from "@/components/home/intro-cards";
import AwardsPreview from "@/components/home/awards-preview";
import SchedulePreview from "@/components/home/schedule-preview";
import SponsorsStrip from "@/components/home/sponsors-strip";
import JuryPreview from "@/components/home/jury-preview";
import SocialTask from "@/components/home/social-task";
import BottomCTA from "@/components/home/bottom-cta";
import VideoBG from "@/components/background/video-bg";
import PageHeader from "../panel/_components/page-header";

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Ana İçerik Bölümü */}
      <section className="relative">
        <VideoBG
          light={{ mp4: "/videos/bg-light.mp4"}}
          dark={{  mp4: "/videos/bg-dark.mp4" }}
          opacity={0.78}
          overlay
        />
        <div className="relative z-10">
          <IntroCards />
          <AwardsPreview />
          
          {/* Detaylı Takvim Timeline */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <PageHeader
                title="Etkinlik Takvimi"
                desc="Game Jam sürecinin tüm aşamaları ve önemli tarihler"
                variant="plain"
              />
              
              <div className="mt-16 space-y-8">
                {/* Timeline Items */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                  
                  {/* Timeline Items */}
                  <div className="space-y-12">
                    {/* Kayıtların Açılması */}
                    <div className="relative flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <div className="text-center text-white font-bold">
                          <div className="text-sm">15</div>
                          <div className="text-xs">Eylül</div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">Kayıtların Açılması</h3>
                        <p className="text-muted-foreground mb-3">
                          Game Jam'e katılım için kayıtlar başlar. Takımlar oluşturulur ve ön kayıt formları doldurulur.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            09:00 - 18:00
                          </span>
                          <span className="flex items-center gap-1 text-purple-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            Online Kayıt
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Son Kayıt Tarihi */}
                    <div className="relative flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                        <div className="text-center text-white font-bold">
                          <div className="text-sm">30</div>
                          <div className="text-xs">Eylül</div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-orange-600 mb-2">Son Kayıt Tarihi</h3>
                        <p className="text-muted-foreground mb-3">
                          Game Jam'e katılım için son kayıt tarihi. Bu tarihten sonra yeni kayıt alınmayacaktır.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            23:59
                          </span>
                          <span className="flex items-center gap-1 text-red-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            Online Kayıt
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ön Hazırlık Toplantısı */}
                    <div className="relative flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                        <div className="text-center text-white font-bold">
                          <div className="text-sm">10</div>
                          <div className="text-xs">Ekim</div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-green-600 mb-2">Ön Hazırlık Toplantısı</h3>
                        <p className="text-muted-foreground mb-3">
                          Katılımcılar için bilgilendirme toplantısı. Kurallar, teknik detaylar ve organizasyon hakkında bilgi verilir.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            14:00 - 16:00
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            Şehitkamil Belediyesi Sanat Merkezi
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Game Jam Başlangıcı */}
                    <div className="relative flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <div className="text-center text-white font-bold">
                          <div className="text-sm">12</div>
                          <div className="text-xs">Ekim</div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-purple-600 mb-2">Game Jam Başlangıcı</h3>
                        <p className="text-muted-foreground mb-3">
                          Tema açıklanır ve 48 saatlik geliştirme süreci başlar. Takımlar oyunlarını geliştirmeye başlar.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-purple-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            23:59
                          </span>
                          <span className="flex items-center gap-1 text-pink-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            Online Platform
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proje Teslimi */}
                    <div className="relative flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <div className="text-center text-white font-bold">
                          <div className="text-sm">15</div>
                          <div className="text-xs">Ekim</div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Proje Teslimi</h3>
                        <p className="text-muted-foreground mb-3">
                          Oyunların teslim edilmesi için son tarih. Bu saatten sonra yapılan değişiklikler kabul edilmez.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-red-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            23:59
                          </span>
                          <span className="flex items-center gap-1 text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            Online Platform
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ödül Töreni */}
                    <div className="relative flex items-start gap-8">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                        <div className="text-center text-white font-bold">
                          <div className="text-sm">18</div>
                          <div className="text-xs">Ekim</div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-yellow-600 mb-2">Ödül Töreni</h3>
                        <p className="text-muted-foreground mb-3">
                          Kazananlar açıklanır ve ödüller dağıtılır. Tüm katılımcılar için özel etkinlik.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-yellow-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            19:00 - 22:00
                          </span>
                          <span className="flex items-center gap-1 text-amber-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            Şehitkamil Belediyesi Sanat Merkezi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Önemli Tarihler Kartları */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <PageHeader
                title="Önemli Tarihler"
                desc="Game Jam sürecinin kritik dönüm noktaları"
                variant="plain"
              />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
                {/* Kayıt Başlangıcı */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Kayıt Başlangıcı</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-blue-600">15 Eylül 2025</div>
                    <div className="text-xs text-muted-foreground">09:00</div>
                  </div>
                </div>

                {/* Kayıt Sonu */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Kayıt Sonu</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-red-600">30 Eylül 2025</div>
                    <div className="text-xs text-muted-foreground">23:59</div>
                  </div>
                </div>

                {/* Game Jam Başlangıcı */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Game Jam Başlangıcı</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-green-600">12 Ekim 2025</div>
                    <div className="text-xs text-muted-foreground">23:59</div>
                  </div>
                </div>

                {/* Proje Teslimi */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Proje Teslimi</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-orange-600">15 Ekim 2025</div>
                    <div className="text-xs text-muted-foreground">23:59</div>
                  </div>
                </div>

                {/* Ödül Töreni */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ödül Töreni</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-yellow-600">18 Ekim 2025</div>
                    <div className="text-xs text-muted-foreground">19:00</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Günlük Program Detayları */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <PageHeader
                title="Günlük Program"
                desc="48 saatlik Game Jam sürecinin detaylı programı"
                variant="plain"
              />
              
              <div className="mt-12">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* 1. Gün */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                      1. Gün
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-blue-600 bg-blue-500/20 px-2 py-1 rounded">23:59</div>
                        <div>
                          <h4 className="font-semibold text-sm">Tema Açıklanması</h4>
                          <p className="text-xs text-muted-foreground">Game Jam teması açıklanır ve geliştirme süreci başlar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-blue-600 bg-blue-500/20 px-2 py-1 rounded">00:30</div>
                        <div>
                          <h4 className="font-semibold text-sm">Takım Toplantıları</h4>
                          <p className="text-xs text-muted-foreground">Takımlar kendi aralarında planlama yapar.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Gün */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                      2. Gün
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-green-600 bg-green-500/20 px-2 py-1 rounded">10:00</div>
                        <div>
                          <h4 className="font-semibold text-sm">Geliştirme Süreci</h4>
                          <p className="text-xs text-muted-foreground">Yoğun geliştirme süreci devam eder.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-green-600 bg-green-500/20 px-2 py-1 rounded">15:00</div>
                        <div>
                          <h4 className="font-semibold text-sm">Ara Kontrol</h4>
                          <p className="text-xs text-muted-foreground">Organizasyon ekibi ilerleme kontrolü yapar.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Gün */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                      3. Gün
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-purple-600 bg-purple-500/20 px-2 py-1 rounded">20:00</div>
                        <div>
                          <h4 className="font-semibold text-sm">Son Kontroller</h4>
                          <p className="text-xs text-muted-foreground">Oyunların son testleri yapılır.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-purple-600 bg-purple-500/20 px-2 py-1 rounded">23:59</div>
                        <div>
                          <h4 className="font-semibold text-sm">Proje Teslimi</h4>
                          <p className="text-xs text-muted-foreground">Oyunlar teslim edilir ve geliştirme süreci sona erer.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SponsorsStrip />
          <JuryPreview />
          <SocialTask />
          <BottomCTA />
        </div>
      </section>
    </>
  );
}
