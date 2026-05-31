"use client";

import React from "react";
import { motion } from "framer-motion";
import { WhyCard } from "./why-card";
import { GiAlarmClock, GiReceiveMoney } from "react-icons/gi";
import { FaBuilding, FaRegMoneyBillAlt } from "react-icons/fa";

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export const Why = () => {
  return (
    <section className="w-full bg-white dark:bg-neutral-950 px-6 py-24 sm:px-12 lg:px-20 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Creative Asymmetric Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-100 dark:border-neutral-900">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-neutral-900 text-[11px] text-[#D61F28] font-semibold border border-red-100 dark:border-neutral-800">
              The GAAT Advantage
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#2C3237] dark:text-white sm:text-4xl">
              Why GAAT Investment?
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[#656F78] dark:text-neutral-400 leading-relaxed">
            We operate beyond standard brokerage boundaries, deploying tailored liquid capital reserves with high accuracy and rapid processing turnarounds.
          </p>
        </div>

        {/* Asymmetric Bento Grid Matrix */}
        <motion.div 
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          {/* Feature 1: Flagship Item spanning 3 columns on desktop */}
          <WhyCard 
            logo={GiReceiveMoney} 
            title="Receive Up to ₦100m" 
            subtitle="High-Volume Liquidity Channels"
            description="Bespoke commercial capital mapping designed to back major inventory acquisitions, infrastructure expansions, or real estate opportunities seamlessly."
            className="md:col-span-3 min-h-[260px]"
            isPrimary={true}
          />

          {/* Feature 2: High efficiency speed item spanning 3 columns */}
          <WhyCard 
            logo={GiAlarmClock} 
            title="Apply Within Minutes" 
            subtitle="Decoupled Turnaround Blocks"
            description="Our fully digitized application pipeline cuts down processing delays, ensuring quick, friction-free turnaround times."
            className="md:col-span-3 min-h-[260px]"
          />

          {/* Feature 3: Flexibility item spanning 2 columns */}
          <WhyCard 
            logo={FaRegMoneyBillAlt} 
            title="Secure & Flexible Loans" 
            subtitle="Bespoke Term Matrices"
            description="Customized repayment plans designed to align smoothly with your business's cash flow cycles."
            className="md:col-span-2 min-h-[220px]"
          />

          {/* Feature 4: Corporate structure item spanning 4 columns */}
          <WhyCard 
            logo={FaBuilding} 
            title="Institutional Enterprise Solutions" 
            subtitle="Corporate Credit Architecture"
            description="Tailored financing plans built specifically for large-scale operations, supply chains, and multinational business structures."
            className="md:col-span-4 min-h-[220px]"
          />
        </motion.div>
        
      </div>
    </section>
  );
};