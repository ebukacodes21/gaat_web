"use client";

import { routes } from "@/constants";
import Link from "next/link";
import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const font = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const Footer = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-[#F9FAFB] dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 font-sans antialiased"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-12 lg:px-20">
        
        {/* Main Links & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200 dark:border-neutral-900">
          
          {/* Brand/Identity Block */}
          <div className="md:col-span-5 space-y-4">
            <p className="text-xl font-bold tracking-tight text-[#2C3237] dark:text-white">
              GAAT INVESTMENT <span className="text-[#D61F28]">LIMITED</span>
            </p>
            <p className="text-xs text-[#656F78] dark:text-neutral-400 max-w-sm leading-relaxed">
              Providing flexible liquidity channels and strategic investment credit infrastructure across commercial targets in Nigeria.
            </p>
          </div>

          {/* Navigation Column 1: Company */}
          <div className="md:col-span-2 space-y-4">
            <h2 className={cn("text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500", font.className)}>
              Company
            </h2>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={routes.ABOUT}
                  className="text-xs text-[#656F78] dark:text-neutral-400 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors"
                >
                  About GAAT Investment
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Business */}
          <div className="md:col-span-2 space-y-4">
            <h2 className={cn("text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500", font.className)}>
              Business Channels
            </h2>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={routes.INDIVIDUAL}
                  className="text-xs text-[#656F78] dark:text-neutral-400 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors"
                >
                  Individual Facilities
                </Link>
              </li>
              <li>
                <Link
                  href={routes.CORPORATE}
                  className="text-xs text-[#656F78] dark:text-neutral-400 hover:text-[#D61F28] dark:hover:text-[#D61F28] transition-colors"
                >
                  Corporate Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Contact/Support */}
          <div className="md:col-span-3 space-y-4">
            <h2 className={cn("text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500", font.className)}>
              Contact Operations
            </h2>
            <p className="text-xs text-[#656F78] dark:text-neutral-400 leading-relaxed">
              Blk 2, Flat 2, Kagoro close, Area 2, Garki, Abuja, Nigeria.
            </p>
            
            <ul className="space-y-2 pt-2">
              <li className="text-xs text-[#2C3237] dark:text-neutral-300 flex items-center gap-2">
                <FaPhoneAlt className="text-[#D61F28] text-xs shrink-0" />
                +234 811 552 4969
              </li>
              <li className="text-xs flex items-center gap-2">
                <FaEnvelope className="text-[#D61F28] text-xs shrink-0" />
                <Link
                  href="mailto:info@gaatinvestment.com"
                  className="text-[#656F78] dark:text-neutral-400 hover:text-[#D61F28] hover:underline transition-all"
                >
                  info@gaatinvestment.com
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory Footer & Social Matrix */}
        <div className="pt-8 flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Legal Compliance Block */}
          <div className="max-w-3xl">
            <p className="text-[11px] text-[#656F78] dark:text-neutral-500 leading-relaxed">
              © {new Date().getFullYear()} GAAT Investment Limited. All rights reserved. GAAT Investment Limited is registered with the Corporate Affairs Commission of Nigeria under Company Number <span className="font-semibold text-neutral-700 dark:text-neutral-400">RC: 271488</span> and operates as a private enterprise incorporated under the Companies and Allied Matters Act (CAMA 2020).
            </p>
          </div>

          {/* Harmonized Minimalist Social Badges */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-[#D61F28] hover:border-[#D61F28]/30 dark:hover:border-[#D61F28]/30 transition-all shadow-sm"
            >
              <FaFacebookF className="text-xs" />
            </Link>

            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-[#D61F28] hover:border-[#D61F28]/30 dark:hover:border-[#D61F28]/30 transition-all shadow-sm"
            >
              <FaTwitter className="text-xs" />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-[#D61F28] hover:border-[#D61F28]/30 dark:hover:border-[#D61F28]/30 transition-all shadow-sm"
            >
              <FaInstagram className="text-xs" />
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-[#D61F28] hover:border-[#D61F28]/30 dark:hover:border-[#D61F28]/30 transition-all shadow-sm"
            >
              <FaLinkedinIn className="text-xs" />
            </Link>
          </div>

        </div>

      </div>
    </motion.section>
  );
};