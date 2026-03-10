const features = [
  { icon: "📚", text: "Eye-comfort color combination" },
  { icon: "✏️", text: "Smart এবং clean design" },
  { icon: "📖", text: "ছোট ছোট readable section" },
  { icon: "💬", text: "সহজ ভাষা ও বাস্তব উদাহরণ" },
];

export default function ReadingExperience() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">একটি বাস্তব সত্য</h2>

        <p className="text-lg text-muted-foreground italic leading-relaxed max-w-2xl mx-auto mb-10">
          "সত্য কথা হলো — মানুষ ইবুক কিনলেও প্রায় ৯০%ই শেষ পর্যন্ত পড়ে শেষ করতে পারেন না।
          কারণ বেশিরভাগ ইবুক হয় লম্বা, বোরিং, তথ্যের গাদাগাদি এবং পড়তে অস্বস্তিকর।"
        </p>

        <div className="bg-card rounded-xl border border-primary/20 p-8 mb-10 text-left">
          <h3 className="text-primary font-bold text-xl mb-4">কিন্তু এই ইবুকটি একটু আলাদা</h3>
          <p className="text-foreground/90 leading-relaxed">
            আলহামদুলিল্লাহ, এই ইবুকটি তৈরি করা হয়েছে Reading Psychology মাথায় রেখে।
            যাতে পড়তে গিয়ে আপনি বোর না হন। বরং এমনভাবে সাজানো হয়েছে
            যে আপনি কখন পুরোটা শেষ করে ফেলবেন — বুঝতেই পারবেন না।
            <br />
            এই বইটি তৈরি করা হয়েছে, প্রায় দেড় বছর ধরে।
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto text-left mb-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 text-lg">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-foreground/90">{f.text}</span>
            </div>
          ))}
        </div>

        <p className="text-primary text-xl font-bold leading-relaxed">
          "ফলে এটি শুধু একটি ইবুক না —
          <br />
          একটি enjoyable reading experience।"
        </p>
      </div>
    </section>
  );
}
