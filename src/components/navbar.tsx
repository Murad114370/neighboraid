"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  HeartHandshake,
  LogOut,
  Menu,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "cn";

export interface NavbarUser {
  /** Display name shown in tooltips, the dropdown and the mobile sheet. */
  name: string;
  /** Optional avatar image URL. When missing (or it fails to load), the initials fallback renders. */
  image?: string;
}

export interface NavbarProps {
  user?: NavbarUser | null;
  onLogout?: () => void;
}

/** Public links shown to every visitor. */
const publicLinks = [
  { href: "/events", label: "Upcoming Events", icon: CalendarDays },
];

/** Private links rendered inside the profile dropdown and the mobile sheet. */
const privateLinks = [
  { href: "/create-event", label: "Create Event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: CalendarClock },
  { href: "/joined-events", label: "Joined Events", icon: CalendarDays },
];

const DEMO_USER: NavbarUser = { name: "Jordan Rivera" };

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials || "?";
}

function resolveUser(
  propUser: NavbarUser | null | undefined,
  isLoggedIn: boolean
): NavbarUser | null {
  if (propUser !== undefined) return propUser;
  return isLoggedIn ? DEMO_USER : null;
}

interface NavLinkItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  className?: string;
  onNavigate?: () => void;
}

function NavLinkItem({
  href,
  label,
  icon: Icon,
  active,
  className,
  onNavigate,
}: NavLinkItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        active
          ? "bg-sky-100/80 text-sky-950 dark:bg-sky-950/60 dark:text-sky-300 font-semibold"
          : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 dark:text-slate-400 dark:hover:bg-sky-950/40 dark:hover:text-sky-200",
        className
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
      {label}
    </Link>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title="Toggle light / dark theme"
      aria-label="Toggle light / dark theme"
      className={cn(
        "relative text-slate-700 hover:bg-sky-100/50 hover:text-sky-900 dark:text-slate-300 dark:hover:bg-sky-950/50 dark:hover:text-sky-200",
        className
      )}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun
        aria-hidden="true"
        className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 text-amber-500"
      />
      <Moon
        aria-hidden="true"
        className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 text-sky-300"
      />
    </Button>
  );
}

interface UserMenuProps {
  user: NavbarUser;
  pathname: string;
  onLogout: () => void;
}

function UserMenu({ user, pathname, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={user.name}
        aria-label={`Open account menu for ${user.name}`}
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full ring-2 ring-sky-300/50 hover:ring-sky-500 transition-all"
          />
        }
      >
        <Avatar className="size-8">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="bg-sky-200 text-sky-900 font-semibold dark:bg-sky-900 dark:text-sky-100">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 border-sky-100 dark:border-sky-900/50">
        <DropdownMenuLabel className="truncate text-sky-950 dark:text-sky-100">
          {user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-sky-100 dark:bg-sky-900/40" />

        {privateLinks.map((link) => {
          const Icon = link.icon;
          const active = isActivePath(pathname, link.href);

          return (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
              className={cn(
                "cursor-pointer focus:bg-sky-50 focus:text-sky-900 dark:focus:bg-sky-950/60 dark:focus:text-sky-200",
                active && "bg-sky-100/80 font-semibold text-sky-900 dark:bg-sky-900/50 dark:text-sky-200"
              )}
            >
              <Icon aria-hidden="true" className="size-4 text-sky-600 dark:text-sky-400" />
              {link.label}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="bg-sky-100 dark:bg-sky-900/40" />
        <DropdownMenuItem variant="destructive" onClick={onLogout} className="cursor-pointer">
          <LogOut aria-hidden="true" className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();

  const activeUser = resolveUser(user, isLoggedIn);
  const loggedIn = activeUser !== null;

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function handleLogout() {
    onLogout?.();
    setIsLoggedIn(false);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200/60 bg-sky-50/70 backdrop-blur-md dark:border-sky-900/40 dark:bg-slate-950/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm shadow-sky-500/30 hover:bg-sky-600 transition-colors">
            <HeartHandshake aria-hidden="true" className="size-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
            Neighbor<span className="text-sky-500">Aid</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          {publicLinks.map((link) => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              active={isActivePath(pathname, link.href)}
            />
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {loggedIn && activeUser ? (
            <>
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-sky-200 text-sky-900 hover:bg-sky-100 hover:text-sky-950 dark:border-sky-900 dark:text-sky-300 dark:hover:bg-sky-950/60"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  Logout
                </Button>
              </div>
              <UserMenu
                user={activeUser}
                pathname={pathname}
                onLogout={handleLogout}
              />
            </>
          ) : (
            <div className="hidden sm:block">
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                size="sm"
                className="bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-500/20 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                Login
              </Button>
            </div>
          )}

          {/* Mobile Sheet Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={(open) => setMobileOpen(open)}>
              <SheetTrigger
                aria-label="Open navigation menu"
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-700 hover:bg-sky-100/60 dark:text-slate-300 dark:hover:bg-sky-950/60"
                  />
                }
              >
                <Menu aria-hidden="true" className="size-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="gap-0 border-l border-sky-100 bg-sky-50/95 p-0 text-slate-900 backdrop-blur-lg dark:border-sky-900/40 dark:bg-slate-950/95 dark:text-slate-100"
              >
                <SheetHeader className="border-b border-sky-200/50 dark:border-sky-900/40 pr-12 px-4 py-4">
                  <SheetTitle className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm">
                      <HeartHandshake aria-hidden="true" className="size-4" />
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Neighbor<span className="text-sky-500">Aid</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav
                  aria-label="Mobile"
                  className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4"
                >
                  {publicLinks.map((link) => (
                    <NavLinkItem
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      active={isActivePath(pathname, link.href)}
                      onNavigate={closeMobileMenu}
                    />
                  ))}

                  {loggedIn && activeUser && (
                    <>
                      <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-sky-800/70 dark:text-sky-400/70">
                        Your account
                      </p>
                      {privateLinks.map((link) => (
                        <NavLinkItem
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          icon={link.icon}
                          active={isActivePath(pathname, link.href)}
                          onNavigate={closeMobileMenu}
                        />
                      ))}
                    </>
                  )}
                </nav>

                <div className="flex flex-col gap-3 border-t border-sky-200/50 dark:border-sky-900/40 p-4">
                  {loggedIn && activeUser ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={activeUser.image} alt={activeUser.name} />
                          <AvatarFallback className="bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-100">
                            {getInitials(activeUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {activeUser.name}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="border-sky-200 text-sky-900 hover:bg-sky-100 dark:border-sky-900 dark:text-sky-300 dark:hover:bg-sky-950"
                      >
                        <LogOut aria-hidden="true" className="size-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      render={<Link href="/login" />}
                      nativeButton={false}
                      className="w-full bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 shadow-sm shadow-sky-500/20"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Button>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Appearance
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}