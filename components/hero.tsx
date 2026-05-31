"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Zap, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants";
import { Calculator } from "./calculator";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 pt-32 pb-24 text-white">
      {/* Decorative Blur Underlays */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#D61F28]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center">
          
          {/* VALUE PROPOSITION AREA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-300">
              <span className="flex h-2 w-2 rounded-full bg-[#D61F28]" />
              Institutional Financial Infrastructure
            </div>

            <div className="space-y-4">
              <h1 className={`${font.className} text-4xl font-extrabold tracking-tight uppercase sm:text-5xl lg:text-6xl leading-[1.1]`}>
                Individual & Corporate <br />
                <span className="bg-gradient-to-r from-[#D61F28] via-[#ff4a53] to-amber-400 bg-clip-text text-transparent">
                  Business Loans
                </span>
              </h1>

              <p className="max-w-xl text-base font-medium leading-relaxed text-neutral-400 sm:text-lg">
                Empowering high-growth businesses and individual portfolios across Nigeria with robust, highly flexible funding structures designed to scale your operations instantly.
              </p>
            </div>

            {/* Interactive Call to Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="h-12 bg-[#D61F28] text-white font-semibold px-6 shadow-lg shadow-[#D61F28]/20 transition-all hover:bg-[#b81a22] hover:shadow-[#D61F28]/30"
                onClick={() => router.push(routes.LOANS)}
              >
                Apply Instantly
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-transparent text-white font-semibold px-6 hover:bg-white/5 hover:text-white"
                onClick={() => router.push(routes.ABOUT)}
              >
                Review Frameworks
              </Button>
            </div>

            {/* Embedded Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#D61F28]">
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-300">Fast-Track Approvals</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#D61F28]">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-300">Corporate Scale</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#D61F28]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-300">NDPR Compliant</span>
              </div>
            </div>
          </motion.div>

          {/* CALCULATOR INTERFACE INJECTION CONTAINER */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 w-full max-w-md mx-auto lg:mr-0"
          >
            <div className="relative group">
              {/* Glowing card container border effect */}
              <div className="absolute -inset-1 rounded-[21px] bg-gradient-to-r from-[#D61F28] to-indigo-600 opacity-20 blur-lg transition duration-1000 group-hover:opacity-30 group-hover:duration-200" />
              <div className="relative">
                <Calculator auth={false} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};