import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    initials: "রা.বে.",
    quote: "আমি হোমমেড আচার বিক্রি করি। আগে যে কেউ জিজ্ঞেস করলেই ছুটে যেতাম। শেষে দেখতাম তারা ৳৫০ কমাতে চান। এই বইটা পড়ার পর বুঝলাম — আমার কাস্টমার আসলে ঢাকার প্রবাসী পরিবার। এখন শুধু তাদের কাছেই বিক্রি করি। মাসিক সেলস ৳১২,০০০ থেকে ৳৫৮,০০০।",
    name: "রাহেলা বেগম",
    location: "নারায়ণগঞ্জ",
  },
  {
    initials: "ক.উ.",
    quote: "আমার একটা tailoring shop। সবাই বলত দাম কমাও। বইটায় Ideal Customer concept পড়লাম। বুঝলাম corporate office মানুষদের target করিনি কখনো। ৩ মাসে পুরো client base বদলে গেছে।",
    name: "করিম উদ্দিন",
    location: "মতিঝিল",
  },
  {
    initials: "সু.তা.",
    quote: "আমি online-এ handicraft বিক্রি করি। Facebook-এ post দিতাম, কেউ কিনত না। এই বইটা পড়ার পর বুঝলাম — আমার কাস্টমার Facebook-এ না, Instagram-এ। প্রথম মাসেই ৳৪৫,০০০+ সেলস।",
    name: "সুমাইয়া তাসনিম",
    location: "সিলেট",
  },
];

const badges = [
  "🔒 নিরাপদ পেমেন্ট",
  "💳 Bkash · Nagad · Rocket",
  "📚 ১,২০০+ পাঠক",
  "🛡 ৭ দিনের গ্যারান্টি",
];

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.ceil(target / 60);
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(current);
            if (current >= target) clearInterval(interval);
          }, 25);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("bn-BD")}</span>;
}

export default function SocialProof() {
  return (
    <section className="py-20 md:py-28 px-4 bg-section-alt">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-bold font-inter" style={{ fontSize: "3rem" }}>
            <CountUp target={1200} />+
          </p>
          <p className="text-foreground text-xl">
            ছোট ব্যবসার মালিক
            <br />
            তাদের সঠিক কাস্টমার খুঁজে পেয়েছেন এই সিস্টেম দিয়ে
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {t.initials}
                </div>
                <span className="text-primary text-sm">★★★★★</span>
              </div>
              <p className="text-foreground/90 leading-relaxed text-sm">"{t.quote}"</p>
              <p>
                <span className="text-primary font-semibold">— {t.name}</span>
                <span className="text-muted-foreground text-sm">, {t.location}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {badges.map((b, i) => (
            <span key={i} className="bg-card border border-primary/20 rounded-full px-4 py-2 text-sm text-muted-foreground">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
