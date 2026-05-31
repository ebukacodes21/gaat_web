"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { routes } from "@/constants";
import { ArrowRight, Home, GraduationCap, AlertCircle, Coins, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
} as const;

const elementVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 90, damping: 22 } 
  }
} as const;

const Individual = () => {
  const router = useRouter();

  const products = [
    {
      icon: Home,
      title: "Rent Loans",
      desc: "Secure your accommodation instantly and distribute annual payments into structured monthly blocks."
    },
    {
      icon: GraduationCap,
      title: "School Fees Loan",
      desc: "Fund tuition, materials, and local or international training certifications without interrupting educational tracks."
    },
    {
      icon: AlertCircle,
      title: "Emergency Loans",
      desc: "Immediate liquid reserves configured to handle unexpected medical, travel, or family costs."
    },
    {
      icon: Coins,
      title: "Salary Advance",
      desc: "Smooth out personal cash flow gaps between paydays with an advance on your earned salary."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-neutral-950">
      {/* 1. Global Navigation Layer (Unbound by content padding grids) */}
      <Navbar />

      {/* 2. Main Premium Canvas Viewport */}
      <main className="flex-grow w-full px-6 py-24 sm:px-12 lg:px-20 font-sans antialiased relative overflow-hidden">
        {/* Decorative architectural background mesh lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-red-500/[0.015] to-transparent rounded-full filter blur-3xl pointer-events-none" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10"
        >
          
          {/* Left Column: Vision Statement & Sticky Context Anchor */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <motion.div 
              variants={elementVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-neutral-900 text-[11px] text-[#D61F28] font-bold tracking-wide uppercase border border-red-100 dark:border-neutral-800"
            >
              Personal Finance
            </motion.div>
            
            <motion.h1 
              variants={elementVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C3237] dark:text-white leading-[1.15]"
            >
              Financial Capital That Works For <span className="text-[#D61F28]">Your Milestones</span>.
            </motion.h1>
            
            <motion.p 
              variants={elementVariants}
              className="text-[#656F78] dark:text-neutral-400 text-sm sm:text-base leading-relaxed font-normal"
            >
              At GAAT Investment Limited, we offer personal credit facilities structured with transparent, minimal documentation. No hidden fees or unexpected changes—just fast access to liquidity when it matters most.
            </motion.p>
          </div>

          {/* Right Column: Dynamic Feature Grid & Shadcn Accordion Deck */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Product Metric Selection Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {products.map((product, idx) => {
                const IconComponent = product.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={elementVariants}
                    className="p-6 rounded-[20px] bg-[#F9FAFB] dark:bg-neutral-900/30 border border-[#E5E7EB] dark:border-neutral-900 group hover:border-[#D61F28]/20 dark:hover:border-[#D61F28]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 text-[#D61F28] border border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <h3 className="text-base font-bold text-[#2C3237] dark:text-white tracking-tight mt-5 group-hover:text-[#D61F28] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed mt-2 font-normal">
                      {product.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* INTEGRATION: Premium Shadcn UI Accordion Section for Product Detail Queries */}
            <motion.div variants={elementVariants} className="space-y-6 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-900">
                <HelpCircle className="w-4 h-4 text-[#D61F28]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Facility Guidelines & Terms
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-neutral-200 dark:border-neutral-900">
                  <AccordionTrigger className="text-sm font-semibold text-[#2C3237] dark:text-neutral-200 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors">
                    What are the core requirements to apply?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                    Applicants must provide verified proof of income or valid employment status, recent bank statements showing active cash flows, and a valid national means of identification.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-neutral-200 dark:border-neutral-900">
                  <AccordionTrigger className="text-sm font-semibold text-[#2C3237] dark:text-neutral-200 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors">
                    How fast is the turnaround and disbursement window?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                    Once verification parameters clear, approved files move directly to disbursement inside your linked workspace database wallet profile within 24 to 48 operational banking hours.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-neutral-200 dark:border-neutral-900">
                  <AccordionTrigger className="text-sm font-semibold text-[#2C3237] dark:text-neutral-200 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors">
                    Are there any hidden fees or structural termination pricing?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                    No. GAAT operates under full transparency metrics. All calculated interest metrics, processing guidelines, and scheduling tracks are locked down clearly within your signed digital offer contract before execution.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Conversion Action Banner */}
            <motion.div 
              variants={elementVariants}
              className="p-6 sm:p-8 rounded-[24px] bg-[#F9FAFB] dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-[#D61F28]/20 transition-all duration-300"
            >
              <div className="space-y-1 max-w-md">
                <h4 className="text-sm font-bold text-[#2C3237] dark:text-white tracking-tight">
                  Need urgent access to personal liquidity?
                </h4>
                <p className="text-xs text-[#656F78] dark:text-neutral-400">
                  Register your account profile in minutes to run a zero-commitment check on available loan terms.
                </p>
              </div>
              
              <button 
                onClick={() => router.push(routes.SIGNUP)}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D61F28] hover:bg-[#b91b20] text-white text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer group/btn"
              >
                Apply in Minutes
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </motion.div>
          </div>

        </motion.div>
      </main>

      {/* 3. Global Footer Layer (Spans 100% device width naturally) */}
      <Footer />
    </div>
  );
};

export default Individual;