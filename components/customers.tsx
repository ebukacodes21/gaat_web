"use client";

import React from "react";
import { motion } from "framer-motion";
import { CustomerCard } from "./customer-card";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const Customer = () => {
  return (
    <section className="w-full bg-white dark:bg-neutral-950 px-6 py-20 sm:px-12 lg:px-20 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Heading Module */}
        <div className="space-y-4 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-neutral-900 text-[11px] text-[#D61F28] font-semibold border border-red-100 dark:border-neutral-800">
            Target Ecosystems
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2C3237] dark:text-white sm:text-4xl">
            Our Target Customers
          </h2>
          <p className="text-xs sm:text-sm text-[#656F78] dark:text-neutral-400 leading-relaxed">
            Our capital allocation solutions are tailored across diverse sectors. We provide customized credit infrastructure for varied operational demands and specialized commercial profiles.
          </p>
        </div>

        {/* Clean Unified Layout Grid Matrix */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          <CustomerCard 
            title="Small Businesses" 
            description="Empowering retail entities and localized enterprises by offering bespoke liquidity channels to balance cash flow volatility, unlock immediate stock availability, and scale confidently." 
            src="/sme.jpg" 
          />
          <CustomerCard 
            title="Student Credit Solutions" 
            description="Flexible tuition facilities designed to clear institutional balances efficiently, decoupling academic progression from immediate capital roadblocks." 
            src="/student.jpg" 
          />
          <CustomerCard 
            title="FMCG Wholesalers" 
            description="High-velocity funding tailored for fast-moving consumer goods networks. Maintain continuous stock replenishment speeds and strengthen wholesale supply pipelines." 
            src="/fmcg.jpg" 
          />
          <CustomerCard 
            title="Agritech & Farmers" 
            description="Providing structured seasonal credit matrices to manage vital agricultural intake costs, acquire advanced field equipment, and navigate variable harvest cycles safely." 
            src="/farmers.jpg" 
          />
          <CustomerCard 
            title="POS Agency Operators" 
            description="Fueling liquidity processing lines for distributed agent networks. Maximize everyday floating capabilities, boost transactional volumes, and expand terminal footprint reach." 
            src="/pos.jpg" 
          />
        </motion.div>
        
      </div>
    </section>
  );
};