"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { queryClient } from "@/lib/queryClient";
import { GlobalStyles } from "@/styles/globalStyles";
import { ThemeProvider } from "@/styles/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
