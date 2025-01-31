import {Alert, Button, Skeleton} from "@heroui/react";
import {LGSearchResultList} from "~/components/listing";
import {type LGDUnification, useDDReducer} from "~/util/doc-details";
import {getIndex} from "~/server/search";
import {Await, useLoaderData} from "react-router";
import {Suspense, useState} from "react";
import {ClientOnly} from "remix-utils/client-only";
import {DocDetails} from "~/components/search";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export async function loader() {
  return {
    index: getIndex(),
    cdnBase: process.env.S3_CDN_HOST!
  };
}

export default function Library() {
  const [state, dispatch] = useDDReducer();
  const [newQuery, setNewQuery] = useState<LGDUnification>(state);
  let { index, cdnBase } = useLoaderData<typeof loader>();
  return <main className="flex items-center justify-center pt-16 pb-4 gap-16 min-h-0">
    <div className="max-w-3xl lg:max-w-4xl w-full space-y-6 px-4">
      <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 mb-8 font-serif"}>What will you ace next?</h1>
      <div className="lg:flex gap-4 w-full space-y-6 lg:space-y-0 lg:space-x-4">
        <search className={"w-full lg:max-w-xs"}>
          <Suspense fallback={
            <Skeleton className={"w-full"}/>
          }>
            <Await resolve={index}>
              {x => {
                let index = x;
                if(index == undefined) {
                  index = {
                    categories: [],
                    doctype: []
                  };
                }
                return <DocDetails state={state} dispatch={dispatch} lgi={index}/>;
              }}
            </Await>
          </Suspense>
          <div className={"w-full space-y-4"}>
            <Button className={"font-bold w-full"} color={"primary"}
                    onPress={() => setNewQuery(state)}>Submit search query</Button>
            <Button className={"font-bold w-full"} color={"primary"} variant={"bordered"}
                    isDisabled>Support LibGSN</Button>
          </div>
          <div className="flex items-center justify-center w-full my-4">
            <Alert
              description={"It costs money and time to maintain LibGSN and its repository of notes. Please consider support me " +
                "when I configure a 'buy me a coffee' link!"}
              title={"Help support LibGSN (soon)!"}
            />
          </div>
        </search>
        <section className={"space-y-4 w-full max-w-3xl"}>
          <ClientOnly>{() =>
            <Suspense fallback={
              <Skeleton className={"w-full"}/>
            }>
              <Await resolve={index}>
                {x => {
                  let index = x;
                  if(index == undefined) {
                    index = {
                      categories: [],
                      doctype: []
                    };
                  }
                  return <LGSearchResultList state={newQuery} index={index} cdnBase={cdnBase}/>;
                }}
              </Await>
            </Suspense>
          }</ClientOnly>
        </section>
      </div>
    </div>
  </main>;
}