"use client";

import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "./feature-card";
import { FaUsers } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaBusinessTime, FaRegHandshake } from "react-icons/fa6";

// Staggered viewport orchestration container variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const Feature = () => {
  return (
    <section className="w-full bg-[#F9FAFB] dark:bg-neutral-950 px-6 py-16 sm:px-12 lg:px-20 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Contextual Header Group */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-neutral-900 text-[11px] text-[#D61F28] font-semibold border border-red-100 dark:border-neutral-800">
            Institutional Track Record
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C3237] dark:text-white">
            Empowering growth across emerging economic channels.
          </h2>
        </div>

        {/* Dynamic Matrix Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <FeatureCard
            logo={GiTakeMyMoney}
            title="₦100b+ Disbursed"
            description="Successfully structured capital routing deployment reaching retail and commercial targets with complete operational efficiency."
          />

          <FeatureCard
            logo={FaUsers}
            title="2.5k+ Customers"
            description="Unique profiles active across our decentralized ledger, leveraging highly flexible personal loan structures."
          />

          <FeatureCard
            logo={FaBusinessTime}
            title="2k+ Active SMEs"
            description="Nurturing small and medium-sized enterprises with tactical revolving lines of credit to sustain baseline velocity."
          />

          <FeatureCard
            logo={FaRegHandshake}
            title="1k+ Partnerships"
            description="Strategic alliances established with verified institutional stakeholders to optimize overall financial access pipelines."
          />
        </motion.div>
        
      </div>
    </section>
  );
};