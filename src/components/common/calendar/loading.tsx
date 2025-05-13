/** @format */

"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <motion.div
        className="bg-white/90 p-3 rounded-full shadow-lg border-2 border-[#046200]"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}>
        <Image
          src="/logo.png"
          alt="Loading"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </motion.div>
    </div>
  );
}
