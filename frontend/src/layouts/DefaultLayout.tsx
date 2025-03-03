import { Navbar } from "@/components/navbar/NavBar";
import RootLayout from "./RootLayout";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayout>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
          {children}
        </main>
        {/* Footer */}
      </div>
    </RootLayout>
  );
}
