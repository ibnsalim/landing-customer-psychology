export default function SolutionSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-section-alt to-background">
      <div className="container max-w-4xl mx-auto text-center">
        <span className="inline-block border border-primary/40 text-primary text-sm px-4 py-1 rounded-full mb-6">
          নতুন দৃষ্টিভঙ্গি
        </span>

        <h2 className="text-3xl md:text-4xl font-bold mb-12 leading-tight">
          কাস্টমার চিনতে পারা একটা দক্ষতা।
          <br />
          এই <span className="text-primary">দক্ষতাটা</span> শিখতে হয়।
        </h2>

        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <div className="text-muted-foreground text-lg leading-relaxed line-through decoration-muted-foreground/30">
            "বেশিরভাগ মার্কেটিং কোর্স শেখায় কীভাবে বেশি মানুষের কাছে পৌঁছানো যায়।"
          </div>
          <div className="text-primary text-lg leading-relaxed font-semibold">
            "কিন্তু এই বইটা শেখায় — কীভাবে সেই একজন মানুষকে চেনা যায় যে আপনার প্রোডাক্টটা সত্যিই চায়।"
          </div>
        </div>

        <p className="text-xl font-bold text-foreground max-w-2xl mx-auto leading-relaxed">
          পার্থক্যটা বুঝলে আপনার পুরো ব্যবসার approach বদলে যাবে।
          <br />
          <span className="text-primary">এবং এই পার্থক্যটাই এই বইয়ে আছে।</span>
        </p>
      </div>
    </section>
  );
}
