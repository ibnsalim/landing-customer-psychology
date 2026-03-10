import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
}

const placeholderPages = [
  "পূর্বরূপ পৃষ্ঠা ১ — ভূমিকা",
  "পূর্বরূপ পৃষ্ঠা ২ — কেন এই বই?",
  "পূর্বরূপ পৃষ্ঠা ৩ — কাস্টমার কে?",
  "পূর্বরূপ পৃষ্ঠা ৪ — সিদ্ধান্ত গ্রহণ",
  "পূর্বরূপ পৃষ্ঠা ৫ — কেস স্টাডি",
];

export default function PreviewModal({ open, onClose }: PreviewModalProps) {
  const [page, setPage] = useState(0);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-xl max-w-2xl w-full mx-4 p-8 border border-primary/20 animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-[3/4] bg-background rounded-lg flex items-center justify-center text-muted-foreground text-lg mb-6">
          {placeholderPages[page]}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg bg-card border border-primary/20 text-foreground disabled:opacity-30 hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-muted-foreground text-sm font-inter">
            {page + 1} / {placeholderPages.length}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(placeholderPages.length - 1, p + 1))}
            disabled={page === placeholderPages.length - 1}
            className="p-2 rounded-lg bg-card border border-primary/20 text-foreground disabled:opacity-30 hover:bg-primary/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
