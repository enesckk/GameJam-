import Hero from "@/components/hero";
import IntroCards from "@/components/home/intro-cards";
import AwardsPreview from "@/components/home/awards-preview";
import SchedulePreview from "@/components/home/schedule-preview";
import SponsorsStrip from "@/components/home/sponsors-strip";
import JuryPreview from "@/components/home/jury-preview";
import SocialTask from "@/components/home/social-task";
import BottomCTA from "@/components/home/bottom-cta";
import VideoBG from "@/components/background/video-bg"; // ✅ normal import

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="relative">
        <VideoBG
          light={{ webm: "/videos/light.webm", mp4: "/videos/bg-light.mp4", poster: "/videos/light-poster.jpg" }}
          dark={{ webm: "/videos/dark.webm", mp4: "/videos/bg-dark.mp4", poster: "/videos/dark-poster.jpg" }}
          opacity={0.78}
          overlay
        />
        <div className="relative z-10">
          <IntroCards />
          <AwardsPreview />
          <SchedulePreview />
          <SponsorsStrip />
          <JuryPreview />
          <SocialTask />
          <BottomCTA />
        </div>
      </section>
    </>
  );
}
