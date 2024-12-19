import {Alert, Input, Pagination} from "@nextui-org/react";
import {LGCard} from "~/components/card";
import {DocDetails} from "~/components/pages";
import type {LGDDocType, LGDLevel, LGDSubject, LGDUnification} from "~/types/doc-details";
import {useReducer} from "react";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export type LGDPReducerAction = {actionType: "level" | "doc-type" | "subject", update: LGDLevel | LGDSubject | LGDDocType};

function reducer(state: LGDUnification, {actionType, update}: LGDPReducerAction): LGDUnification {
  switch(actionType) {
    case "level": {
      return {
        level: update as LGDLevel,
        docType: state.docType,
        subject: state.subject,
      }
    }
    case "doc-type": {
      return {
        level: state.level,
        docType: update as LGDDocType,
        subject: state.subject,
      }
    }
    case "subject": {
      return {
        level: state.level,
        docType: state.docType,
        subject: update as LGDSubject,
      }
    }
  }
}

export default function Library() {
  const [state, dispatch] = useReducer(reducer, {
    level: "GCE Advanced Level",
    docType: "Notes & Supplements",
    subject: "Mathematics 2"
  } as LGDUnification);
  return <main className="flex items-center justify-center pt-16 pb-4">
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <div className="max-w-4xl w-full space-y-6 px-4">
        <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 font-serif"}>What are you looking for?</h1>
        <div className="flex flex-wrap gap-4 items-center mb-8 lg:mb-12">
          <Input
            label="Document title or code"
            variant={"bordered"}
          />
        </div>
        <DocDetails state={state} dispatch={dispatch}/>
        <div className="flex items-center justify-center w-full">
          <Alert description={"All documents stored in LibGSN are the property of Gerard Sayson."} title={"Copyright notice"}/>
        </div>
        <LGCard
          title={"Differential Equations"}
          code={"9649-N-DE15"}
          description={"Sigma boy"}
          chips={["Syllabus 9649", "2025"]}
        />
        <div className="flex flex-wrap gap-4 justify-center w-full items-center mb-8 lg:mb-12">
          <Pagination isCompact showControls initialPage={1} total={10}/>
        </div>
      </div>
    </div>
  </main>;
}