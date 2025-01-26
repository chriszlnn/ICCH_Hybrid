"use client";
import { Button } from "@/components/ui/button";

const SignOut = () => {
  const handleSignOut = async () => {};

  return (
    <div className="flex justify-center">
      <Button variant="destructive" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export { SignOut };
