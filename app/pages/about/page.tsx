"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { routes } from "@/constants";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
} as const;

const elementVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 20 } 
  }
} as const;

const About = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-neutral-950">
      {/* 1. Global Navigation Layer */}
      <Navbar />

      {/* 2. Main Executive Content Block */}
      <main className="flex-grow w-full px-6 py-32 sm:px-12 lg:px-20 font-sans antialiased relative overflow-hidden">
        {/* Architectural background grid accents */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10"
        >
          
          {/* Left Column: Vision Statement & Badging */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              variants={elementVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-neutral-900 text-[11px] text-[#D61F28] font-bold tracking-wide uppercase border border-red-100 dark:border-neutral-800"
            >
              Corporate Profile
            </motion.div>
            
            <motion.h1 
              variants={elementVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C3237] dark:text-white leading-[1.15]"
            >
              Becoming Nigeria’s Premier <span className="text-[#D61F28]">Capital Route</span> Provider.
            </motion.h1>
            
            <motion.div 
              variants={elementVariants}
              className="h-1 w-16 bg-[#D61F28] rounded-full hidden lg:block"
            />
          </div>

          {/* Right Column: Narrative & Contextual Call-To-Action */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div variants={elementVariants} className="space-y-6">
              <p className="text-[#656F78] dark:text-neutral-400 text-sm sm:text-base leading-relaxed font-normal">
                GAAT Investment Limited was incorporated in 1995 with the Corporate Affairs Commission as an investment firm. Our journey began in Lagos as a small three-man outfit. Today, we are proud to be a first-class financial service provider. GIL offers financial support to traders, contractors, civil servants, private sector operators, and more.
              </p>
              <p className="text-[#2C3237] dark:text-neutral-200 text-sm sm:text-base font-medium leading-relaxed border-l-2 border-[#D61F28] pl-4">
                We understand that liquidity is the lifeblood of every business — that’s why we provide quick and flexible financing solutions to keep your business running smoothly.
              </p>
            </motion.div>

            {/* Premium Embedded Action Banner */}
            <motion.div 
              variants={elementVariants}
              className="p-6 sm:p-8 rounded-[20px] bg-[#F9FAFB] dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-[#D61F28]/20 transition-all duration-300"
            >
              <div className="space-y-1 max-w-md">
                <h4 className="text-sm font-bold text-[#2C3237] dark:text-white tracking-tight">
                  Ready to accelerate your project financing?
                </h4>
                <p className="text-xs text-[#656F78] dark:text-neutral-400">
                  Setup a secure workspace account instantly to unlock credit routing options.
                </p>
              </div>
              
              <button 
                onClick={() => router.push(routes.SIGNUP)}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D61F28] hover:bg-[#b91b20] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer group/btn"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>
          </div>

        </motion.div>
      </main>

      {/* 3. Full-Width Global Footer Layer */}
      <Footer />
    </div>
  );
};

export default About;