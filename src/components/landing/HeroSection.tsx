import { useState } from "react";
import { Link } from "react-router-dom";
import GoldCTA from "@/components/GoldCTA";
import PreviewModal from "@/components/PreviewModal";
import bookCover from "@/assets/book-cover.jpg";

export default function HeroSection() {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28 px-4">
      <div className="container max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Left — Headline */}
        <div className="flex-1 space-y-6">
          <span className="inline-block border border-primary/40 text-primary text-sm px-4 py-1 rounded-full">
            বাংলাদেশের প্রথম কাস্টমার সাইকোলজি প্লেবুক
          </span>

          <h1
            className="font-bold leading-[1.15] text-foreground"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            আপনার প্রোডাক্টের সমস্যা নেই।
            <br />
            সমস্যা হলো — আপনি <span className="text-primary">ভুল মানুষের</span> কাছে বিক্রির চেষ্টা করছেন
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            বেশিরভাগ উদ্যোক্তা সারাজীবন অ্যাড দেন, কনটেন্ট বানান, ডিসকাউন্ট দেন —
            কিন্তু যে মানুষটা সত্যিই কিনতে চায়, তাকে কখনো খুঁজে বের করতে পারেন না।
            <br />
            এই বইটা সেই মানুষটাকে চেনার সিস্টেম।
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/checkout">
              <GoldCTA size="lg">বইটি ডাউনলোড করুন →</GoldCTA>
            </Link>
            <button
              onClick={() => setPreviewOpen(true)}
              className="border border-primary/40 text-primary rounded-lg px-6 py-3 text-sm hover:bg-primary/10 transition-colors"
            >
              👁 একটু পড়ে দেখুন
            </button>
          </div>

          <p className="text-sm text-success">
            ✔ ৭ দিনের মানি-ব্যাক গ্যারান্টি &nbsp; ✔ ১,২০০+ পাঠক
          </p>
        </div>

        {/* Right — Book Visual */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: "0 0 80px rgba(201,169,110,0.25)" }} />
            <img
              src={bookCover}
              alt="কাস্টমার সাইকোলজি বইয়ের কভার"
              className="w-64 md:w-80 rounded-xl animate-float relative z-10"
              style={{ perspective: "1000px", transform: "rotateY(-5deg)" }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>📚 150+ পেজ</span>
            <span>🎯 ৫টি বাংলাদেশী কেস স্টাডি</span>
            <span>⚡ বোনাস: Wrong Audience Cheatsheet</span>
          </div>
        </div>
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </section>
  );
}
