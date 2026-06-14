/* eslint-disable react-refresh/only-export-components */

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type ThemeMode =
	| "light"
	| "dark"
	| "system";

type ResolvedThemeMode =
	Exclude<ThemeMode, "system">;

type DarkModeContextValue = {
	mode: ThemeMode;
	resolvedMode: ResolvedThemeMode;
	isDark: boolean;
	setMode: (mode: ThemeMode) => void;
	toggle: () => void;
};

const DarkModeContext =
	createContext<DarkModeContextValue | undefined>(
		undefined,
	);

const STORAGE_KEY = "majlis-theme";
const SYSTEM_THEME_QUERY =
	"(prefers-color-scheme: dark)";

function getSystemMode(): ResolvedThemeMode {
	if (typeof window === "undefined") {
		return "light";
	}

	return window.matchMedia(
		SYSTEM_THEME_QUERY,
	).matches
		? "dark"
		: "light";
}

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") {
		return "system";
	}

	const saved =
		window.localStorage.getItem(STORAGE_KEY);

	if (
		saved === "light" ||
		saved === "dark" ||
		saved === "system"
	) {
		return saved;
	}

	return "system";
}

type DarkModeProviderProps = {
	children: ReactNode;
};

function DarkModeProvider({
	children,
}: DarkModeProviderProps) {
	const [mode, setMode] =
		useState<ThemeMode>(getInitialMode);

	const [systemMode, setSystemMode] =
		useState<ResolvedThemeMode>(() => getSystemMode());

	useEffect(() => {
		const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

		const handleSystemThemeChange = (
			event: MediaQueryListEvent,
		) => {
			const nextSystemMode: ResolvedThemeMode =
				event.matches ? "dark" : "light";

			setSystemMode(nextSystemMode);
		};

		mediaQuery.addEventListener(
			"change",
			handleSystemThemeChange,
		);

		return () => {
			mediaQuery.removeEventListener(
				"change",
				handleSystemThemeChange,
			);
		};
	}, []);

	const resolvedMode =
		mode === "system" ? systemMode : mode;

	useEffect(() => {
		const root = document.documentElement;

		root.classList.toggle(
			"dark",
			resolvedMode === "dark",
		);

		root.style.colorScheme = resolvedMode;

		window.localStorage.setItem(
			STORAGE_KEY,
			mode,
		);
	}, [mode, resolvedMode]);

	const value =
		useMemo<DarkModeContextValue>(
			() => ({
				mode,
				resolvedMode,
				isDark: resolvedMode === "dark",
				setMode,

				toggle: () => {
					setMode(
						resolvedMode === "dark"
							? "light"
							: "dark",
					);
				},
			}),
			[mode, resolvedMode],
		);

	return (
		<DarkModeContext.Provider value={value}>
			{children}
		</DarkModeContext.Provider>
	);
}

function useDarkMode() {
	const context =
		useContext(DarkModeContext);

	if (!context) {
		throw new Error(
			"useDarkMode must be used within DarkModeProvider",
		);
	}

	return context;
}

export {
	DarkModeProvider,
	useDarkMode,
};