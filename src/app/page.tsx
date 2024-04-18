import SigninButton from "@/components/SigninButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (session?.user) {
    if (session.user.loggedIn != null) {
      redirect("/dashboard");
    } else {
      redirect("/skillDetails");
    }

  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Welcome to Quizzzy 🔥!</CardTitle>
          <CardDescription>
            Quizzzy is a platform for creating quizzes using AI!. Get started by
            loggin in below!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninButton text="Sign In with Google" />
        </CardContent>
      </Card>
    </div>
  );
}
