const painCards = [
  {
    emoji: "😰",
    title: "সবাই দাম জিজ্ঞেস করে, কেউ কেনে না",
    body: "আপনার inbox ভরা 'দাম কত?' কিন্তু কেউ কেনে না, কারণ এরা আপনার কাস্টমার-ই নয়। আর আপনি সেটা বুঝতে পারছেন না। কাস্টমার খুঁজতে নয়, চিনতে হয়।",
  },
  {
    emoji: "😤",
    title: "ডিসকাউন্ট দিলেও বিক্রি হয় না",
    body: "দাম কমালেন। অফার দিলেন। তবুও একই ফল। কারণ সমস্যা দামে না — সমস্যা হলো আপনি wrong audience-কে target করছেন।",
  },
  {
    emoji: "😞",
    title: "প্রতিযোগী কম দামে বেচছে, আপনি পারছেন না",
    body: "আশেপাশের সবাই কম দামে দিচ্ছে। আপনিও দিলে লাভ থাকে না। কিন্তু সঠিক কাস্টমার দাম নিয়ে bargain করে না — value নিয়ে ভাবে।",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block border border-primary/40 text-primary text-sm px-4 py-1 rounded-full mb-6">
            আসল সমস্যাটা কোথায়?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            আপনার ব্যর্থতা নয়—
            <br />
            আপনি শুধু <span className="text-primary">ভুল দরজায়</span> কড়া নাড়ছেন।
          </h2>
        </div>

        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            প্রতিদিন আপনি অ্যাডে টাকা ঢালছেন। কনটেন্ট বানাচ্ছেন। পোস্ট করছেন। তবুও সেলস নেই।
            <br /><br />
            কারণটা কী জানেন? কারণ আপনি প্রোডাক্ট নিয়ে কথা বলছেন — কাস্টমারের মন নিয়ে নয়।
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {painCards.map((card, i) => (
            <div key={i} className="bg-card rounded-xl border border-primary/20 p-6 space-y-3">
              <span className="text-3xl">{card.emoji}</span>
              <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-primary text-xl italic max-w-2xl mx-auto leading-relaxed">
          "এই সমস্যার সমাধান আরো বেশি মার্কেটিং না। সমাধান হলো — সঠিক মানুষটাকে চেনা এবং সেই অনুযায়ী স্ট্র্যাটেজি সাজানো।"
        </p>
      </div>
    </section>
  );
}
