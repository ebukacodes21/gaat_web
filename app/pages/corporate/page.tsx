"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { routes } from "@/constants";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
} as const;

const elementVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 20 } 
  }
} as const;

const Corporate = () => {
  const router = useRouter();

  const advantages = [
    {
      title: "Rapid Liquidity Turnaround",
      desc: "Streamlined processing engine designed for quick disbursement to meet time-sensitive operational needs."
    },
    {
      title: "Optimized Rate Structures",
      desc: "Competitive, predictable interest parameters tailored to protect your working capital margins."
    },
    {
      title: "Strategic Capital Allocation",
      desc: "Perfectly structured for project execution, large-scale supply chain fulfillment, and scaling up inventory arrays."
    },
    {
      title: "Institutional Heritage",
      desc: "Backed by decades of deep market expertise, helping businesses navigate shifting economic cycles since 1995."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-neutral-950">
      {/* 1. Global Navigation Layer */}
      <Navbar />

      {/* 2. Main Premium Corporate Viewport Canvas */}
      <main className="flex-grow w-full px-6 py-24 sm:px-12 lg:px-20 font-sans antialiased relative overflow-hidden">
        {/* Structural background architecture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-red-500/[0.02] to-transparent rounded-full filter blur-3xl pointer-events-none" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10"
        >
          
          {/* Left Column: Core Positioning Copy */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <motion.div 
              variants={elementVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-neutral-900 text-[11px] text-[#D61F28] font-bold tracking-wide uppercase border border-red-100 dark:border-neutral-800"
            >
              Institutional Credit
            </motion.div>
            
            <motion.h1 
              variants={elementVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2C3237] dark:text-white leading-[1.15]"
            >
              Empowering Nigeria’s Enterprise with <span className="text-[#D61F28]">Flexible Credit</span>.
            </motion.h1>
            
            <motion.p 
              variants={elementVariants}
              className="text-[#656F78] dark:text-neutral-400 text-sm sm:text-base leading-relaxed font-normal"
            >
              At GAAT Investment Limited, we recognize that reliable financing is critical to scaling modern operations. Our corporate facilities are structured to back traders, high-growth SMEs, contractors, and corporate operators with agile capital.
            </motion.p>
          </div>

          {/* Right Column: Modern Advantage Feature Grid & Accordion Protocol */}
          <div className="lg:col-span-7 space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {advantages.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={elementVariants}
                  className="p-5 rounded-2xl bg-[#F9FAFB] dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-900/80 group hover:border-neutral-300 dark:hover:border-neutral-800 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#D61F28]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-[#2C3237] dark:text-white tracking-tight group-hover:text-[#D61F28] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* INTEGRATION: Premium Shadcn UI Accordion Section for Commercial Underwriting Details */}
            <motion.div variants={elementVariants} className="space-y-6 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-900">
                <ShieldCheck className="w-4 h-4 text-[#D61F28]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Commercial Lending Framework
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-neutral-200 dark:border-neutral-900">
                  <AccordionTrigger className="text-sm font-semibold text-[#2C3237] dark:text-neutral-200 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors">
                    What corporate profiles are eligible for financing?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                    We cover registered corporate entities with active Corporate Affairs Commission records, including verified commercial contractors, structured retail traders, supply chain managers, and established enterprise operations across major industrial fields.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-neutral-200 dark:border-neutral-900">
                  <AccordionTrigger className="text-sm font-semibold text-[#2C3237] dark:text-neutral-200 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors">
                    Can we use verified contract purchase orders as facility support?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                    Yes. GAAT specializes in contract financing and purchase order (PO) funding paths. Our credit desk runs precise checks on the executing vendor parameters to accelerate financing lines for public or private execution workflows.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-neutral-200 dark:border-neutral-900">
                  <AccordionTrigger className="text-sm font-semibold text-[#2C3237] dark:text-neutral-200 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors">
                    What are the maximum capital volume ceilings for enterprises?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
                    Facility maximum bounds are variable, structured directly upon your commercial statement volume metrics, cash flow health evaluation thresholds, and security parameters. Fill out your details inside our corporate account panel to get an immediate customized credit check.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            {/* Inline Conversion Callout Module */}
            <motion.div 
              variants={elementVariants}
              className="p-6 sm:p-8 rounded-[24px] bg-neutral-950 text-white relative overflow-hidden shadow-xl"
            >
              {/* Subtle background element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D61F28]/10 rounded-full filter blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1 max-w-md">
                  <h4 className="text-base font-bold tracking-tight">
                    Ready to optimize your corporate cash flow?
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Open a secure commercial account workspace online to access customized lending structures.
                  </p>
                </div>
                
                <button 
                  onClick={() => router.push(routes.SIGNUP)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D61F28] hover:bg-[#b91b20] text-white text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer group/btn"
                >
                  Register Corporate Account
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* 3. Global Full-Width Footer Layer */}
      <Footer />
    </div>
  );
};

export default Corporate;