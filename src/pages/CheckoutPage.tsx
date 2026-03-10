import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, CheckCircle, X } from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "rocket";

interface OrderResult {
  name: string;
  method: PaymentMethod;
  transactionId: string;
  orderNumber: string;
}

const PAYMENT_LABELS: Record<PaymentMethod, { label: string; emoji: string; color: string }> = {
  bkash: { label: "bKash", emoji: "🟣", color: "border-purple-500/50 bg-purple-500/10" },
  nagad: { label: "Nagad", emoji: "🟠", color: "border-orange-500/50 bg-orange-500/10" },
  rocket: { label: "Rocket", emoji: "🟣", color: "border-violet-500/50 bg-violet-500/10" },
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [txnId, setTxnId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateWarn, setDuplicateWarn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<OrderResult | null>(null);
  const [failureMsg, setFailureMsg] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "নাম অন্তত ২ অক্ষরের হতে হবে";
    if (!/^01[3-9]\d{8}$/.test(phone)) e.phone = "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "সঠিক ইমেইল দিন";
    if (!method) e.method = "পেমেন্ট মেথড নির্বাচন করুন";
    if (txnId.trim().length < 8) e.txnId = "ট্রানজেকশন আইডি অন্তত ৮ অক্ষরের হতে হবে";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const checkDuplicate = async () => {
    if (txnId.trim().length < 8) return;
    const { data } = await supabase
      .from("payments")
      .select("id")
      .eq("transaction_id", txnId.trim())
      .limit(1);
    setDuplicateWarn(!!data && data.length > 0);
  };

  const handleSubmit = async () => {
    if (!validate() || !method) return;
    setLoading(true);
    setFailureMsg(null);

    try {
      // Get product
      const { data: product } = await supabase
        .from("products")
        .select("id")
        .eq("slug", "customer-psychology")
        .single();
      if (!product) throw new Error("Product not found");

      // Upsert customer
      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .upsert({ full_name: name.trim(), email: email.trim(), phone: phone.trim() }, { onConflict: "email" })
        .select()
        .single();
      if (custErr || !customer) throw new Error(custErr?.message || "Customer error");

      // Insert order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          order_number: "temp",
          customer_id: customer.id,
          product_id: product.id,
          full_name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          payment_method: method,
          transaction_id: txnId.trim(),
          amount: 279.0,
          status: "pending",
        })
        .select()
        .single();
      if (orderErr || !order) throw new Error(orderErr?.message || "Order error");

      // Insert payment
      await supabase.from("payments").insert({
        order_id: order.id,
        customer_id: customer.id,
        method,
        transaction_id: txnId.trim(),
        amount: 279.0,
        status: "pending",
      });

      // Store for thank-you page
      localStorage.setItem("lastPaymentMethod", method);

      setSuccessOrder({
        name: name.trim(),
        method,
        transactionId: txnId.trim(),
        orderNumber: order.order_number,
      });
    } catch (err: any) {
      setFailureMsg(err?.message || "কিছু সমস্যা হয়েছে");
      setTimeout(() => setFailureMsg(null), 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top persuasion bar */}
      <div className="gold-gradient py-2 text-center">
        <p className="text-sm font-bold text-primary-foreground">
          ⚡ আপনি প্রায় শেষ ধাপে পৌঁছে গেছেন — আর মাত্র ৩০ সেকেন্ড
        </p>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">অর্ডার সম্পন্ন করুন</h1>
          <p className="text-xl font-semibold gold-text">আজকের লঞ্চ প্রাইস: ৳২৭৯</p>
          <p className="mt-1 text-sm text-muted-foreground">
            এই অফার খুব দ্রুতই আবার ৳৮৯৯ হতে পারে।
          </p>
        </div>

        {/* Form Card */}
        <div className="card-dark p-6 sm:p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">নাম *</label>
            <input
              type="text"
              placeholder="আপনার পুরো নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">মোবাইল নম্বর *</label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ইমেইল *</label>
            <input
              type="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">পেমেন্ট মেথড *</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((key) => {
                const p = PAYMENT_LABELS[key];
                const selected = method === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMethod(key)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 transition-all ${
                      selected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : `border-border bg-secondary hover:${p.color}`
                    }`}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{p.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.method && <p className="mt-1 text-sm text-destructive">{errors.method}</p>}
          </div>

          {/* Payment Instructions */}
          <AnimatePresence>
            {method && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-primary/40 bg-background p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    👉 <strong>{PAYMENT_LABELS[method].label}</strong> নম্বরে ৳২৭৯ পাঠান:
                    <br />
                    📱 <span className="font-bold gold-text">01842-081088</span>
                    <br />→ Send Money / Personal করুন
                    <br />→ ট্রানজেকশন হলে নিচে Transaction ID লিখুন
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction ID */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Transaction ID *</label>
            <input
              type="text"
              placeholder="উদাহরণ: 8N5KXXXXXXX"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              onBlur={checkDuplicate}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.txnId && <p className="mt-1 text-sm text-destructive">{errors.txnId}</p>}
            {duplicateWarn && (
              <p className="mt-1 text-sm text-warning">
                ⚠️ এই Transaction ID আগে ব্যবহার করা হয়েছে
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="gold-gradient w-full rounded-xl py-4 text-lg font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            ) : (
              "আমার ইবুকটি নিশ্চিত করলাম →"
            )}
          </button>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
          ইতিমধ্যে <span className="gold-text font-bold">১,২০০+</span> উদ্যোক্তা এই ইবুক পড়েছেন
        </p>

        {/* Reading psychology */}
        <p className="mt-4 text-center text-xs italic text-muted-foreground leading-relaxed">
          সত্য কথা হলো — অনেক মানুষ ইবুক কিনলেও পড়ে শেষ করতে পারেন না।
          <br />
          এই ইবুকটি তৈরি করা হয়েছে reading psychology মাথায় রেখে,
          <br />
          যাতে পড়া সহজ এবং enjoyable হয়।
        </p>

        {/* Support */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          কোনো সমস্যা হলে WhatsApp-এ মেসেজ করুন: <span className="gold-text">01842-081088</span>
        </p>

        {/* Guarantee */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3">
          <Shield className="h-5 w-5 text-success" />
          <div className="text-sm">
            <p className="font-bold text-success">৭ দিনের মানি-ব্যাক গ্যারান্টি</p>
            <p className="text-muted-foreground text-xs">
              বইটি পড়ে যদি মনে হয় কোনো কাজে আসেনি, আমরা সম্পূর্ণ টাকা ফেরত দেব।
            </p>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {successOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full max-w-sm rounded-2xl border border-success/50 bg-success-card p-8 text-center"
            >
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success" />
              <p className="mb-4 text-lg font-bold text-foreground">
                অভিনন্দন! আপনার অর্ডার সফলভাবে জমা হয়েছে।
              </p>
              <div className="mb-4 rounded-lg bg-background/50 p-4 text-left text-sm space-y-1">
                <p><span className="text-muted-foreground">নাম:</span> {successOrder.name}</p>
                <p><span className="text-muted-foreground">প্রোডাক্ট:</span> Customer Psychology</p>
                <p><span className="text-muted-foreground">পেমেন্ট:</span> {PAYMENT_LABELS[successOrder.method].label}</p>
                <p><span className="text-muted-foreground">Transaction ID:</span> {successOrder.transactionId}</p>
              </div>
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                আমরা আপনার পেমেন্ট যাচাই করার পর
                <br />সর্বোচ্চ <span className="font-bold text-foreground">১২ ঘণ্টার</span> মধ্যে
                <br />আপনার ইমেইলে ডাউনলোড লিঙ্ক পাঠাবো।
              </p>
              <button
                onClick={() => navigate(`/thank-you?order=${successOrder.orderNumber}`)}
                className="gold-gradient w-full rounded-xl py-3 font-bold text-primary-foreground"
              >
                ঠিক আছে
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failure Toast */}
      <AnimatePresence>
        {failureMsg && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-4 top-4 z-50 w-full max-w-xs rounded-xl border border-destructive/50 bg-[hsl(0_30%_14%)] p-4"
          >
            <button
              onClick={() => setFailureMsg(null)}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mb-2 font-bold text-destructive">❌ আপনার পেমেন্টটি ব্যর্থ হয়েছে।</p>
            <p className="mb-2 text-xs text-muted-foreground">{failureMsg}</p>
            <p className="text-xs text-muted-foreground">
              আবার চেষ্টা করুন অথবা WhatsApp-এ যোগাযোগ করুন: 01842-081088
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
