import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen bg-background">
      <Header />
      {children}
      <footer className=" py-6">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} SayItBetter. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
}
