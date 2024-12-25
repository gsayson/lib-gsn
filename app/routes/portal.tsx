import {Button, Divider} from "@nextui-org/react";
import {data, redirect, useLoaderData, useNavigate} from "react-router";
import {type LGDUnification, type LibGSNIndex, useDDReducer} from "~/util/doc-details";
import {useState} from "react";
import {DocDetails} from "~/components/search";
import {getIndex} from "~/server/search";
import {FileUploadModal} from "~/components/portal-management";
import {commitSession, getSession, NULL_SVR, validateSessionObject} from "~/server/session";
import type {Route} from "../../.react-router/types/app/routes/+types/portal";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  // check unauthenticated
  if(NULL_SVR == await validateSessionObject(session)) {
    return redirect("/auth"); // we have no cookie to set
  }
  return data({
    index: await getIndex()
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });
}


export default function Portal() {
  const [state, dispatch] = useDDReducer();
  const [newQuery, setNewQuery] = useState<LGDUnification>(state);
  const navigate = useNavigate();
  let { index } = useLoaderData<{index: LibGSNIndex}>();
  if(index == undefined) {
    index = {
      categories: [],
      doctype: []
    };
  }
  return <main className="flex items-center justify-center pt-16 pb-4 gap-16 min-h-0">
    <div className="max-w-3xl lg:max-w-4xl w-full space-y-6 px-4">
      <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 mb-8 font-serif"}>The LibGSN Portal</h1>
      <div className="lg:flex gap-4 w-full space-y-6 lg:space-y-0 lg:space-x-4">
        <section className={"w-full lg:max-w-xs"}>
          <DocDetails state={state} dispatch={dispatch} lgi={index}/>
          <div className={"w-full space-y-4"}>
            <Button className={"font-bold w-full"} color={"primary"}
                    onPress={() => setNewQuery(state)}>Submit search query</Button>
            <Divider/>
            <FileUploadModal index={index}/>
            <Button
              className={"font-bold w-full"} color={"danger"}
              onPress={async () => {
                await fetch("/science/logout", {method: "post"});
                navigate("/auth");
              }}
            >Log out</Button>
          </div>
        </section>
        <section className={"space-y-4 w-full max-w-3xl"}>
          <h2>Lookup</h2>
        </section>
      </div>
    </div>
  </main>;
}