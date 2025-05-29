import { SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfessionalHomepage from "./components/ProfessionalHomepage";

export default function Home() {
  return (
    <>
      <SignedOut>
        <ProfessionalHomepage />
      </SignedOut>
      <SignedIn>
        {/* Auto-redirect signed-in users to dashboard */}
        {redirect("/dashboard")}
      </SignedIn>
    </>
  );
}
