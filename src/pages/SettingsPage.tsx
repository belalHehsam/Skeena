import { Bell, Palette, Settings, ShieldCheck, UserPlus } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { UserSettings } from "@/features/auth/types/auth";
import { SettingRow } from "@/features/profile/components/SettingRow";
import { SettingsSection } from "@/features/profile/components/SettingsSection";
import {
    SETTINGS_MUTATION_KEY,
    useUpdateSettings,
} from "@/features/profile/hooks/useUpdateSettings";
import { useDarkMode } from "@/components/context/DarkModeContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LANG_DIR } from "@/constants/i18nConfig";

export default function SettingsPage() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation("settings");
    const { setMode } = useDarkMode();

    const updateSettingsMutation = useUpdateSettings();
    const isAnySettingPending =
        useIsMutating({ mutationKey: SETTINGS_MUTATION_KEY }) > 0;

    if (!user) {
        return null;
    }

    const settings = user.settings;
    const isRtl = i18n.dir() === "rtl";

    const themeLabels: Record<UserSettings["theme"], string> = {
        light: t("appearance.theme.options.light"),
        dark: t("appearance.theme.options.dark"),
        system: t("appearance.theme.options.system"),
    };

    const languageLabels: Record<UserSettings["language"], string> = {
        en: t("appearance.language.options.en"),
        ar: t("appearance.language.options.ar"),
    };

    function applyLanguage(language: UserSettings["language"]) {
        void i18n.changeLanguage(language);

        document.documentElement.lang = language;
        document.documentElement.dir = LANG_DIR[language];
    }

    function updateSetting<K extends keyof UserSettings>(
        key: K,
        value: UserSettings[K],
    ) {
        if (isAnySettingPending) {
            return;
        }

        const previousValue = settings[key];

        if (key === "theme") {
            setMode(value as UserSettings["theme"]);
        }

        if (key === "language") {
            applyLanguage(value as UserSettings["language"]);
        }

        updateSettingsMutation.mutate(
            {
                [key]: value,
            } as Pick<UserSettings, K>,
            {
                onError: () => {
                    if (key === "theme") {
                        setMode(previousValue as UserSettings["theme"]);
                    }

                    if (key === "language") {
                        applyLanguage(
                            previousValue as UserSettings["language"],
                        );
                    }
                },
            },
        );
    }

    function isSettingPending(key: keyof UserSettings) {
        return (
            updateSettingsMutation.isPending &&
            Boolean(
                updateSettingsMutation.variables &&
                Object.prototype.hasOwnProperty.call(
                    updateSettingsMutation.variables,
                    key,
                ),
            )
        );
    }

    const selectTriggerClassName =
        "relative h-9 min-w-36 bg-neutral-50 pe-7 transition-colors duration-200 hover:border-primary/50 hover:bg-white disabled:cursor-default disabled:opacity-100 [&>svg]:absolute [&>svg]:end-2 rtl:[&_[data-slot=select-value]]:text-right dark:bg-neutral-900 dark:hover:bg-neutral-950";

    const selectItemClassName =
        "pe-8 text-start rtl:[&>span:last-child]:right-auto rtl:[&>span:last-child]:left-2";

    const switchClassName =
        "transition-colors duration-200 data-disabled:cursor-default data-disabled:opacity-100 [&_[data-slot=switch-thumb]]:duration-200";

    return (
        <div className="mx-auto w-full max-w-4xl pb-8 rtl:[&_[data-slot=switch-thumb][data-checked]]:-translate-x-[calc(100%-2px)]">
            <header className="mb-8 flex items-start gap-3">
                <div className="bg-primary/10 text-primary mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl">
                    <Settings className="size-5" aria-hidden="true" />
                </div>

                <div>
                    <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                        {t("title")}
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        {t("description")}
                    </p>
                </div>
            </header>

            <div className="min-w-0 space-y-6">
                <SettingsSection
                    id="appearance"
                    icon={Palette}
                    title={t("appearance.title")}
                    description={t("appearance.description")}
                >
                    <SettingRow
                        label={t("appearance.theme.label")}
                        description={t("appearance.theme.description")}
                        isPending={isSettingPending("theme")}
                        isDisabled={isAnySettingPending}
                        control={
                            <Select
                                value={settings.theme}
                                onValueChange={(value) => {
                                    if (value) {
                                        updateSetting(
                                            "theme",
                                            value as UserSettings["theme"],
                                        );
                                    }
                                }}
                                disabled={isAnySettingPending}
                            >
                                <SelectTrigger
                                    className={selectTriggerClassName}
                                >
                                    <SelectValue>
                                        {themeLabels[settings.theme]}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent
                                    dir={isRtl ? "rtl" : "ltr"}
                                    side="bottom"
                                    sideOffset={8}
                                    align="start"
                                    alignItemWithTrigger={false}
                                    className="duration-150"
                                >
                                    <SelectItem
                                        value="light"
                                        className={selectItemClassName}
                                    >
                                        {themeLabels.light}
                                    </SelectItem>
                                    <SelectItem
                                        value="dark"
                                        className={selectItemClassName}
                                    >
                                        {themeLabels.dark}
                                    </SelectItem>
                                    <SelectItem
                                        value="system"
                                        className={selectItemClassName}
                                    >
                                        {themeLabels.system}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />

                    <SettingRow
                        label={t("appearance.language.label")}
                        description={t("appearance.language.description")}
                        isPending={isSettingPending("language")}
                        isDisabled={isAnySettingPending}
                        control={
                            <Select
                                value={settings.language}
                                onValueChange={(value) => {
                                    if (value) {
                                        updateSetting(
                                            "language",
                                            value as UserSettings["language"],
                                        );
                                    }
                                }}
                                disabled={isAnySettingPending}
                            >
                                <SelectTrigger
                                    className={selectTriggerClassName}
                                >
                                    <SelectValue>
                                        {languageLabels[settings.language]}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent
                                    dir={isRtl ? "rtl" : "ltr"}
                                    side="bottom"
                                    sideOffset={8}
                                    align="start"
                                    alignItemWithTrigger={false}
                                    className="duration-150"
                                >
                                    <SelectItem
                                        value="en"
                                        className={selectItemClassName}
                                    >
                                        {languageLabels.en}
                                    </SelectItem>
                                    <SelectItem
                                        value="ar"
                                        className={selectItemClassName}
                                    >
                                        {languageLabels.ar}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />
                </SettingsSection>

                <SettingsSection
                    id="privacy"
                    icon={ShieldCheck}
                    title={t("privacy.title")}
                    description={t("privacy.description")}
                >
                    <SettingRow
                        label={t("privacy.privateProfile.label")}
                        description={t("privacy.privateProfile.description")}
                        controlId="setting-private-profile"
                        isPending={isSettingPending("isPrivateProfile")}
                        isDisabled={isAnySettingPending}
                        onActivate={() =>
                            updateSetting(
                                "isPrivateProfile",
                                !settings.isPrivateProfile,
                            )
                        }
                        control={
                            <Switch
                                id="setting-private-profile"
                                className={switchClassName}
                                checked={settings.isPrivateProfile}
                                onCheckedChange={(checked) => {
                                    updateSetting("isPrivateProfile", checked);
                                }}
                                disabled={isAnySettingPending}
                                aria-label={t("privacy.privateProfile.label")}
                            />
                        }
                    />

                    <SettingRow
                        label={t("privacy.showEmail.label")}
                        description={t("privacy.showEmail.description")}
                        controlId="setting-show-email"
                        isPending={isSettingPending("showEmail")}
                        isDisabled={isAnySettingPending}
                        onActivate={() =>
                            updateSetting("showEmail", !settings.showEmail)
                        }
                        control={
                            <Switch
                                id="setting-show-email"
                                className={switchClassName}
                                checked={settings.showEmail}
                                onCheckedChange={(checked) => {
                                    updateSetting("showEmail", checked);
                                }}
                                disabled={isAnySettingPending}
                                aria-label={t("privacy.showEmail.label")}
                            />
                        }
                    />

                </SettingsSection>

                <SettingsSection
                    id="friend-requests"
                    icon={UserPlus}
                    title={t("friendRequests.title")}
                    description={t("friendRequests.description")}
                >
                    <SettingRow
                        label={t("friendRequests.allow.label")}
                        description={t("friendRequests.allow.description")}
                        controlId="setting-allow-friend-requests"
                        isPending={isSettingPending("allowFriendRequests")}
                        isDisabled={isAnySettingPending}
                        onActivate={() =>
                            updateSetting(
                                "allowFriendRequests",
                                !settings.allowFriendRequests,
                            )
                        }
                        control={
                            <Switch
                                id="setting-allow-friend-requests"
                                className={switchClassName}
                                checked={settings.allowFriendRequests}
                                onCheckedChange={(checked) => {
                                    updateSetting(
                                        "allowFriendRequests",
                                        checked,
                                    );
                                }}
                                disabled={isAnySettingPending}
                                aria-label={t("friendRequests.allow.label")}
                            />
                        }
                    />
                </SettingsSection>

                <SettingsSection
                    id="notifications"
                    icon={Bell}
                    title={t("notifications.title")}
                    description={t("notifications.description")}
                >
                    <SettingRow
                        label={t("notifications.enabled.label")}
                        description={t("notifications.enabled.description")}
                        controlId="setting-notifications-enabled"
                        isPending={isSettingPending("notificationsEnabled")}
                        isDisabled={isAnySettingPending}
                        onActivate={() =>
                            updateSetting(
                                "notificationsEnabled",
                                !settings.notificationsEnabled,
                            )
                        }
                        control={
                            <Switch
                                id="setting-notifications-enabled"
                                className={switchClassName}
                                checked={settings.notificationsEnabled}
                                onCheckedChange={(checked) => {
                                    updateSetting(
                                        "notificationsEnabled",
                                        checked,
                                    );
                                }}
                                disabled={isAnySettingPending}
                                aria-label={t("notifications.enabled.label")}
                            />
                        }
                    />
                </SettingsSection>
            </div>
        </div>
    );
}
