import { Link } from "react-router-dom";
import GoldCTA from "@/components/GoldCTA";

const items = [
  { icon: "📚", label: "Customer Psychology — সম্পূর্ণ ডিজিটাল ইবুক (150+ পেজ)", value: "৳৮৯৯" },
  { icon: "🎯", label: "Ideal Customer Profile Blueprint", value: "৳৪৯৯" },
  { icon: "📊", label: "৫টি বাংলাদেশী কেস স্টাডি", value: "৳২৯৯" },
  { icon: "⚡", label: "Wrong Audience Cheatsheet (Bonus)", value: "৳১৯৯" },
];

export default function OfferSection() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          আপনি <span className="text-primary">কী পাচ্ছেন</span>
        </h2>

        <div className="space-y-4 mb-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-card rounded-xl border border-primary/10 p-4">
              <div className="flex items-center gap-3 text-left">
                <span className="text-xl">{item.icon}</span>
                <span className="text-foreground/90">{item.label}</span>
              </div>
              <span className="text-muted-foreground line-through font-inter text-sm shrink-0">{item.value}</span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mb-6">
          সব মিলিয়ে মোট মূল্য: <span className="line-through font-inter">৳১৮,৮৯৬</span>
        </p>

        <div className="space-y-2 mb-8">
          <p className="text-muted-foreground text-lg">লঞ্চ প্রাইস</p>
          <p className="text-primary font-bold font-inter" style={{ fontSize: "3.5rem" }}>৳২৭৯</p>
          <span className="inline-block bg-success/20 text-success text-sm font-semibold px-3 py-1 rounded-full font-inter">
            আপনি সেভ করছেন ৳৬২০
          </span>
          <p className="text-urgency text-sm mt-2">"এই দাম বেশি দিন থাকবে না"</p>
        </div>

        <Link to="/checkout">
          <GoldCTA size="lg">বইটি ডাউনলোড করুন</GoldCTA>
        </Link>
      </div>
    </section>
  );
}
