import {Autocomplete, AutocompleteItem, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import type {Location} from "react-router";
import {Link, useLocation} from "react-router";
import {useTheme} from "@nextui-org/use-theme";
import {MoonStars, SunDim} from "@phosphor-icons/react";
import {ClientOnly} from "remix-utils/client-only";
import React, {type Key} from "react";
import {
  type LGDDocType,
  type LGDLevel,
  type LGDSubject,
  LGDSubjectA,
  LGDSubjectO,
  type LGDUnification,
} from "~/types/doc-details";
import type {LGDPReducerAction} from "~/routes/library";

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

function createAutocompleteItem<T extends Key>(value: T) {
  return <AutocompleteItem key={value}>{value}</AutocompleteItem>
}

export function DocDetails({state, dispatch}: { state: LGDUnification, dispatch: React.ActionDispatch<[LGDPReducerAction]> }) {
  return <div className="flex-col md:flex-row md:flex items-center justify-center md:space-y-0 space-y-4 md:space-x-4 w-full">
    <Autocomplete className="md:max-w-xs" label="Level" variant={"bordered"} onSelectionChange={(id) => {dispatch({actionType: "level", update: id as LGDLevel})}}>
      {createAutocompleteItem<LGDLevel>("GCE Ordinary Level")}
      {createAutocompleteItem<LGDLevel>("GCE Advanced Level")}
    </Autocomplete>
    <Autocomplete className="md:max-w-xs" label="Document type" variant={"bordered"} onSelectionChange={(id) => {dispatch({actionType: "doc-type", update: id as LGDDocType})}}>
      {createAutocompleteItem<LGDDocType>("Notes & Supplements")}
      {createAutocompleteItem<LGDDocType>("Exam Papers")}
    </Autocomplete>
    <Autocomplete className="md:max-w-xs" label="Subject" variant={"bordered"} onSelectionChange={(id) => {dispatch({actionType: "subject", update: id as LGDSubject})}}>
      {Object.values(state.level == "GCE Advanced Level" ? LGDSubjectA : LGDSubjectO).sort().map(createAutocompleteItem)}
    </Autocomplete>
  </div>;
}