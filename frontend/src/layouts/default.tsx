import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0A0500] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Radial Glow Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            width: "1200px",
            height: "1200px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 153, 0, 0.15) 0%, rgba(255, 153, 0, 0) 70%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-[500px]"
          style={{
            background: "linear-gradient(180deg, rgba(255, 153, 0, 0.05) 0%, rgba(10, 5, 0, 0) 100%)",
          }}
        />
      </div>

      <Navbar />
      
      <main className="relative z-10 flex-1 w-full mt-24 px-6 lg:px-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="mx-auto max-w-5xl w-full py-12"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
