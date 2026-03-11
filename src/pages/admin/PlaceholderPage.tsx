import { useLocation } from "react-router-dom";

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const name = pathname.split("/").pop() || "Page";

  return (
    <div>
      <h1 className="text-2xl font-bold capitalize" style={{ color: "#F9F6F2" }}>{name}</h1>
      <p className="mt-2 text-sm" style={{ color: "#9999B0" }}>This section will be built in a future phase.</p>
    </div>
  );
}
