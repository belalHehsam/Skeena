import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { TextField } from "@/components/common/TextField";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import type { ProfileUser } from "@/features/profile/types/profile";
import { cn } from "@/lib/utils";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

type EditProfileFormValues = {
    displayName: string;
    username: string;
    bio: string;
};

type EditProfileDialogProps = {
    user: ProfileUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditProfileDialog({
    user,
    open,
    onOpenChange,
}: EditProfileDialogProps) {
    const { t } = useTranslation("profile");
    const updateProfileMutation = useUpdateProfile();

    const schema = useMemo(
        () =>
            z.object({
                displayName: z
                    .string()
                    .trim()
                    .min(3, t("validation.displayNameMin"))
                    .max(40, t("validation.displayNameMax")),

                username: z
                    .string()
                    .trim()
                    .min(3, t("validation.usernameMin"))
                    .max(30, t("validation.usernameMax"))
                    .regex(USERNAME_REGEX, t("validation.usernamePattern")),

                bio: z
                    .string()
                    .trim()
                    .max(200, t("validation.bioMax")),
            }),
        [t],
    );

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<EditProfileFormValues>({
        resolver: zodResolver(schema),

        defaultValues: {
            displayName: user.displayName ?? "",
            username: user.username,
            bio: user.bio ?? "",
        },
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        reset({
            displayName: user.displayName ?? "",
            username: user.username,
            bio: user.bio ?? "",
        });
    }, [
        open,
        reset,
        user.bio,
        user.displayName,
        user.username,
    ]);

    const bioValue = useWatch({
        control,
        name: "bio",
    }) ?? "";

    function onSubmit(values: EditProfileFormValues) {
        updateProfileMutation.mutate(values, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        {t("edit.title")}
                    </DialogTitle>

                    <DialogDescription>
                        {t("edit.description")}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <TextField
                        id="profile-display-name"
                        label={t("edit.displayName")}
                        autoComplete="name"
                        error={errors.displayName?.message}
                        {...register("displayName")}
                    />

                    <TextField
                        id="profile-username"
                        label={t("edit.username")}
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                            <label
                                htmlFor="profile-bio"
                                className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                            >
                                {t("edit.bio")}
                            </label>

                            <span className="text-[11px] text-neutral-500">
                                {bioValue.length}/200
                            </span>
                        </div>

                        <textarea
                            id="profile-bio"
                            rows={4}
                            maxLength={200}
                            placeholder={t("edit.bioPlaceholder")}
                            className={cn(
                                "w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-950",
                                errors.bio &&
                                "border-destructive focus:border-destructive focus:ring-destructive/15",
                            )}
                            {...register("bio")}
                        />

                        {errors.bio?.message && (
                            <p className="text-xs font-medium text-destructive">
                                {errors.bio.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateProfileMutation.isPending}
                        >
                            {t("edit.cancel")}
                        </Button>

                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending
                                ? t("edit.saving")
                                : t("edit.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}