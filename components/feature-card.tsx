"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

type FeatureCardProp = {
  logo: IconType;
  title: string;
  description?: string;
  subtitle?: string;
};

// Clean fade up/in structural entry keyframes
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
} as const;

export const FeatureCard: FC<FeatureCardProp> = ({ logo: Logo, title, description }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="flex flex-col justify-between bg-white dark:bg-neutral-900/50 p-6 rounded-[12px] border border-[#E5E7EB] dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group hover:border-[#D61F28]/30"
    >
      <div>
        {/* Icon wrapper styling matching the app context */}
        <div className="w-10 h-10 mb-5 bg-red-50 dark:bg-neutral-900 rounded-[8px] flex items-center justify-center text-[#D61F28] group-hover:scale-110 transition-transform duration-300">
          <Logo className="w-5 h-5" />
        </div>
        
        <h3 className="text-lg font-semibold tracking-tight text-[#2C3237] dark:text-white mb-2">
          {title}
        </h3>
      </div>
      
      {description && (
        <p className="text-[#656F78] dark:text-neutral-400 text-xs leading-relaxed mt-1">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export const WhyCard: FC<FeatureCardProp> = ({ logo: Logo, title, subtitle }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="flex items-center gap-4 bg-white dark:bg-neutral-900/50 p-5 rounded-[12px] border border-[#E5E7EB] dark:border-neutral-800 shadow-sm group hover:border-[#D61F28]/30 transition-all"
    >
      <div className="w-10 h-10 shrink-0 bg-red-50 dark:bg-neutral-900 rounded-[8px] flex items-center justify-center text-[#D61F28]">
        <Logo className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-[#2C3237] dark:text-white">
        {title}
      </h3>
    </motion.div>
  );
};