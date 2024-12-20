import {Autocomplete, AutocompleteItem, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import {type Location, useFetcher} from "react-router";
import {Link, useLocation} from "react-router";
import {useTheme} from "@nextui-org/use-theme";
import {MoonStars, SunDim} from "@phosphor-icons/react";
import {ClientOnly} from "remix-utils/client-only";
import React, {type ActionDispatch, useState} from "react";
import {
  type LGDPReducerAction,
  type LGDUnification,
} from "~/util/doc-details";
import type {LibGSNIndex} from "~/util/search";
import type {Key} from "@react-types/shared";

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

export function DocDetails({state, dispatch, lgi}: {
  state: LGDUnification,
  dispatch: ActionDispatch<[LGDPReducerAction]>,
  lgi: LibGSNIndex
}) {
  const [subDisabled, setSubDisabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  return <>
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <Input
        label="Document title or code"
        variant={"bordered"}
        onValueChange={setSearchQuery}
      />
    </div>
    <div
      className="flex-col md:flex-row md:flex items-center justify-center md:space-y-0 space-y-4 md:space-x-4 w-full">
      <Autocomplete className="md:max-w-xs" label="Category" variant={"bordered"}
                    selectedKey={state.level}
                    defaultItems={lgi.categories}
                    onSelectionChange={(id) => {
                      setSubDisabled(id == null)
                      dispatch({actionType: "level", update: id as string});
                    }}>
        {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
      </Autocomplete>
      <Autocomplete className="md:max-w-xs" label="Document type" variant={"bordered"}
                    selectedKey={state.docType}
                    onSelectionChange={(id) => {
                      dispatch({actionType: "doc-type", update: id as string});
                    }}>
        {lgi.doctype.sort().map(createAutocompleteItem)}
      </Autocomplete>
      <Autocomplete className="md:max-w-xs" label={state.level == undefined ? "Select a category" : "Subject"}
                    variant={"bordered"}
                    selectedKey={state.subject}
                    isDisabled={subDisabled}
                    onSelectionChange={(id) => {
                      dispatch({actionType: "subject", update: id as string});
                    }}>
        {
          lgi.categories.filter((x) => x.name == state.level)
            .flatMap((x) => x.subjects)
            .map((y) => y.name)
            .sort().map(createAutocompleteItem)
        }
      </Autocomplete>
    </div>
  </>
}