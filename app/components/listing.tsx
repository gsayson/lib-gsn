import {Card, CardBody, CardFooter, CardHeader, Divider, Pagination} from "@nextui-org/react";
import {DownloadSimple} from "@phosphor-icons/react";
import {Await, Link, useFetcher} from "react-router";
import {type LGDUnification, type LibGSNIndex, resolveCategoryKey, resolveDocTypeNumerical} from "~/util/doc-details";
import {Suspense, useEffect, useState} from "react";
import type {loader} from "~/routes/science.shadows";
import {chunkArray} from "~/util/jsutil";

export function LGCard(
  {
    title,
    code,
    description,
    doctype,
    year,
    subject,
    lastUpdated,
    category,
    pointer,
  }: {
    title: string,
    code: string,
    description: string,
    doctype: string,
    year: number,
    subject: string,
    lastUpdated: string,
    category: string,
    pointer: string
  },
) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-xs text-default-500 font-bold">{category.toUpperCase()} &bull; {year}</p>
          <p className="text-md font-bold">{title}</p>
          <p className="text-small text-default-500">{subject}</p>
        </div>
        <Link className="mr-2 hover:text-primary transition" to={`/library/${code}`}>
          <DownloadSimple size={24}/>
        </Link>
      </CardHeader>
      <Divider/>
      <CardBody>
        <p className={"text-justify"}>{description}</p>
      </CardBody>
      <CardFooter>
        <div className="gap-2">
          <p className="text-xs text-default-500 font-bold">{doctype}</p>
          <p className="text-xs text-default-500">Last updated {lastUpdated}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export function LGSearchResultList({state, index}: {state: LGDUnification, index: LibGSNIndex}) {
  const fetcher = useFetcher<typeof loader>();
  // We're stuck with this because React will complain if we use `useMemo`; it probably gets executed on the server.
  const [promise, setPromise] = useState<Promise<void>>()
  const [page, setPage] = useState(1);
  const usp = new URLSearchParams()
  for(const [key, value] of Object.entries(state)) {
    if(value != undefined) usp.set(key, value);
  }
  useEffect(() => {
    setPromise(fetcher.load(
      `/science/shadows?${usp.toString()}`
    ))
  }, [state])
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Await resolve={promise}>
        {() => {
          const chunked = chunkArray(fetcher.data ?? [], 10)
          const k = (chunked[page - 1] ?? []) // JS won't raise any ArrayIndexOutOfBounds; we'll just get undefined.
            .map((item) => <LGCard
              key={item.doc_code} // Doc code is UNIQUE!
              title={item.name}
              code={item.doc_code}
              description={item.desc}
              doctype={resolveDocTypeNumerical(item.doc_type, index)}
              year={item.year}
              subject={item.subject}
              lastUpdated={item.last_updated.toString()}
              category={resolveCategoryKey(item.category, index)}
              pointer={item.pointer}
            />)
          return k.length == 0 ? <EmptyList/> : <>
            <h2 className={"text-xl md:text-2xl font-bold"}>{fetcher.data?.length ?? 0} results found</h2>
            {k}
            <div className="flex flex-wrap gap-4 justify-center w-full items-center mb-8 lg:mb-12" key={"pagination"}>
              <Pagination isCompact showControls initialPage={page} onChange={(page) => {
                setPage(page)
                window.scrollTo(0, 0)
              }} total={chunked.length ?? 1}/>
            </div>
          </>
        }}
      </Await>
    </Suspense>
  )
}

function EmptyList() {
  return <div>
    <h2 className={"text-xl md:text-2xl font-bold mb-2"}>No results found</h2>
    <p>It&apos;s like your homework is missing.</p>
  </div>;
}