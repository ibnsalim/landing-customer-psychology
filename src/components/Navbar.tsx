import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleCTAClick = () => {
    if (isHome) {
      const el = document.getElementById("checkout-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.location.href = "/checkout";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/15">
      <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="font-brand font-bold text-primary text-sm tracking-widest uppercase">
          Zillbirds
        </Link>

        <Link
          to="/blog/is-this-book-for-you"
          className="hidden md:inline-flex items-center border border-primary/40 text-primary rounded-full px-4 py-1.5 text-sm hover:bg-primary/10 transition-colors"
        >
          আপনার জন্যই কি এই বইটি? জেনে অর্ডার করুন
        </Link>

        <button
          onClick={handleCTAClick}
          className="bg-primary text-primary-foreground font-bold text-sm px-5 py-2 rounded-lg hover:brightness-110 transition-all"
        >
          বইটি ডাউনলোড করুন
        </button>
      </div>
    </nav>
  );
}
