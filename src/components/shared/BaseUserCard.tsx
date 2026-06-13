import type { FC, ReactNode } from "react";
import { UserAvatar } from "./UserAvatar";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface BaseUserCardProps {
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
  subtitle: string;
  children?: ReactNode;
}

export const BaseUserCard: FC<BaseUserCardProps> = ({
  user,
  subtitle,
  children,
}) => {
  return (
    <Card className="flex flex-col items-center justify-between overflow-hidden text-center transition-all hover:shadow-md">
      <CardHeader className="flex flex-col items-center pt-6 pb-4">
        <UserAvatar
          src={user.avatar}
          username={user.username}
          size="xl"
          className="mb-2"
        />
        <CardTitle className="text-lg font-semibold tracking-tight">
          {user.username}
        </CardTitle>
        <CardDescription className="text-sm">{subtitle}</CardDescription>
      </CardHeader>

      {children && (
        <CardFooter className="w-full py-4">
          <div className="flex w-full gap-3">{children}</div>
        </CardFooter>
      )}
    </Card>
  );
};
