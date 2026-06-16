import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  username?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const AVATAR_COLORS = [
  { bg: 'bg-emerald-100 dark:bg-emerald-900', text: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-amber-100 dark:bg-amber-900',     text: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-blue-100 dark:bg-blue-900',       text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-purple-100 dark:bg-purple-900',   text: 'text-purple-700 dark:text-purple-300' },
  { bg: 'bg-rose-100 dark:bg-rose-900',       text: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-teal-100 dark:bg-teal-900',       text: 'text-teal-700 dark:text-teal-300' },
]

export const getAvatarColorClass = (username: string) => {
  if (!username) return `${AVATAR_COLORS[0].bg} ${AVATAR_COLORS[0].text}`;
  const index = username.charCodeAt(0) % AVATAR_COLORS.length;
  const color = AVATAR_COLORS[index];
  return `${color.bg} ${color.text}`;
};

const getAvatarBgColor = (name: string) => {
  return getAvatarColorClass(name);
};

export const UserAvatar = ({
  src,
  username = "",
  size = "md",
  className,
}: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const isCustomSize = typeof size === "number";
  const initials = username.trim().charAt(0).toUpperCase() || "?";
  const bgClass = getAvatarBgColor(username);

  const customStyle = isCustomSize
    ? {
        width: size,
        height: size,
        fontSize: `${size * 0.4}px`,
      }
    : undefined;

  const showImage = src && !hasError;

  return (
    <div
      style={customStyle}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none",
        !isCustomSize && sizeClasses[size],
        bgClass,
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={username}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
