import type {LGDPReducerAction, LGDUnification, LibGSNIndex} from "~/util/doc-details";
import React, {type ActionDispatch} from "react";
import {Autocomplete, AutocompleteItem, Input} from "@nextui-org/react";
import type {Key} from "@react-types/shared";

function createAutocompleteItem<T extends Key>(value: T) {
  return <AutocompleteItem key={value}>{value}</AutocompleteItem>
}

export function DocDetails({state, dispatch, lgi}: {
  state: LGDUnification,
  dispatch: ActionDispatch<[LGDPReducerAction]>,
  lgi: LibGSNIndex
}) {
  return <div className="flex flex-wrap gap-4 items-center mb-4">
    <Input
      label="Search query"
      variant={"bordered"}
      onValueChange={(id) => dispatch({actionType: "search", update: id as string})}
    />
    <Autocomplete
      label="Category"
      variant={"bordered"}
      selectedKey={state.level ?? null}
      onSelectionChange={(id) => {
        dispatch({actionType: "level", update: id as string});
      }}>
      {lgi.categories.map((x) => x.name).sort().map(createAutocompleteItem)}
    </Autocomplete>
    <Autocomplete
      label="Document type"
      variant={"bordered"}
      selectedKey={state.docType ?? null}
      onSelectionChange={(id) => {
        dispatch({actionType: "doc-type", update: id as string});
      }}>
      {lgi.doctype.map((x) => x.name).sort().map(createAutocompleteItem)}
    </Autocomplete>
    <Autocomplete
      label={"Subject"}
      variant={"bordered"}
      selectedKey={state.subject ?? null}
      listboxProps={{
        emptyContent: "Select a category!",
      }}
      items={
        lgi.categories.filter((x) => x.name == state.level)
          .flatMap((x) => x.subjects)
          .map((x) => x.name) // have to do this or TS complains
          .sort()
          .map((x) => ({
            name: x,
          }))
      }
      onSelectionChange={(id) => {
        dispatch({actionType: "subject", update: id as string});
      }}>
      {
        (item) => createAutocompleteItem(item.name)
      }
    </Autocomplete>
  </div>
}