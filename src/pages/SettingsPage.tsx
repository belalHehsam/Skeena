import { useEffect, useState } from "react";
import {
    AtSign,
    Bell,
    type LucideIcon,
    Palette,
    Settings,
    ShieldCheck,
    UserPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { UserSettings } from "@/features/auth/types/auth";
import { SettingRow } from "@/features/profile/components/SettingRow";
import { SettingsSection } from "@/features/profile/components/SettingsSection";
import { useUpdateSettings } from "@/features/profile/hooks/useUpdateSettings";
import { useDarkMode } from "@/components/context/DarkModeContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { LANG_DIR } from "@/constants/i18nConfig";

const SETTINGS_SECTION_IDS = [
    "appearance",
    "privacy",
    "friend-requests",
    "notifications",
    "mentions",
] as const;

type SettingsSectionId = (typeof SETTINGS_SECTION_IDS)[number];

type SettingsNavItem = {
    id: SettingsSectionId;
    title: string;
    icon: LucideIcon;
};

export default function SettingsPage() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation("settings");
    const { setMode } = useDarkMode();
    const [activeSection, setActiveSection] =
        useState<SettingsSectionId>("appearance");
    const userId = user?.id;

    const updateSettingsMutation = useUpdateSettings();

    useEffect(() => {
        if (!userId) {
            return;
        }

        const sections = SETTINGS_SECTION_IDS.map((sectionId) =>
            document.getElementById(sectionId),
        ).filter((section): section is HTMLElement => Boolean(section));

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (first, second) =>
                            first.boundingClientRect.top -
                            second.boundingClientRect.top,
                    )[0];

                if (visibleSection) {
                    setActiveSection(
                        visibleSection.target.id as SettingsSectionId,
                    );
                }
            },
            {
                rootMargin: "-18% 0px -68% 0px",
                threshold: 0,
            },
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [userId]);

    if (!user) {
        return null;
    }

    const settings = user.settings;
    const isRtl = i18n.dir() === "rtl";

    const navItems: SettingsNavItem[] = [
        {
            id: "appearance",
            title: t("appearance.title"),
            icon: Palette,
        },
        {
            id: "privacy",
            title: t("privacy.title"),
            icon: ShieldCheck,
        },
        {
            id: "friend-requests",
            title: t("friendRequests.title"),
            icon: UserPlus,
        },
        {
            id: "notifications",
            title: t("notifications.title"),
            icon: Bell,
        },
        {
            id: "mentions",
            title: t("mentions.title"),
            icon: AtSign,
        },
    ];

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
        "relative h-9 min-w-36 bg-neutral-50 pe-7 transition-colors duration-200 hover:border-primary/50 hover:bg-white disabled:opacity-100 [&>svg]:absolute [&>svg]:end-2 rtl:[&_[data-slot=select-value]]:text-right dark:bg-neutral-900 dark:hover:bg-neutral-950";

    const selectItemClassName =
        "pe-8 text-start rtl:[&>span:last-child]:right-auto rtl:[&>span:last-child]:left-2";

    const switchClassName =
        "transition-colors duration-200 data-disabled:opacity-100 [&_[data-slot=switch-thumb]]:duration-200";

    return (
        <div className="mx-auto w-full max-w-6xl pb-8 rtl:[&_[data-slot=switch-thumb][data-checked]]:-translate-x-[calc(100%-2px)]">
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

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="hidden lg:block">
                    <nav
                        className="sticky top-24 space-y-1"
                        aria-label={t("title")}
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    aria-current={
                                        isActive ? "location" : undefined
                                    }
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setActiveSection(item.id);
                                        document
                                            .getElementById(item.id)
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            });
                                    }}
                                    className={cn(
                                        "focus-visible:ring-primary/30 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors outline-none hover:bg-neutral-100 hover:text-neutral-950 focus-visible:ring-2 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50",
                                        isActive &&
                                            "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:bg-primary/15 dark:text-primary",
                                    )}
                                >
                                    <Icon
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    <span>{item.title}</span>
                                </a>
                            );
                        })}
                    </nav>
                </aside>

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
                                    disabled={isSettingPending("theme")}
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
                                    disabled={isSettingPending("language")}
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
                            description={t(
                                "privacy.privateProfile.description",
                            )}
                            controlId="setting-private-profile"
                            isPending={isSettingPending("isPrivateProfile")}
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
                                        updateSetting(
                                            "isPrivateProfile",
                                            checked,
                                        );
                                    }}
                                    disabled={isSettingPending(
                                        "isPrivateProfile",
                                    )}
                                    aria-label={t(
                                        "privacy.privateProfile.label",
                                    )}
                                />
                            }
                        />

                        <SettingRow
                            label={t("privacy.showEmail.label")}
                            description={t("privacy.showEmail.description")}
                            controlId="setting-show-email"
                            isPending={isSettingPending("showEmail")}
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
                                    disabled={isSettingPending("showEmail")}
                                    aria-label={t("privacy.showEmail.label")}
                                />
                            }
                        />

                        <SettingRow
                            label={t("privacy.showOnlineStatus.label")}
                            description={t(
                                "privacy.showOnlineStatus.description",
                            )}
                            controlId="setting-show-online-status"
                            isPending={isSettingPending("showOnlineStatus")}
                            onActivate={() =>
                                updateSetting(
                                    "showOnlineStatus",
                                    !settings.showOnlineStatus,
                                )
                            }
                            control={
                                <Switch
                                    id="setting-show-online-status"
                                    className={switchClassName}
                                    checked={settings.showOnlineStatus}
                                    onCheckedChange={(checked) => {
                                        updateSetting(
                                            "showOnlineStatus",
                                            checked,
                                        );
                                    }}
                                    disabled={isSettingPending(
                                        "showOnlineStatus",
                                    )}
                                    aria-label={t(
                                        "privacy.showOnlineStatus.label",
                                    )}
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
                                    disabled={isSettingPending(
                                        "allowFriendRequests",
                                    )}
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
                                    disabled={isSettingPending(
                                        "notificationsEnabled",
                                    )}
                                    aria-label={t(
                                        "notifications.enabled.label",
                                    )}
                                />
                            }
                        />
                    </SettingsSection>

                    <SettingsSection
                        id="mentions"
                        icon={AtSign}
                        title={t("mentions.title")}
                        description={t("mentions.description")}
                    >
                        <SettingRow
                            label={t("mentions.allowTagging.label")}
                            description={t("mentions.allowTagging.description")}
                            controlId="setting-allow-tagging"
                            isPending={isSettingPending("allowTagging")}
                            onActivate={() =>
                                updateSetting(
                                    "allowTagging",
                                    !settings.allowTagging,
                                )
                            }
                            control={
                                <Switch
                                    id="setting-allow-tagging"
                                    className={switchClassName}
                                    checked={settings.allowTagging}
                                    onCheckedChange={(checked) => {
                                        updateSetting("allowTagging", checked);
                                    }}
                                    disabled={isSettingPending("allowTagging")}
                                    aria-label={t(
                                        "mentions.allowTagging.label",
                                    )}
                                />
                            }
                        />
                    </SettingsSection>
                </div>
            </div>
        </div>
    );
}
