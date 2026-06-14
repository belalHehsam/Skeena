import {
    useRef,
    useState,
    type ChangeEvent,
} from "react";
import {
    AtSign,
    CalendarDays,
    Camera,
    LoaderCircle,
    Pencil,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { FriendshipActions } from "@/features/friends/components/FriendshipActions";
import { EditProfileDialog } from "@/features/profile/components/EditProfileDialog";
import { useUploadAvatar } from "@/features/profile/hooks/useUploadAvatar";
import { useUploadCoverPhoto } from "@/features/profile/hooks/useUploadCoverPhoto";
import type { ProfileUser } from "@/features/profile/types/profile";
import { formatDistanceToNow } from "@/utils/formatDistanceToNow";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

type ProfileHeaderProps = {
    user: ProfileUser;
    isOwnProfile: boolean;
};

export function ProfileHeader({
    user,
    isOwnProfile,
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
            ? getApiErrorMessage(
                avatarMutation.error,
                t("uploads.avatarError"),
            )
            : "");

    const coverError =
        coverClientError ||
        (coverMutation.isError
            ? getApiErrorMessage(
                coverMutation.error,
                t("uploads.coverError"),
            )
            : "");

    function getSelectedImage(
        event: ChangeEvent<HTMLInputElement>,
    ) {
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

    function handleAvatarChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        setAvatarClientError("");
        avatarMutation.reset();

        const file = getSelectedImage(event);

        if (!file) {
            setAvatarClientError(t("uploads.invalidImage"));
            return;
        }

        avatarMutation.mutate(file);
    }

    function handleCoverChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
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
            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-card shadow-sm dark:border-neutral-800">
                <div className="group/cover relative h-40 overflow-hidden bg-gradient-to-br from-primary-950 via-primary-700 to-primary-400 sm:h-52">
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
                            className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.14),transparent_24%),linear-gradient(135deg,transparent_20%,rgba(255,255,255,0.08)_50%,transparent_80%)]"
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

                <div className="relative px-4 pb-6 sm:px-6">
                    <div className="flex items-end justify-between gap-4">
                        <div className="group/avatar relative -mt-12 rounded-full sm:-mt-14">
                            <UserAvatar
                                src={user.avatar}
                                username={profileName}
                                size={112}
                                className="border-4 border-card shadow-md"
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
                                        className="absolute bottom-1 end-1 grid size-9 place-items-center rounded-full border-2 border-card bg-neutral-900 text-white shadow-sm transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-70 sm:opacity-0 sm:group-hover/avatar:opacity-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
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

                        <div className="mb-2 flex min-w-0 items-center gap-2">
                            {isOwnProfile ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        setIsEditOpen(true);
                                    }}
                                    className="rounded-full"
                                >
                                    <Pencil className="size-4" />
                                    {t("edit.button")}
                                </Button>
                            ) : (
                                <div className="flex min-w-32 gap-2 sm:min-w-40">
                                    <FriendshipActions userId={user.id} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 max-w-2xl">
                        <h1 className="font-heading text-2xl font-bold text-neutral-950 dark:text-neutral-50 sm:text-3xl">
                            {profileName}
                        </h1>

                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                            <span className="inline-flex items-center gap-1">
                                <AtSign className="size-3.5" />
                                {user.username}
                            </span>

                            {(isOwnProfile || !user.isPrivate) &&
                                user.createdAt && (
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="size-3.5" />

                                        {t("joined", {
                                            date: formatDistanceToNow(user.createdAt),
                                        })}
                                    </span>
                                )}
                        </div>

                        {(isOwnProfile || !user.isPrivate) && user.bio && (
                            <p
                                dir="auto"
                                className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-700 dark:text-neutral-300"
                            >
                                {user.bio}
                            </p>
                        )}
                    </div>

                    {(avatarError || coverError) && (
                        <div className="mt-4 space-y-1" role="alert">
                            {avatarError && (
                                <p className="text-xs font-medium text-destructive">
                                    {avatarError}
                                </p>
                            )}

                            {coverError && (
                                <p className="text-xs font-medium text-destructive">
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