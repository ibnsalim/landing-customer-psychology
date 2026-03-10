import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_html: string;
  cover_image: string | null;
  published_at: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [sidebar, setSidebar] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
      const [postRes, sidebarRes] = await Promise.all([
        supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single(),
        supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(4),
      ]);
      setPost(postRes.data);
      setSidebar(sidebarRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-xl text-foreground">পোস্টটি পাওয়া যায়নি</p>
        <button onClick={() => navigate("/")} className="gold-text underline">হোম পেজে ফিরুন</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <article className="flex-1 lg:w-[65%]">
            <div className="mb-6 h-1 w-20 gold-gradient rounded-full" />
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="mb-6 w-full rounded-2xl object-cover"
                loading="lazy"
              />
            )}
            <h1 className="mb-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {post.title}
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {format(new Date(post.published_at), "d MMMM, yyyy", { locale: bn })}
            </p>
            <div
              className="prose prose-invert max-w-none text-foreground leading-relaxed [&_h3]:gold-text [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ol]:space-y-2 [&_li]:text-foreground [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.body_html }}
            />

            {/* CTA Card */}
            <div className="mt-10 card-dark p-6 text-center">
              <p className="mb-4 text-lg font-bold text-foreground">
                এই বইটি আপনার জন্যই লেখা হয়েছে।
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="gold-gradient rounded-xl px-8 py-3 font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                এখনই অর্ডার করুন — ৳২৭৯
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[35%]">
            <div className="lg:sticky lg:top-20">
              <h2 className="mb-4 text-lg font-bold gold-text">আরও পড়ুন</h2>
              <div className="space-y-4">
                {sidebar
                  .filter((s) => s.slug !== slug)
                  .slice(0, 4)
                  .map((item) => (
                    <Link
                      key={item.id}
                      to={`/blog/${item.slug}`}
                      className="flex gap-3 rounded-xl bg-card p-3 transition-colors hover:bg-secondary"
                    >
                      {item.cover_image ? (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
                          📖
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(item.published_at), "d MMMM, yyyy", { locale: bn })}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
