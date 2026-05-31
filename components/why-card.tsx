"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

type WhyCardProps = {
  logo: IconType;
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  isPrimary?: boolean;
};

const cardEntranceKeyframes = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 22 }
  }
} as const;

export const WhyCard: FC<WhyCardProps> = ({ 
  logo: Logo, 
  title, 
  subtitle, 
  description, 
  className = "", 
  isPrimary = false 
}) => {
  return (
    <motion.div
      variants={cardEntranceKeyframes}
      className={`
        flex flex-col justify-between p-8 rounded-[20px] border transition-all duration-300 group relative overflow-hidden
        ${isPrimary 
          ? "bg-gradient-to-br from-neutral-50 to-neutral-100/30 dark:from-neutral-900/40 dark:to-neutral-950 border-[#D61F28]/20 hover:border-[#D61F28]/40 shadow-sm" 
          : "bg-[#F9FAFB] dark:bg-neutral-900/30 border-[#E5E7EB] dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800"
        }
        ${className}
      `}
    >
      {/* Decorative accent for the primary flagship item */}
      {isPrimary && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D61F28]/5 to-transparent rounded-bl-full pointer-events-none" />
      )}

      <div>
        {/* Dynamic Icon Badge Box */}
        <div className={`
          w-12 h-12 mb-6 rounded-[12px] flex items-center justify-center transition-all duration-300 group-hover:scale-105
          ${isPrimary 
            ? "bg-[#D61F28] text-white shadow-md shadow-red-500/10" 
            : "bg-white dark:bg-neutral-900 text-[#D61F28] border border-neutral-200/60 dark:border-neutral-800"
          }
        `}>
          <Logo className="w-5 h-5" />
        </div>

        {/* Text Area */}
        <div className="space-y-1">
          {subtitle && (
            <span className="text-[10px] tracking-wider uppercase font-bold text-[#656F78] dark:text-neutral-500">
              {subtitle}
            </span>
          )}
          <h3 className="text-xl font-bold tracking-tight text-[#2C3237] dark:text-white transition-colors group-hover:text-[#D61F28]">
            {title}
          </h3>
        </div>
      </div>

      {description && (
        <p className="text-[#656F78] dark:text-neutral-400 text-xs leading-relaxed mt-6 font-normal">
          {description}
        </p>
      )}
    </motion.div>
  );
};