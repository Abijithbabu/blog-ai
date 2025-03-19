import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-4" : "py-6"
      )}
    >
      <div className="mx-auto px-4 max-w-6xl">
        <div
          className={cn(
            "rounded-full px-6 py-3 flex items-center justify-between",
            "bg-black/40 backdrop-blur-md border border-white/10",
            isScrolled && "shadow-lg"
          )}
        >
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
            >
              BlogAI
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Testimonials
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
