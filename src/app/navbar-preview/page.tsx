import Navbar from "@/components/Navbar";

export default function NavbarPreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl p-6 text-foreground">
        Navbar preview — temporary route, safe to delete.
      </main>
    </div>
  );
}
