// app/write/page.tsx
import WriteHere from "../../components/Writehere";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Tittle from "../../components/Tittle";

export default async function WritePage() {
  const { userId } = await auth(); // Server-only call

  if (!userId) {
    redirect("/sign-in"); // Redirect unauthenticated users
  }

  return(
    <div className="">
    
       <WriteHere />
    </div>
  )

}
