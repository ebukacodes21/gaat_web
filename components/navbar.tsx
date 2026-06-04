
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

import { routes } from "@/constants";
import LinkItem from "./link_item";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b-4 border-[#FFCD41] bg-[#D61F28]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2">
        {/* Logo */}
        <Link href={routes.HOME}>
          <h1 className="text-2xl font-bold text-gray-100 md:text-3xl">
            GAAT Investment
          </h1>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="text-gray-100 lg:hidden"
        >
          {isOpen ? <MdClose size={26} /> : <GiHamburgerMenu size={26} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8">
            <LinkItem
              name="Company"
              subItems={[
                {
                  name: "About GAAT",
                  link: routes.ABOUT,
                },
              ]}
            />

            <LinkItem
              name="Business"
              subItems={[
                {
                  name: "Corporate",
                  link: routes.CORPORATE,
                },
                {
                  name: "Individual",
                  link: routes.INDIVIDUAL,
                },
              ]}
            />
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="border-t border-red-400 bg-[#D61F28] px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            <LinkItem
              name="Company"
              subItems={[
                {
                  name: "About GAAT",
                  link: routes.ABOUT,
                },
              ]}
            />

            <LinkItem
              name="Business"
              subItems={[
                {
                  name: "Corporate",
                  link: routes.CORPORATE,
                },
                {
                  name: "Individual",
                  link: routes.INDIVIDUAL,
                },
              ]}
            />
          </ul>
        </nav>
      )}
    </header>
  );
};
