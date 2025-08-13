"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import clsx from "clsx"

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const theme = localStorage.getItem("theme")
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={clsx(
        "p-2 rounded-md border border-muted hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
    </button>
  )
}
