import {Button, Divider, Link} from "@nextui-org/react";
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
      <div className="max-w-3xl lg:max-w-4xl w-full space-y-6 px-4">
        <p className="text-xl md:text-2xl text-default-400 dark:text-default-300 mt-8 lg:mt-12">A
          {" "}<Link isExternal showAnchorIcon href="https://gsn.bz"
                     className={"text-xl md:text-2xl"}>
            GSN
          </Link> project.</p>
        <h1 className={"text-4xl md:text-6xl mt-2 lg:mt-4 font-serif"}>
          Because
          {" "}<span className={"font-bold text-amber-600 dark:text-amber-500"}>the best things in life are free</span>,
          and learning is one of them
        </h1>
        <p className="text-xl md:text-2xl my-4 text-default-400 dark:text-default-300">
          (That&apos;s an <Link isExternal showAnchorIcon className={"text-xl md:text-2xl"}
                                href={"https://www.youtube.com/watch?v=4lL98QSR-E4"}>actual song lyric</Link>, by the way)
        </p>
        <p className="text-xl md:text-2xl font-semibold">Welcome to LibGSN, the repository of Gerard&apos;s notes.</p>
        <div className="flex flex-wrap gap-4 items-center">
          <Button color="primary" variant="solid" onPress={() => {
            navigate("/library")
          }} className={"font-bold"}>
            Enter the Library
          </Button>
          <Button color="primary" variant="bordered" className={"font-bold"} isDisabled>
            Buy me a coffee!
          </Button>
        </div>
        <Divider/>
        <p>LibGSN is a repository of my notes and past exams for those who truly want to learn, work and succeed.
        The Library provides a search function to look up notes and examinations for particular subjects.</p>
        <p>
          This project initially appeared due to being unable to re-upload my notes on one particular website,
          whenever I discovered a flaw or typo, and also because of my dissatisfaction with the scarcity of
          resources online &ndash; gate-kept, hidden, and hard to find for those who really want to learn.
        </p>
        <p>
          I hope that the resources published here may help you on your academic journey. Good luck!
        </p>
        <Divider/>
        <section className={"text-sm text-default-400 dark:text-default-300 space-y-2"}>
          <p>You can access the source code to this website ("program")
            {" "}<Link className={"text-sm"} isExternal href={"https://github.com/gsayson/lib-gsn"}>here</Link>
            {" "}at no cost.</p>
          <p>
            This program is free software: you can redistribute it and/or modify
            it under the terms of the
            {" "}<Link className={"text-sm"} isExternal href={"https://www.gnu.org/licenses/agpl-3.0.html"}>
              GNU Affero General Public License
            </Link>
            {" "}as published by the Free Software Foundation, either version 3 of the
            License, or (at your option) any later version.
          </p>
          <p>
            <span className={"font-bold"}>
              This program is distributed in the hope that it will be useful,
              but WITHOUT ANY WARRANTY; without even the implied warranty of
              MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
            </span> See the
            GNU Affero General Public License for more details.
          </p>
          <p>
            The documents available in LibGSN are available under the
            {" "}<Link className={"text-sm"} isExternal
                       href={"https://creativecommons.org/licenses/by-nc-sa/4.0/"}>CC-BY-NC-SA</Link>
            {" "}license as published by Creative Commons, unless otherwise stated.
          </p>
        </section>
      </div>
    </main>
  );
}
