import { type ChangeEvent, useRef, useState } from "react";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import {
    AtSign,
    CalendarDays,
    Camera,
    LoaderCircle,
    Pencil,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { FriendshipActions } from "@/features/friends/components/FriendshipActions";
import { EditProfileDialog } from "@/features/profile/components/EditProfileDialog";
import { useUploadAvatar } from "@/features/profile/hooks/useUploadAvatar";
import { useUploadCoverPhoto } from "@/features/profile/hooks/useUploadCoverPhoto";
import type { ProfileUser } from "@/features/profile/types/profile";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";

type ProfileHeaderProps = {
    user: ProfileUser;
    isOwnProfile: boolean;
    postsCount: number;
};

export function ProfileHeader({
    user,
    isOwnProfile,
    postsCount,
}: ProfileHeaderProps) {
    const { t } = useTranslation("profile");
    const profileName = user.displayName?.trim() || user.username;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [avatarClientError, setAvatarClientError] = useState("");
    const [coverClientError, setCoverClientError] = useState("");

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const avatarMutation = useUploadAvatar();
    const coverMutation = useUploadCoverPhoto();

    const avatarError =
        avatarClientError ||
        (avatarMutation.isError
            ? getApiErrorMessage(avatarMutation.error, t("uploads.avatarError"))
            : "");

    const coverError =
        coverClientError ||
        (coverMutation.isError
            ? getApiErrorMessage(coverMutation.error, t("uploads.coverError"))
            : "");

    function getSelectedImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return null;
        }

        if (!file.type.startsWith("image/")) {
            return null;
        }

        return file;
    }

    function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
        setAvatarClientError("");
        avatarMutation.reset();

        const file = getSelectedImage(event);

        if (!file) {
            setAvatarClientError(t("uploads.invalidImage"));
            return;
        }

        avatarMutation.mutate(file);
    }

    function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
        setCoverClientError("");
        coverMutation.reset();

        const file = getSelectedImage(event);

        if (!file) {
            setCoverClientError(t("uploads.invalidImage"));
            return;
        }

        coverMutation.mutate(file);
    }

    return (
        <>
            <section className="bg-card overflow-hidden rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-800">
                <div className="group/cover from-primary-950 via-primary-700 to-primary-400 relative h-40 overflow-hidden bg-gradient-to-br sm:h-52">
                    {user.coverPhoto ? (
                        <img
                            src={user.coverPhoto}
                            alt={t("coverAlt", {
                                username: user.username,
                            })}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.14),transparent_24%),linear-gradient(135deg,transparent_20%,rgba(255,255,255,0.08)_50%,transparent_80%)] opacity-80"
                        />
                    )}

                    {isOwnProfile && (
                        <>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleCoverChange}
                            />

                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                aria-label={t("uploads.changeCover")}
                                onClick={() => {
                                    coverInputRef.current?.click();
                                }}
                                disabled={coverMutation.isPending}
                                className="absolute end-3 top-3 rounded-full bg-white/90 text-neutral-800 opacity-100 shadow-sm backdrop-blur transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/cover:opacity-100 dark:bg-neutral-950/85 dark:text-neutral-100 dark:hover:bg-neutral-950"
                            >
                                {coverMutation.isPending ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <Camera />
                                )}
                            </Button>
                        </>
                    )}

                    {coverMutation.isPending && (
                        <div className="absolute inset-0 grid place-items-center bg-black/35">
                            <LoaderCircle className="size-7 animate-spin text-white" />
                        </div>
                    )}
                </div>

                <div className="relative px-4 pb-6 sm:px-6 sm:pb-7">
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="group/avatar relative -mt-16 w-fit rounded-full sm:col-start-1 sm:row-start-1 sm:-mt-16">
                            <UserAvatar
                                src={user.avatar}
                                username={profileName}
                                size={160}
                                className="border-card border-4 shadow-md"
                            />

                            {isOwnProfile && (
                                <>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleAvatarChange}
                                    />

                                    <button
                                        type="button"
                                        aria-label={t("uploads.changeAvatar")}
                                        onClick={() => {
                                            avatarInputRef.current?.click();
                                        }}
                                        disabled={avatarMutation.isPending}
                                        className="border-card absolute end-1 bottom-1 grid size-9 place-items-center rounded-full border-2 bg-neutral-900 text-white shadow-sm transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-70 sm:opacity-0 sm:group-hover/avatar:opacity-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                                    >
                                        {avatarMutation.isPending ? (
                                            <LoaderCircle className="size-4 animate-spin" />
                                        ) : (
                                            <Camera className="size-4" />
                                        )}
                                    </button>
                                </>
                            )}

                            {avatarMutation.isPending && (
                                <div className="absolute inset-0 grid place-items-center rounded-full bg-black/35">
                                    <LoaderCircle className="size-6 animate-spin text-white" />
                                </div>
                            )}
                        </div>

                        <h1 className="font-heading mt-3 text-2xl font-bold text-neutral-950 sm:col-span-2 sm:row-start-2 sm:text-3xl dark:text-neutral-50">
                            {profileName}
                        </h1>

                        <div className="mt-4 flex w-full min-w-0 items-center gap-2 sm:col-start-2 sm:row-start-1 sm:mt-0 sm:mb-2 sm:w-auto sm:self-end">
                            {isOwnProfile ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        setIsEditOpen(true);
                                    }}
                                    className="w-full rounded-full sm:w-auto"
                                >
                                    <Pencil className="size-4" />
                                    {t("edit.button")}
                                </Button>
                            ) : (
                                <div className="flex w-full min-w-32 gap-2 sm:min-w-40">
                                    <FriendshipActions
                                        userId={user.id}
                                        className="rounded-full"
                                        initialStatus={
                                            user.friendshipStatus ?? "none"
                                        }
                                        allowFriendRequests={
                                            user.allowFriendRequests ??
                                            user.settings
                                                ?.allowFriendRequests ??
                                            true
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 sm:col-span-2 sm:row-start-3 dark:text-neutral-400">
                            <span className="inline-flex items-center gap-1">
                                <AtSign className="size-3.5" />
                                {user.username}
                            </span>

                            {(isOwnProfile || !user.isPrivate) &&
                                user.createdAt && (
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="size-3.5" />

                                        {t("joined", {
                                            date: formatDistanceToNow(
                                                user.createdAt,
                                            ),
                                        })}
                                    </span>
                                )}
                        </div>

                        {(isOwnProfile || !user.isPrivate) && user.bio && (
                            <p
                                className="mt-3 max-w-2xl text-start text-sm leading-6 whitespace-pre-wrap text-neutral-700 sm:col-span-2 sm:row-start-4 dark:text-neutral-300"
                            >
                                {user.bio}
                            </p>
                        )}

                        {(isOwnProfile || !user.isPrivate) && (
                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-neutral-200 pt-4 text-sm sm:col-span-2 sm:row-start-5 dark:border-neutral-800">
                                <div className="inline-flex items-baseline gap-1.5">
                                    <strong className="font-heading text-base font-bold text-neutral-950 dark:text-neutral-50">
                                        {postsCount}
                                    </strong>

                                    <span className="text-neutral-500 dark:text-neutral-400">
                                        {t("stats.posts", {
                                            count: postsCount,
                                        })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {(avatarError || coverError) && (
                        <div className="mt-4 space-y-1" role="alert">
                            {avatarError && (
                                <p className="text-destructive text-xs font-medium">
                                    {avatarError}
                                </p>
                            )}

                            {coverError && (
                                <p className="text-destructive text-xs font-medium">
                                    {coverError}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {isOwnProfile && (
                <EditProfileDialog
                    user={user}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
        </>
    );
}
