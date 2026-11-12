"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  DropdownMenuGroup,
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
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export interface NavbarUser {
  name: string;
  email?: string;
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
  { href: "/events/create", label: "Create Event", icon: CalendarPlus },
  { href: "/events/manage", label: "Manage Events", icon: CalendarClock },
  { href: "/events/joined", label: "Joined Events", icon: CalendarDays },
];

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

      <DropdownMenuContent align="end" className="w-64 border-sky-100 dark:border-sky-900/50">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex flex-col space-y-1">
              <p className="truncate text-sm font-semibold text-sky-950 dark:text-sky-100">
                {user.name}
              </p>
              {user.email && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-sky-100 dark:bg-sky-900/40" />

        <DropdownMenuGroup>
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
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-sky-100 dark:bg-sky-900/40" />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onLogout} className="cursor-pointer">
            <LogOut aria-hidden="true" className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar({ user: propUser, onLogout }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Fetch actual live session from Better Auth client
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user;

  // Only map session user if user is actively logged in
  const activeUser: NavbarUser | null = sessionUser
    ? {
      name: sessionUser.name || "User",
      email: sessionUser.email,
      image: sessionUser.image ?? undefined,
    }
    : propUser ?? null;

  const loggedIn = Boolean(sessionUser || propUser);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  async function handleLogout() {
    onLogout?.();
    setMobileOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully logged out!");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to log out.");
        },
      },
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200/60 bg-sky-50/70 backdrop-blur-md transition-colors dark:border-sky-900/40 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:gap-2.5"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm shadow-sky-500/30 transition-colors hover:bg-sky-600 sm:size-9">
            <HeartHandshake aria-hidden="true" className="size-4 sm:size-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
            Neighbor<span className="text-sky-500">Aid</span>
          </span>
        </Link>

        {/* Tablet + Desktop Navigation */}
        <nav
          aria-label="Mobile"
          className="flex min-h-0 flex-col gap-1 overflow-y-auto p-4 pb-2"
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
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Theme toggle: hidden on mobile (it's inside the menu instead) */}
          <ThemeToggle className="hidden md:inline-flex" />

          {loggedIn && activeUser ? (
            <>
              {/* Avatar dropdown: all screen sizes */}
              <UserMenu
                user={activeUser}
                pathname={pathname}
                onLogout={handleLogout}
              />

              {/* Logout button: desktop only (tablet uses the avatar dropdown) */}
              <div className="hidden lg:block">
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
            </>
          ) : (
            // Login: visible on every screen size
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              size="sm"
              className="bg-sky-500 text-white shadow-sm shadow-sky-500/20 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Login
            </Button>
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
                className="w-[85%] max-w-xs gap-0 border-l border-sky-100 bg-sky-50/95 p-0 text-slate-900 backdrop-blur-lg dark:border-sky-900/40 dark:bg-slate-950/95 dark:text-slate-100 sm:max-w-sm"
              >
                <SheetHeader className="border-b border-sky-200/50 px-4 py-4 pr-12 dark:border-sky-900/40">
                  <SheetTitle className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm">
                      <HeartHandshake aria-hidden="true" className="size-4" />
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Neighbor<span className="text-sky-500">Aid</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <nav aria-label="Mobile" className="flex flex-col gap-1">
                    {publicLinks.map((link) => (
                      <NavLinkItem
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        icon={link.icon}
                        active={isActivePath(pathname, link.href)}
                        onNavigate={closeMobileMenu}
                        className="py-3"
                      />
                    ))}

                    {loggedIn && activeUser && (
                      <>
                        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-sky-800/70 dark:text-sky-400/70">
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
                            className="py-3"
                          />
                        ))}
                      </>
                    )}
                  </nav>

                  {/* Appearance */}
                  <div className="mt-3 flex items-center justify-between border-t border-sky-200/50 px-3 pt-3 dark:border-sky-900/40">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Appearance
                    </span>
                    <ThemeToggle />
                  </div>

                  {/* User info / Login: sits right under Appearance */}
                  <div className="mt-4 flex flex-col gap-3 border-t border-sky-200/50 pt-4 dark:border-sky-900/40">
                    {loggedIn && activeUser ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarImage src={activeUser.image} alt={activeUser.name} />
                            <AvatarFallback className="bg-sky-200 text-sky-950 dark:bg-sky-900 dark:text-sky-100">
                              {getInitials(activeUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {activeUser.name}
                            </span>
                            {activeUser.email && (
                              <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {activeUser.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          className="shrink-0 border-sky-200 text-sky-900 hover:bg-sky-100 dark:border-sky-900 dark:text-sky-300 dark:hover:bg-sky-950"
                        >
                          <LogOut aria-hidden="true" className="size-4" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        render={<Link href="/login" />}
                        nativeButton={false}
                        className="w-full bg-sky-500 text-white shadow-sm shadow-sky-500/20 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Button>
                    )}
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