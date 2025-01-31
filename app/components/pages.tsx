import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@heroui/react";
import {Link, type Location, useLocation} from "react-router";
import {useTheme} from "@heroui/use-theme";
import {MoonIcon, SunIcon} from "@radix-ui/react-icons";
import React from "react";
import {ClientOnly} from "remix-utils/client-only";

function LGNavbarItem({loc, label, href}: {loc: Location, label: string, href: string}) {
  const active = href == loc.pathname
  return <NavbarItem isActive={active}>
    <Link className={active ? "text-primary" : "text-foreground"} to={href}>
      {label}
    </Link>
  </NavbarItem>
}

function DarkModeToggle() {
  const {theme, setTheme} = useTheme()
  const nextTheme = theme == "dark" ? "light" : "dark";
  return <button onClick={() => setTheme(nextTheme)}>
    {theme == "dark" ? <MoonIcon/> : <SunIcon/>}
  </button>;
}

export function LGNavbar() {
  const location = useLocation();
  return <Navbar>
    <NavbarBrand>
      <Link to={"/"} className="font-bold text-inherit">LibGSN</Link>
    </NavbarBrand>
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      <LGNavbarItem loc={location} label={"Home"} href={"/"}/>
      <LGNavbarItem loc={location} label={"Library"} href={"/library"}/>
      <LGNavbarItem loc={location} label={"Portal"} href={"/portal"}/>
    </NavbarContent>
    <NavbarContent justify="end">
      <NavbarItem className="flex">
        <ClientOnly>{() => <DarkModeToggle/>}</ClientOnly>
      </NavbarItem>
    </NavbarContent>
  </Navbar>
}

