"use client"

import { cn } from "@/lib/utils"
import { Compass, Home, Package, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MobileFooterNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Explore",
      href: "/products",
      icon: Compass,
    },
    {
      name: "Package",
      href: "/customize-package",
      icon: Package,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow">
      <nav className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={item.name}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
