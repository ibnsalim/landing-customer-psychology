import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import ValueProposition from "@/components/landing/ValueProposition";
import SocialProof from "@/components/landing/SocialProof";
import ReadingExperience from "@/components/landing/ReadingExperience";
import GuaranteeSection from "@/components/landing/GuaranteeSection";
import OfferSection from "@/components/landing/OfferSection";
import CTASection from "@/components/landing/CTASection";
import UrgencySection from "@/components/landing/UrgencySection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import SectionDivider from "@/components/SectionDivider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <ProblemSection />
      <SectionDivider />
      <SolutionSection />
      <SectionDivider />
      <ValueProposition />
      <SectionDivider />
      <SocialProof />
      <SectionDivider />
      <ReadingExperience />
      <SectionDivider />
      <GuaranteeSection />
      <SectionDivider />
      <OfferSection />
      <SectionDivider />
      <CTASection />
      <SectionDivider />
      <UrgencySection />
      <SectionDivider />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
