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
          
          {/* İstatistikler Bölümü */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <PageHeader
                title="Rakamlarla Game Jam"
                desc="Etkinliğimizin etkileyici istatistikleri"
                variant="plain"
              />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-lg font-semibold mb-1">Katılımcı</div>
                  <div className="text-sm text-muted-foreground">Oyun geliştirme tutkusu olan</div>
                </div>

                <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">25</div>
                  <div className="text-lg font-semibold mb-1">Takım</div>
                  <div className="text-sm text-muted-foreground">Yaratıcı ekipler</div>
                </div>

                <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-purple-600 mb-2">48</div>
                  <div className="text-lg font-semibold mb-1">Saat</div>
                  <div className="text-sm text-muted-foreground">Yoğun geliştirme süreci</div>
                </div>

                <div className="text-center p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-orange-600 mb-2">₺50K</div>
                  <div className="text-lg font-semibold mb-1">Toplam Ödül</div>
                  <div className="text-sm text-muted-foreground">Kazananlar için</div>
                </div>
              </div>
            </div>
          </section>

          {/* Öne Çıkan Özellikler */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6">
              <PageHeader
                title="Neden Şehitkamil Game Jam?"
                desc="Etkinliğimizi özel kılan özellikler"
                variant="plain"
              />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Profesyonel Mentorluk</h3>
                  <p className="text-sm text-muted-foreground">
                    Alanında uzman mentorlar tarafından sürekli destek ve rehberlik alın.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Değerli Ödüller</h3>
                  <p className="text-sm text-muted-foreground">
                    Toplam ₺50.000 değerinde ödül havuzu ve kariyer fırsatları.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Networking Fırsatları</h3>
                  <p className="text-sm text-muted-foreground">
                    Sektör profesyonelleriyle tanışın ve kariyerinizi geliştirin.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Hızlı Prototipleme</h3>
                  <p className="text-sm text-muted-foreground">
                    48 saatte oyun geliştirme deneyimi kazanın.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Portföy Geliştirme</h3>
                  <p className="text-sm text-muted-foreground">
                    Geliştirdiğiniz oyun portföyünüze eklenir.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Ücretsiz Katılım</h3>
                  <p className="text-sm text-muted-foreground">
                    Tüm katılımcılar için tamamen ücretsiz etkinlik.
                  </p>
                </div>
              </div>
            </div>
          </section>

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

          {/* Hemen Kayıt Ol CTA */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hemen Kayıt Ol!
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Game Jam'e katılmak için son fırsat. 30 Eylül'e kadar kayıtlarınızı tamamlayın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/kayit" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                    </svg>
                    Kayıt Ol
                  </a>
                  <a 
                    href="/kurallar" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-blue-500/30 hover:bg-blue-500/10 text-blue-600 rounded-lg transition-all duration-200 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    Kuralları Oku
                  </a>
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
