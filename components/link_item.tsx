import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { FC } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

type LinkItemProp = {
  name: string;
  subItems: { name: string; link: string }[];
};

const LinkItem: FC<LinkItemProp> = ({ name, subItems }) => {
  return (
    <li className="relative group md:px-3 py-2 cursor-pointer">
      <button
        className={`hover:opacity-50 relative flex items-center text-white`}
      >
        {name}
        <IoMdArrowDropdown
          className={`hidden lg:block ml-2 w-4 h-4 transition duration-300 ease-in-out group-hover:rotate-180 group-hover:text-gray-400`}
        />
      </button>
      <div className="absolute top-0 md:-left-2 transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 md:min-w-[400px] min-w-[330px] lg:min-w-[200px] transform">
        <div className="relative top-6 p-6 bg-white rounded-sm shadow-xl w-full border border-gray-100">
          <div className="relative z-10">
            <ul className="text-[15px] space-y-2">
              {subItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className={cn(
                      "text-black hover:text-[#D61F28] hover:underline py-1 font-medium cursor-pointer"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};

export default LinkItem;
