"use client";

import React, { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type CustomerCardProp = {
  src: string;
  title: string;
  description?: string;
};

// Declaring layout entrance variants strictly as immutable constants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 18 }
  }
} as const;

export const CustomerCard: FC<CustomerCardProp> = ({ src, title, description }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="flex flex-col bg-[#F9FAFB] dark:bg-neutral-900/40 rounded-[16px] border border-[#E5E7EB] dark:border-neutral-800/80 overflow-hidden w-full max-w-sm group hover:border-[#D61F28]/20 transition-all duration-300 hover:shadow-lg"
    >
      {/* Aspect ratio frame handles portrait scaling beautifully across mobile up to desktop grids */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-w-768px) 100vw, 384px"
          priority={false}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Structured Text Metadata Area */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <h3 className="text-md font-semibold tracking-tight text-[#2C3237] dark:text-white transition-colors group-hover:text-[#D61F28]">
            {title}
          </h3>
          <p className="text-[#656F78] dark:text-neutral-400 text-xs leading-relaxed mt-2 font-normal">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};