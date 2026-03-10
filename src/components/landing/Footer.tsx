export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-primary/20">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-brand font-bold text-primary text-sm tracking-widest uppercase">
          Zillbirds
        </span>
        <span className="text-muted-foreground text-sm font-inter">
          Customer Psychology © {new Date().getFullYear()}
        </span>
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Facebook</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">YouTube</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Instagram</a>
        </div>
      </div>
      <p className="text-center text-muted-foreground text-xs mt-4">সর্বস্বত্ব সংরক্ষিত</p>
    </footer>
  );
}
