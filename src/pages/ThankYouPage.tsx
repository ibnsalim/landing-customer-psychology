import { useSearchParams, useNavigate } from "react-router-dom";

const METHODS: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
};

export default function ThankYouPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = params.get("order") || "—";
  const savedMethod = localStorage.getItem("lastPaymentMethod") || "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Animated Checkmark */}
      <svg className="mb-6 h-24 w-24" viewBox="0 0 52 52">
        <circle
          cx="26" cy="26" r="24"
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-20"
        />
        <circle
          cx="26" cy="26" r="24"
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="150"
          strokeDashoffset="150"
          className="animate-draw-check"
          style={{ animationDelay: "0.2s" }}
        />
        <path
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l8 8 16-16"
          strokeDasharray="40"
          strokeDashoffset="40"
          className="animate-draw-check"
          style={{ animationDelay: "0.6s" }}
        />
      </svg>

      <h1 className="mb-2 text-2xl font-bold text-foreground text-center">
        ধন্যবাদ! আপনার অর্ডার নিশ্চিত হয়েছে।
      </h1>
      <p className="mb-8 text-lg gold-text font-semibold">Customer Psychology ইবুক</p>

      {/* Order Summary */}
      <div className="w-full max-w-sm card-dark p-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">অর্ডার নম্বর:</span>
          <span className="font-bold text-foreground">{orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">প্রোডাক্ট:</span>
          <span className="text-foreground">Customer Psychology ইবুক</span>
        </div>
        {savedMethod && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">পেমেন্ট মেথড:</span>
            <span className="text-foreground">{METHODS[savedMethod] || savedMethod}</span>
          </div>
        )}
      </div>

      {/* Delivery note */}
      <div className="mt-6 max-w-sm text-center text-sm text-muted-foreground leading-relaxed">
        ✉️ পেমেন্ট যাচাই হওয়ার পর সর্বোচ্চ <span className="font-bold text-foreground">১২ ঘণ্টার</span> মধ্যে
        আপনার ইমেইলে ডাউনলোড লিঙ্ক পাঠানো হবে।
      </div>

      {/* Support */}
      <p className="mt-4 text-xs text-muted-foreground">
        কোনো সমস্যা হলে WhatsApp করুন: <span className="gold-text">01842-081088</span>
      </p>

      {/* Share */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">বন্ধুদের জানান →</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          Facebook
        </a>
      </div>

      {/* Home button */}
      <button
        onClick={() => navigate("/")}
        className="gold-gradient mt-8 rounded-xl px-8 py-3 font-bold text-primary-foreground"
      >
        হোম পেজে ফিরুন
      </button>
    </div>
  );
}
