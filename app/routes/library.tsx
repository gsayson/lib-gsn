import {Alert, Input, Pagination} from "@nextui-org/react";
import {LGCard, LGSearchResultList} from "~/components/listing";
import {DocDetails} from "~/components/pages";
import {useDDReducer} from "~/util/doc-details";
import {getIndex, getShadows} from "~/util/search";
import {useFetcher, useLoaderData} from "react-router";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export async function loader() {
  return {
    index: await getIndex(),
    shadows: await getShadows()
  };
}

export default function Library() {
  const [state, dispatch] = useDDReducer();
  let { index, shadows } = useLoaderData<typeof loader>();
  if(index == undefined) {
    index = {
      categories: [],
      doctype: []
    };
  }
  return <main className="flex items-center justify-center pt-16 pb-4">
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <div className="max-w-3xl lg:max-w-4xl w-full space-y-6 px-4">
        <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 font-serif"}>What will you ace next?</h1>
        <DocDetails state={state} dispatch={dispatch} lgi={index}/>
        <div className="flex items-center justify-center w-full">
          <Alert description={"All documents stored in LibGSN are the property of Gerard Sayson."} title={"Copyright notice"}/>
        </div>
        <LGSearchResultList state={state}/>
        <div className="flex flex-wrap gap-4 justify-center w-full items-center mb-8 lg:mb-12">
          <Pagination isCompact showControls initialPage={1} total={10}/>
        </div>
      </div>
    </div>
  </main>;
}