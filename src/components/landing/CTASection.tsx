import { Link } from "react-router-dom";
import GoldCTA from "@/components/GoldCTA";
import CountdownTimer from "@/components/CountdownTimer";

export default function CTASection() {
  return (
    <section
      id="checkout-section"
      className="py-20 md:py-28 px-4"
      style={{ background: "radial-gradient(ellipse at center, hsl(240 16% 19%), hsl(230 18% 11%))" }}
    >
      <div className="container max-w-xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-urgency">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse-red" />
          <span>এই দামে মাত্র <span className="font-bold font-inter">50</span> কপি বাকি</span>
        </div>

        <CountdownTimer />

        <p className="text-primary font-bold font-inter" style={{ fontSize: "3.5rem" }}>৳২৭৯</p>

        <Link to="/checkout">
          <GoldCTA size="lg" className="rounded-full py-5 px-10 text-xl">
            বইটি ডাউনলোড করুন
          </GoldCTA>
        </Link>
      </div>
    </section>
  );
}
