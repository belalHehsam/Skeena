import { useTranslation } from "react-i18next";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { UserSettings } from "@/features/auth/types/auth";
import { SettingRow } from "@/features/profile/components/SettingRow";
import { SettingsSection } from "@/features/profile/components/SettingsSection";
import { useUpdateSettings } from "@/features/profile/hooks/useUpdateSettings";

export default function SettingsPage() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation("settings");
    const { setMode } = useDarkMode();

    const updateSettingsMutation =
        useUpdateSettings();

    if (!user) {
        return null;
    }

    const settings = user.settings;

    const themeLabels: Record<
        UserSettings["theme"],
        string
    > = {
        light: t("appearance.theme.options.light"),
        dark: t("appearance.theme.options.dark"),
        system: t("appearance.theme.options.system"),
    };

    const languageLabels: Record<
        UserSettings["language"],
        string
    > = {
        en: t("appearance.language.options.en"),
        ar: t("appearance.language.options.ar"),
    };

    function applyLanguage(
        language: UserSettings["language"],
    ) {
        void i18n.changeLanguage(language);

        document.documentElement.lang = language;
        document.documentElement.dir =
            LANG_DIR[language];
    }

    function updateSetting<
        K extends keyof UserSettings,
    >(
        key: K,
        value: UserSettings[K],
    ) {
        const previousValue = settings[key];

        if (key === "theme") {
            setMode(value as UserSettings["theme"]);
        }

        if (key === "language") {
            applyLanguage(
                value as UserSettings["language"],
            );
        }

        updateSettingsMutation.mutate(
            {
                [key]: value,
            } as Pick<UserSettings, K>,
            {
                onError: () => {
                    if (key === "theme") {
                        setMode(
                            previousValue as UserSettings["theme"],
                        );
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

    const disabled =
        updateSettingsMutation.isPending;

    return (
        <div className="mx-auto animate-fade-in w-full max-w-4xl space-y-6 pb-8 rtl:[&_[data-slot=switch-thumb][data-checked]]:-translate-x-[calc(100%-2px)]">
            <header>
                <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                    {t("title")}
                </h1>

                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {t("description")}
                </p>
            </header>

            <SettingsSection
                title={t("appearance.title")}
                description={t("appearance.description")}
            >
                <SettingRow
                    label={t("appearance.theme.label")}
                    description={t(
                        "appearance.theme.description",
                    )}
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
                            disabled={disabled}
                        >
                            <SelectTrigger className="relative h-9 min-w-32 bg-neutral-50 pe-7 [&>svg]:absolute [&>svg]:end-2 rtl:[&_[data-slot=select-value]]:text-right dark:bg-neutral-900">
                                <SelectValue>
                                    {themeLabels[settings.theme]}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="light">
                                    {themeLabels.light}
                                </SelectItem>

                                <SelectItem value="dark">
                                    {themeLabels.dark}
                                </SelectItem>

                                <SelectItem value="system">
                                    {themeLabels.system}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    }
                />

                <SettingRow
                    label={t("appearance.language.label")}
                    description={t(
                        "appearance.language.description",
                    )}
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
                            disabled={disabled}
                        >
                            <SelectTrigger className="relative h-9 min-w-32 bg-neutral-50 pe-7 [&>svg]:absolute [&>svg]:end-2 rtl:[&_[data-slot=select-value]]:text-right dark:bg-neutral-900">
                                <SelectValue>
                                    {languageLabels[settings.language]}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="en">
                                    {languageLabels.en}
                                </SelectItem>

                                <SelectItem value="ar">
                                    {languageLabels.ar}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    }
                />
            </SettingsSection>

            <SettingsSection
                title={t("privacy.title")}
                description={t("privacy.description")}
            >
                <SettingRow
                    label={t(
                        "privacy.privateProfile.label",
                    )}
                    description={t(
                        "privacy.privateProfile.description",
                    )}
                    control={
                        <Switch
                            checked={
                                settings.isPrivateProfile
                            }
                            onCheckedChange={(checked) => {
                                updateSetting(
                                    "isPrivateProfile",
                                    checked,
                                );
                            }}
                            disabled={disabled}
                            aria-label={t(
                                "privacy.privateProfile.label",
                            )}
                        />
                    }
                />

                <SettingRow
                    label={t("privacy.showEmail.label")}
                    description={t(
                        "privacy.showEmail.description",
                    )}
                    control={
                        <Switch
                            checked={settings.showEmail}
                            onCheckedChange={(checked) => {
                                updateSetting(
                                    "showEmail",
                                    checked,
                                );
                            }}
                            disabled={disabled}
                            aria-label={t(
                                "privacy.showEmail.label",
                            )}
                        />
                    }
                />

                <SettingRow
                    label={t(
                        "privacy.showOnlineStatus.label",
                    )}
                    description={t(
                        "privacy.showOnlineStatus.description",
                    )}
                    control={
                        <Switch
                            checked={
                                settings.showOnlineStatus
                            }
                            onCheckedChange={(checked) => {
                                updateSetting(
                                    "showOnlineStatus",
                                    checked,
                                );
                            }}
                            disabled={disabled}
                            aria-label={t(
                                "privacy.showOnlineStatus.label",
                            )}
                        />
                    }
                />
            </SettingsSection>

            <SettingsSection
                title={t("friendRequests.title")}
                description={t(
                    "friendRequests.description",
                )}
            >
                <SettingRow
                    label={t(
                        "friendRequests.allow.label",
                    )}
                    description={t(
                        "friendRequests.allow.description",
                    )}
                    control={
                        <Switch
                            checked={
                                settings.allowFriendRequests
                            }
                            onCheckedChange={(checked) => {
                                updateSetting(
                                    "allowFriendRequests",
                                    checked,
                                );
                            }}
                            disabled={disabled}
                            aria-label={t(
                                "friendRequests.allow.label",
                            )}
                        />
                    }
                />
            </SettingsSection>

            <SettingsSection
                title={t("notifications.title")}
                description={t(
                    "notifications.description",
                )}
            >
                <SettingRow
                    label={t(
                        "notifications.enabled.label",
                    )}
                    description={t(
                        "notifications.enabled.description",
                    )}
                    control={
                        <Switch
                            checked={
                                settings.notificationsEnabled
                            }
                            onCheckedChange={(checked) => {
                                updateSetting(
                                    "notificationsEnabled",
                                    checked,
                                );
                            }}
                            disabled={disabled}
                            aria-label={t(
                                "notifications.enabled.label",
                            )}
                        />
                    }
                />
            </SettingsSection>

            <SettingsSection
                title={t("mentions.title")}
                description={t("mentions.description")}
            >
                <SettingRow
                    label={t(
                        "mentions.allowTagging.label",
                    )}
                    description={t(
                        "mentions.allowTagging.description",
                    )}
                    control={
                        <Switch
                            checked={settings.allowTagging}
                            onCheckedChange={(checked) => {
                                updateSetting(
                                    "allowTagging",
                                    checked,
                                );
                            }}
                            disabled={disabled}
                            aria-label={t(
                                "mentions.allowTagging.label",
                            )}
                        />
                    }
                />
            </SettingsSection>
        </div>
    );
}
