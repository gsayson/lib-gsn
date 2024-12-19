import {Input, Pagination} from "@nextui-org/react";
import {LGCard} from "~/components/card";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export default function Library() {
  return <main className="flex items-center justify-center pt-16 pb-4">
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <div className="max-w-3xl w-full space-y-6 px-4">
        <p className="text-xl md:text-2xl text-default-400 dark:text-default-300 font-mono">9649-N-DE15</p>
        <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 font-serif"}>Document X</h1>
        <div className="flex flex-wrap gap-4 items-center mb-8 lg:mb-12">
          <Input
            label="Document title or code"
            variant={"bordered"}
          />
        </div>
        <LGCard title={"Differential Equations"} code={"9649-N-DE15"} description={"Differential Equations"}
                chips={["Syllabus 9649", "2025"]}/>
        <div className="flex flex-wrap gap-4 justify-center w-full items-center mb-8 lg:mb-12">
          <Pagination isCompact showControls initialPage={1} total={10}/>
        </div>
      </div>
    </div>
  </main>
;
}