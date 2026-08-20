"use client";

import { NuqsAdapter } from "nuqs/adapters/react";
import App from "@/App";
import { Toaster } from "sonner";
import QueryProvider from "@/context/query-provider";

export default function SpaRoot() {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}
