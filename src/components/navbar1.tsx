"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "../app/providers/authProvider";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";
import { cn } from "../../lib/utils";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
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

const Navbar1 = ({
  menu = [
    { title: "Home", url: "/" },
    { title: "Events", url: "/event" },
    { title: "Dashboard", url: "/dashboard" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: Navbar1Props) => {
  const router = useRouter();

  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // =========================
  // GET CURRENT USER
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =========================
  // LOGOUT
  // =========================
const handleLogout = async () => {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);

  router.push("/login");
  router.refresh();
};
  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto">

        {/* =========================
            DESKTOP MENU
        ========================= */}
        <nav className="hidden items-center justify-between lg:flex">

          <div className="flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* AUTH AREA */}
          <div className="flex gap-2 items-center">
            {!loading && user ? (
              <>
                <span className="text-sm font-medium">
                  Welcome, {user.name}
                </span>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  render={<a href={auth.login.url} />}
                  nativeButton={false}
                >
                  {auth.login.title}
                </Button>

                <Button
                  size="sm"
                  render={<a href={auth.signup.url} />}
                  nativeButton={false}
                >
                  {auth.signup.title}
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* =========================
            MOBILE MENU
        ========================= */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">

            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" size="icon" />}
              >
                <Menu className="size-4" />
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <div className="flex flex-col gap-6 p-4">

                  <Accordion
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  {/* MOBILE AUTH */}
                  <div className="flex flex-col gap-3">
                    {!loading && user ? (
                      <>
                        <div className="text-sm font-semibold">
                          Welcome, {user.name}
                        </div>

                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          render={<a href={auth.login.url} />}
                          nativeButton={false}
                        >
                          {auth.login.title}
                        </Button>

                        <Button
                          render={<a href={auth.signup.url} />}
                          nativeButton={false}
                        >
                          {auth.signup.title}
                        </Button>
                      </>
                    )}
                  </div>

                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>

      </div>
    </section>
  );
};

// =========================
// MENU RENDER HELPERS
// =========================
const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink
              key={subItem.title}
              className="w-80"
              render={<SubMenuLink item={subItem} />}
            />
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

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

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };