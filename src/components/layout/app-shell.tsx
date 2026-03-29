import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  MoonStar,
  SunMedium,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "@/app/providers/theme-provider";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
    summary: "Medication review, saved checks, and interaction monitoring.",
  },
  {
    label: "About",
    href: "/app/about",
    icon: Info,
    summary: "Product context, safety framing, and platform overview.",
  },
  {
    label: "Team",
    href: "/app/team",
    icon: Users,
    summary: "People behind the SafeRx experience and product vision.",
  },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const currentItem =
    navItems.find((item) => location.pathname.startsWith(item.href)) ?? navItems[0];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-[100svh] max-w-[1600px] flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
        <div className="flex min-h-0 flex-1 items-stretch gap-4 sm:gap-6">
          <aside
            className={cn(
              "panel fixed inset-y-3 left-3 z-40 flex w-[min(88vw,320px)] flex-col overflow-y-auto p-4 transition-all duration-300 sm:inset-y-4 sm:left-4 sm:p-5 lg:relative lg:inset-auto lg:h-full lg:w-[272px] lg:shrink-0 lg:overflow-hidden",
              !desktopSidebarOpen &&
                "lg:w-0 lg:min-w-0 lg:border-0 lg:p-0 lg:opacity-0 lg:shadow-none lg:pointer-events-none",
              menuOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0",
            )}
            style={{
              backgroundColor: desktopSidebarOpen ? "var(--sidebar)" : "transparent",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <Logo />
              <button
                aria-label="Close navigation menu"
                className="rounded-xl p-2 hover:bg-[var(--accent)] lg:hidden"
                onClick={() => setMenuOpen(false)}
                title="Close navigation menu"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="mt-6 border-t pt-6 sm:mt-8"
              style={{ borderColor: "var(--sidebar-border)" }}
            >
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Navigation
              </p>
              <div className="mt-3 space-y-1.5">
                {navItems.map(({ href, icon: Icon, label }) => (
                  <NavLink
                    key={href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition",
                        isActive
                          ? "text-[var(--sidebar-primary-foreground)] shadow-[0_10px_24px_rgba(74,91,170,0.18)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
                      )
                    }
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) =>
                      isActive
                        ? {
                            backgroundColor: "var(--sidebar-primary)",
                            boxShadow: "0 14px 24px rgba(74, 91, 170, 0.18)",
                          }
                        : {
                            backgroundColor: "transparent",
                          }
                    }
                    to={href}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div
              className="mt-6 border-t pt-5 lg:mt-auto lg:pt-6"
              style={{ borderColor: "var(--sidebar-border)" }}
            >
              <Button
                className="w-full justify-center rounded-xl"
                onClick={() => navigate("/")}
                title="Logout"
                variant="ghost"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header
              className="panel z-20 mb-4 shrink-0 px-4 py-4 sm:mb-5 sm:px-5 sm:py-5"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--panel-border)",
              }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    aria-label="Open navigation menu"
                    className="rounded-2xl border border-slate-200 p-2 text-[var(--text-main)] lg:hidden dark:border-slate-700"
                    onClick={() => setMenuOpen(true)}
                    title="Open navigation menu"
                    type="button"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <button
                    aria-label={
                      desktopSidebarOpen ? "Hide sidebar navigation" : "Show sidebar navigation"
                    }
                    className="hidden rounded-2xl border p-2 text-[var(--text-main)] lg:flex"
                    onClick={() => setDesktopSidebarOpen((currentValue) => !currentValue)}
                    style={{ borderColor: "var(--border)" }}
                    title={
                      desktopSidebarOpen ? "Hide sidebar navigation" : "Show sidebar navigation"
                    }
                    type="button"
                  >
                    {desktopSidebarOpen ? (
                      <ChevronLeft className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  <div
                    className="hidden h-8 w-px lg:block"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      <span>Workspace</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="text-[var(--primary)]">{currentItem.label}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)] sm:text-[15px]">
                      {currentItem.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <Button className="justify-between" onClick={toggleTheme} variant="secondary">
                    <span>{theme === "dark" ? "Switch to light" : "Switch to dark"}</span>
                    {theme === "dark" ? (
                      <SunMedium className="h-4 w-4" />
                    ) : (
                      <MoonStar className="h-4 w-4" />
                    )}
                  </Button>
                  <div
                    className="rounded-full border px-3 py-2 text-xs font-medium sm:text-sm"
                    style={{
                      backgroundColor: "var(--secondary)",
                      borderColor: "var(--border)",
                      color: "var(--primary)",
                    }}
                  >
                    Workspace active
                  </div>
                </div>
              </div>
            </header>

            <main
              className="min-h-0 flex-1 overflow-y-auto pr-1"
              style={{
                overscrollBehavior: "contain",
                scrollbarGutter: "stable both-edges",
              }}
            >
              <div className="pb-8 sm:pb-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
          onClick={() => setMenuOpen(false)}
          title="Close navigation menu"
          type="button"
        />
      ) : null}
    </div>
  );
}
