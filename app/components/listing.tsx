import {Card, CardBody, CardFooter, CardHeader, Divider} from "@nextui-org/react";
import {DownloadSimple} from "@phosphor-icons/react";
import {Link} from "react-router";
import type {LGDUnification} from "~/util/doc-details";
import {useEffect, useState} from "react";

export function LGCard(
  {
    title,
    code,
    description,
    doctype,
    year,
    subject,
    lastUpdated,
  }: {
    title: string,
    code: string,
    description: string
    doctype: string,
    year: number,
    subject: string,
    lastUpdated: string,
  }
) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-xs text-default-500 font-bold">{doctype.toUpperCase()} &bull; {year}</p>
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
        <div className="flex gap-2">
          <p className="text-xs text-default-500">Last updated {lastUpdated}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export function LGSearchResultList({ state }: { state: LGDUnification }) {
  const [a, b] = useState<string>("hello");
  useEffect(() => {
    b(state.level ?? "underwear")
  }, [state])
  return (
    <LGCard
      title={"Differential Equations"}
      code={"9649-N-DE15"}
      description={"A handout on differential equations. Lorem ipsum hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world" + a}
      doctype={"Notes & Supplements"}
      year={2025}
      subject={"Further Mathematics"}
      lastUpdated={"20 December 2024"}
    />
  )
}