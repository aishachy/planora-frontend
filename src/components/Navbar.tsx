"use client";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  menu = [
    { title: "Home", url: "/" },
    { title: "Pricing", url: "#" },
    { title: "Blog", url: "#" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/Register" },
  },
  className,
}: NavbarProps) => {
  return (
    <section className={cn("py-4", className)}>
      <div className="container flex items-center justify-between">

        {/* Desktop Menu */}
        <nav className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button>
              <Link href={auth.login.url}>{auth.login.title}</Link>
            </Button>

            <Button >
              <Link href={auth.signup.url}>{auth.signup.title}</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex">
              <Menu className="h-4 w-4" />
            </SheetTrigger>

            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 p-4">
                <Button >
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>

                <Button >
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };