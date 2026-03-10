import { Link } from "react-router-dom";
import GoldCTA from "@/components/GoldCTA";

export default function UrgencySection() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container max-w-2xl mx-auto text-center space-y-8">
        <p className="text-urgency text-lg">⏰ লঞ্চ প্রাইস শেষ হচ্ছে</p>

        <div className="flex items-center justify-center gap-2 text-urgency">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse-red" />
          <span>এই দামে মাত্র সীমিত কপি বাকি</span>
        </div>

        <p className="text-xl text-foreground leading-relaxed">
          আপনার একই এলাকায় যে উদ্যোক্তারা এগিয়ে যাচ্ছেন —
          <br />
          তারা কিন্তু আর randomly মার্কেটিং করছেন না।
          <br />
          তারা জানেন তাদের <span className="text-primary">কাস্টমার কে</span>।
          <br />
          তারা জানেন সে <span className="text-primary">কোথায়</span> আছে।
          <br />
          তারা জানেন সে <span className="text-primary">কখন</span> কিনতে প্রস্তুত।
        </p>

        <p className="text-lg text-foreground">
          এই জ্ঞানটা এখন আপনারও হতে পারে।
          <br />
          মাত্র <span className="text-primary font-bold font-inter">৳২৭৯</span>-এ।
        </p>

        <Link to="/checkout">
          <GoldCTA size="lg">হ্যাঁ, আমি আমার সঠিক কাস্টমার খুঁজে পেতে চাই</GoldCTA>
        </Link>
      </div>
    </section>
  );
}
