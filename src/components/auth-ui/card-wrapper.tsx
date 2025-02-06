"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/general/card";
import AuthHeader from "./auth-header";
import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  title: string;
  showSocial?: boolean;
  backButtonHref: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, title, showSocial}: CardWrapperProps) => {
  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <AuthHeader label={headerLabel} title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
