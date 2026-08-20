"use client";

import dynamic from "next/dynamic";

const SpaRoot = dynamic(() => import("../spa-root"), { ssr: false });

export default function Page() {
  return <SpaRoot />;
}
