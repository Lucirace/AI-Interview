"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
export default function Header() {
  //used to make the avtive path li glow
  const path = usePathname();
  useEffect(() => {
    console.log(path); //returns /dashboard
  });
  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Link href={"./"}>
        <Image src={"/logo.svg"} width={80} height={70} alt="logo" />
      </Link>
      <ul className="hidden md:flex gap-6 ">
        <Link href={"/dashboard"}>
          <li
            //conditional styling
            className={`
            hover:text-primary hover:font-bold transition-all cursor-pointer ${
              path == "/dashboard" && "text-primary font-bold"
            }`}
          >
            Dashboard
          </li>
        </Link>
        {/*} <li
          className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/questions" && "text-primary font-bold"}
            `}
        >
          Questions
        </li> */}
        <Link href={"/dashboard/upgrade"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/upgrade" && "text-primary font-bold"}
            `}
          >
            Upgrade
          </li>
        </Link>
        {/*   <li
          className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/dashboard/how" && "text-primary font-bold"}
            `}
        >
          How it Works?
        </li>  */}
      </ul>
      <UserButton />
    </div>
  );
}
