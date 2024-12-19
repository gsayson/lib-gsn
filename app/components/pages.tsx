import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {Link, useLocation} from "react-router";
import type {Location} from "react-router";
import {useTheme} from "@nextui-org/use-theme";
import {MoonStars, SunDim} from "@phosphor-icons/react";
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
  const {theme, setTheme} = useTheme();
  const nextTheme = theme == "dark" ? "light" : "dark";
  return <button onClick={() => setTheme(nextTheme)}>
    {theme == "dark" ? <MoonStars size={24} weight={"fill"}/> : <SunDim size={24}/>}
  </button>;
}

export function LGNavbar() {
  const location = useLocation();
  return <ClientOnly>
    {() => <Navbar>
      <NavbarBrand>
        <Link to={"/"} className="font-bold text-inherit">LibGSN</Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <LGNavbarItem loc={location} label={"Home"} href={"/"}/>
        <LGNavbarItem loc={location} label={"Library"} href={"/library"}/>
        <LGNavbarItem loc={location} label={"About"} href={"/about"}/>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <DarkModeToggle/>
        </NavbarItem>
      </NavbarContent>
    </Navbar>}
  </ClientOnly>
}