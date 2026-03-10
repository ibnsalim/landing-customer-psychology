import { Link } from "react-router-dom";
import GoldCTA from "@/components/GoldCTA";

const bullets = [
  "আপনার সঠিক কাস্টমার দেখতে কেমন, কোথায় থাকেন, কী দেখে সিদ্ধান্ত নেন — সম্পূর্ণ blueprint",
  "কোন মুহূর্তে একজন মানুষ কিনতে প্রস্তুত হয় — সেই exact signal চেনার পদ্ধতি",
  "কোন মানুষগুলো আপনার সময় নষ্ট করছে — এবং কীভাবে তাদের early-তে চিনবেন",
  "কেউ দাম নিয়ে আপত্তি করলে সেটা কি সত্যিই দামের সমস্যা নাকি অন্য কিছু",
  "ঢাকা-চট্টগ্রাম-সিলেটের ছোট ব্যবসার কাস্টমাররা কীভাবে সিদ্ধান্ত নেন",
  "সঠিক কাস্টমার কিনা বোঝার জন্য কোন প্রশ্নগুলো করতে হয়",
];

const outcomes = [
  "সঠিক কাস্টমার চিনতে",
  "অপ্রয়োজনীয় কাস্টমার এড়াতে",
  "কম কাস্টমার থেকে বেশি বিক্রি করতে",
  "কম মার্কেটিং করে বেশি লাভ করতে",
  "কাস্টমারের মন বুঝে কন্টেন্ট বানাতে",
];

export default function ValueProposition() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block border border-primary/40 text-primary text-sm px-4 py-1 rounded-full mb-6">
            বইটির মূল থিম
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            এই বইটা পড়ার পর আপনি <span className="text-primary">জানবেন</span> —
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {bullets.map((b, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl hover:-translate-y-0.5 transition-transform">
              <span className="text-primary text-lg shrink-0">✦</span>
              <p className="text-foreground/90 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <Link to="/checkout">
            <GoldCTA size="lg">এই বইটাই তো আমার দরকার — এখনই অর্ডার করুন</GoldCTA>
          </Link>
        </div>

        <div className="bg-card rounded-xl border-l-4 border-primary max-w-xl mx-auto p-6 space-y-3">
          <h3 className="text-primary font-bold text-lg">এই বই পড়ার পর আপনি পারবেন —</h3>
          {outcomes.map((o, i) => (
            <p key={i} className="flex items-start gap-2">
              <span className="text-success shrink-0">✔</span>
              <span className="text-foreground/90">{o}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
