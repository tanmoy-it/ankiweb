"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  props?: Record<string, unknown>
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}