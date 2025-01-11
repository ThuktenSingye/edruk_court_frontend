/** @format */

import { Button } from "@/components/ui/button";
import { AiFillAppstore } from "react-icons/ai";

export default function Home() {
  return (
    <div>
      <h1 className="font-heading text-primary">Edruk Court</h1>
      <h1 className="font-body text-error">
        Welcome to eDruk-Court Development
      </h1>
      <div>
        <Button>Hello</Button>
        <AiFillAppstore />
      </div>
    </div>
  );
}
