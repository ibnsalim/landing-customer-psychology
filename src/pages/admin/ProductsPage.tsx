import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  created_at: string;
}

export default function ProductsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: 0, original_price: 0, slug: "" });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").limit(1).single();
    if (data) {
      setProduct(data);
      setForm({
        name: data.name,
        description: data.description || "",
        price: data.price,
        original_price: data.original_price || 0,
        slug: data.slug,
      });
    }
    if (error) console.error(error);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!product) return;
    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        description: form.description || null,
        price: form.price,
        original_price: form.original_price || null,
        slug: form.slug,
      })
      .eq("id", product.id);

    if (error) {
      toast.error("Failed to update product");
      return;
    }
    toast.success("Product updated successfully");
    setEditing(false);
    fetchProduct();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
        <div className="h-64 rounded-xl animate-pulse" style={{ backgroundColor: "#1E1E2E" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="mx-auto mb-4" style={{ color: "#9999B0" }} />
        <p style={{ color: "#9999B0" }}>No product found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "#F9F6F2" }}>Products</h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "rgba(201,169,110,0.12)", color: "#C9A96E", border: "1px solid #C9A96E" }}
          >
            <Edit size={16} /> Edit Product
          </button>
        )}
      </div>

      <div className="rounded-xl border p-6" style={{ backgroundColor: "#1E1E2E", borderColor: "#2A2A3A" }}>
        {editing ? (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9999B0" }}>Product Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9999B0" }}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono"
                style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#9999B0" }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2", fontFamily: "'Noto Sans Bengali', sans-serif" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9999B0" }}>Original Price (৳)</label>
                <input
                  type="number"
                  value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#9999B0" }}>Offer Price (৳)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "#16161F", border: "1px solid #2A2A3A", color: "#F9F6F2" }}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#C9A96E", color: "#16161F" }}
              >
                <Save size={16} /> Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#2A2A3A", color: "#9999B0" }}
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-40 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#16161F" }}>
              <Package size={40} style={{ color: "#C9A96E" }} />
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-bold" style={{ color: "#F9F6F2" }}>{product.name}</h2>
              <p className="text-sm font-mono" style={{ color: "#9999B0" }}>/{product.slug}</p>
              {product.description && (
                <p className="text-sm" style={{ color: "#9999B0", fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  {product.description}
                </p>
              )}
              <div className="flex items-baseline gap-3 pt-2">
                {product.original_price && (
                  <span className="text-lg line-through" style={{ color: "#9999B0" }}>
                    ৳{product.original_price.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-bold" style={{ color: "#C9A96E" }}>
                  ৳{product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
