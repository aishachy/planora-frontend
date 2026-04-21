
import { HeroSection } from "@/components/blog7";
import { Footer2 } from "@/components/footer2";
import CallToAction from "components/callToAction/callToAction";
import EventCategories from "components/eventCategories/eventCategories";
import { Slider } from "components/slider/slider";




export default function Home() {
  return (
    <>
      <HeroSection />
      <Slider />
      <EventCategories></EventCategories>
      <CallToAction />
      <Footer2></Footer2>
    </>
  )
}
