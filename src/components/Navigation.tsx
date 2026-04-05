import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

import "../index.css";

type NavItem = {
  name: string;
  to: string;
  /** For home-page section highlighting */
  sectionId?: string;
};

const navigationItems: NavItem[] = [
  { name: "Home", to: "/" },
  { name: "Projects", to: "/projects" },
  { name: "Case studies", to: "/case-studies" },
  { name: "Games", to: "/games" },
  { name: "Skills", to: "/#skills", sectionId: "skills" },
  { name: "Resume", to: "/#resume", sectionId: "resume" },
  { name: "Music", to: "/#music", sectionId: "music" },
  { name: "Drawings", to: "/#drawings", sectionId: "drawings" },
  { name: "Contact", to: "/#contact", sectionId: "contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isHome = location.pathname === "/";

  const sectionIds = useMemo(
    () =>
      navigationItems
        .map((i) => i.sectionId)
        .filter((s): s is string => Boolean(s)),
    [],
  );

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const ordered = ["home", ...sectionIds];
      for (const section of [...ordered].reverse()) {
        const element =
          section === "home"
            ? document.getElementById("home")
            : document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, sectionIds]);

  const isActive = (item: NavItem) => {
    if (item.to === "/" && !item.sectionId) {
      return location.pathname === "/" && activeSection === "home";
    }
    if (item.to.startsWith("/#")) {
      return isHome && item.sectionId === activeSection;
    }
    if (item.to.startsWith("/")) {
      const path = item.to.split("#")[0];
      return (
        location.pathname === path ||
        (path !== "/" && location.pathname.startsWith(`${path}/`))
      );
    }
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-400 ease-apple",
          isScrolled || !isHome
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Logo />
              <span className="text-lg font-medium">Portfolio</span>
            </Link>

            <nav className="hidden md:block" aria-label="Primary">
              <ul className="flex flex-wrap justify-end gap-x-6 gap-y-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      className={cn(
                        "text-sm font-medium transition-colors relative py-2 rounded-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isActive(item)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      {item.name}
                      {isActive(item) && (
                        <motion.span
                          layoutId="activeNavigationIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.3,
                          }}
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              className="p-2 md:hidden text-primary rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-40 bg-background glass pt-20 md:hidden"
          >
            <nav className="container mx-auto px-6 py-8" aria-label="Mobile">
              <ul className="space-y-6">
                {navigationItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                    animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      delay: reduceMotion ? 0 : index * 0.05,
                    }}
                  >
                    <Link
                      to={item.to}
                      className={cn(
                        "text-2xl font-medium block py-2 rounded-md transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isActive(item)
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
