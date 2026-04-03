"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "@/theme/ThemeRegistry";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Estimate", href: "/estimate" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { mode, toggleColorMode } = useColorMode();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 h-16 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            convertYourSite
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium no-underline transition-colors ${
                isActive(link.href)
                  ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400 pb-0.5"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <IconButton onClick={toggleColorMode} size="small" aria-label="Toggle dark mode">
            {mode === "dark" ? (
              <LightModeIcon className="text-gray-300" fontSize="small" />
            ) : (
              <DarkModeIcon className="text-gray-600" fontSize="small" />
            )}
          </IconButton>
          <Button
            variant="contained"
            size="small"
            href="/estimate"
            sx={{
              bgcolor: "#2563eb",
              color: "white",
              fontWeight: 600,
              px: 2,
              py: 0.75,
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#1d4ed8", boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)" },
            }}
          >
            Get Free Estimate
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <IconButton onClick={toggleColorMode} size="small" aria-label="Toggle dark mode">
            {mode === "dark" ? (
              <LightModeIcon className="text-gray-300" fontSize="small" />
            ) : (
              <DarkModeIcon className="text-gray-600" fontSize="small" />
            )}
          </IconButton>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="text-gray-900 dark:text-white" />
          </IconButton>
        </div>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            className:
              "w-80 max-w-[85vw] bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-lg">Menu</span>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon className="text-gray-900 dark:text-white" />
              </IconButton>
            </div>

            <nav className="flex-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`block py-3 px-4 text-lg font-medium no-underline transition-colors ${
                    isActive(link.href)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="contained"
                fullWidth
                href="/estimate"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  bgcolor: "#2563eb",
                  color: "white",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: "0.375rem",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                Get Free Estimate
              </Button>
            </div>
          </div>
        </Drawer>
      </nav>
    </header>
  );
}
