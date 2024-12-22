import {Button, Link} from "@nextui-org/react";
import {ArrowRight, Coffee} from "@phosphor-icons/react";
import {useNavigate} from "react-router";

export function meta() {
  return [
    { title: "LibGSN" },
    { name: "description", content: "Gerard Sayson's repository of notes." },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="flex items-center justify-center pt-16 pb-4 gap-16 min-h-0">
      <section className="max-w-3xl lg:max-w-4xl w-full space-y-6 px-4">
        <p className="text-xl md:text-2xl text-default-400 dark:text-default-300 mt-8 lg:mt-12">A
        {" "}<Link isExternal showAnchorIcon href="https://gsn.bz"
                   className={"text-xl md:text-2xl"}>
          GSN
        </Link> project.</p>
        <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 font-serif"}>Armed with the
          {" "}<span className={"font-bold text-purple-700 dark:text-purple-500"}>mission</span> to
          {" "}<span className={"font-bold text-amber-600 dark:text-amber-500"}>liberate</span> education</h1>
        <p className="text-xl md:text-2xl font-semibold ">Welcome to LibGSN, the repository of Gerard&apos;s notes.</p>
        <div className="flex flex-wrap gap-4 items-center mb-8 lg:mb-12">
          <Button color="primary" variant="solid" endContent={<ArrowRight/>} onPress={() => {navigate("/library")}} className={"font-bold"}>
            Enter the Library
          </Button>
          <Button color="primary" variant="bordered" endContent={<Coffee/>} className={"font-bold"}>
            Buy me a coffee!
          </Button>
        </div>
      </section>
    </main>
  );
}
