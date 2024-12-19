import {Card, CardBody, CardFooter, CardHeader, Divider} from "@nextui-org/react";
import {DownloadSimple} from "@phosphor-icons/react";
import {Chip} from "@nextui-org/chip";
import {Link} from "react-router";

export function LGCard({title, code, description, chips}: {title: string; code: string, description: string, chips: string[]}) {
  return (
    <Card>
      <CardHeader className="flex gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-md font-bold">{title}</p>
          <p className="text-small text-default-500 font-mono">{code}</p>
        </div>
        <Link className="mr-2 hover:text-primary transition" to={`/library/${code}`}>
          <DownloadSimple size={24}/>
        </Link>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex gap-4">
          {chips.map((chip) => <Chip key={chip}>{chip}</Chip>)}
        </div>
      </CardFooter>
    </Card>
  )
}