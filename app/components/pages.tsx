import {Autocomplete, AutocompleteItem, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";
import type {Location} from "react-router";
import {Link, useLocation} from "react-router";
import {useTheme} from "@nextui-org/use-theme";
import {MoonStars, SunDim} from "@phosphor-icons/react";
import {ClientOnly} from "remix-utils/client-only";
import React, {type Key} from "react";
import {
  type LGDPReducerAction,
  type LGDUnification,
} from "~/util/doc-details";
import type {LibGSNIndex} from "~/util/search";

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
  dispatch: React.ActionDispatch<[LGDPReducerAction]>,
  lgi: LibGSNIndex
}) {
  const [currentCategory, setCurrentCategory] = React.useState<string | null>(null);
  const [currentDocType, setCurrentDocType] = React.useState<string | null>(null);
  const [currentSubject, setCurrentSubject] = React.useState<string | null>(null);
  const [subDisabled, setSubDisabled] = React.useState<boolean>(false);
  const SearchBar = () => <div className="flex flex-wrap gap-4 items-center mb-8 lg:mb-12">
    <Input
      label="Document title or code"
      variant={"bordered"}
    />
  </div>
  const ModifierOptions = () => <div
    className="flex-col md:flex-row md:flex items-center justify-center md:space-y-0 space-y-4 md:space-x-4 w-full">
    <Autocomplete className="md:max-w-xs" label="Category" variant={"bordered"}
                  selectedKey={currentCategory}
                  onSelectionChange={(id) => {
                    setCurrentCategory(id as string | null);
                    if(id == null) {
                      setCurrentSubject(null);
                      setSubDisabled(true);
                    } else {
                      setSubDisabled(false);
                    }
                    dispatch({actionType: "level", update: id as string});
                  }}>
      {lgi.categories.map((x) => x.name).sort().map(createAutocompleteItem)}
    </Autocomplete>
    <Autocomplete className="md:max-w-xs" label="Document type" variant={"bordered"}
                  selectedKey={currentDocType}
                  onSelectionChange={(id) => {
                    setCurrentDocType(id as string | null);
                    dispatch({actionType: "doc-type", update: id as string});
                  }}>
      {lgi.doctype.sort().map(createAutocompleteItem)}
    </Autocomplete>
    <Autocomplete className="md:max-w-xs" label={state.level == undefined ? "Select a category" : "Subject"}
                  variant={"bordered"}
                  selectedKey={currentSubject}
                  isDisabled={subDisabled}
                  onSelectionChange={(id) => {
                    setCurrentSubject(id as string | null);
                    dispatch({actionType: "subject", update: id as string});
                  }}>
      {
        lgi.categories.filter((x) => x.name == state.level)
          .flatMap((x) => x.subjects)
          .map((y) => y.name)
          .sort().map(createAutocompleteItem)
      }
    </Autocomplete>
  </div>;
  return <>
    <SearchBar/>
    <ModifierOptions/>
  </>
}