import { useEffect } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   DEFAULT_LOCALE,
   LANG_DIR,
   LOCALE_INFO,
   SUPPORTED_LOCALES,
} from "@/constants/i18nConfig";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
   SETTINGS_MUTATION_KEY,
   useUpdateSettings,
} from "@/features/profile/hooks/useUpdateSettings";

const ChangeLanguage = () => {
   const { i18n } = useTranslation();
   const { user } = useAuth();

   const updateSettingsMutation = useUpdateSettings();
   const isAnySettingPending =
      useIsMutating({ mutationKey: SETTINGS_MUTATION_KEY }) > 0;

   const rawLocale =
      i18n.resolvedLanguage ??
      i18n.language ??
      DEFAULT_LOCALE;

   const shortLocale =
      rawLocale.split("-")[0] as Locale;

   const currentLocale =
      SUPPORTED_LOCALES.includes(
         shortLocale,
      )
         ? shortLocale
         : DEFAULT_LOCALE;

   useEffect(() => {
      document.documentElement.lang =
         currentLocale;

      document.documentElement.dir =
         LANG_DIR[currentLocale];
   }, [currentLocale]);

   const handleChangeLanguage = async (
      locale: Locale,
   ) => {
      if (locale === currentLocale) {
         return;
      }

      if (isAnySettingPending) {
         return;
      }

      const previousLocale =
         currentLocale;

      await i18n.changeLanguage(locale);

      if (user) {
         updateSettingsMutation.mutate(
            {
               language: locale,
            },
            {
               onError: () => {
                  void i18n.changeLanguage(
                     previousLocale,
                  );
               },
            },
         );
      }
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            disabled={isAnySettingPending}
            className="inline-flex items-center justify-center h-8 gap-2 rounded-lg border border-neutral-200 bg-white/70 px-3 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-md transition-all hover:bg-neutral-50 hover:text-neutral-900 focus-visible:ring-1 focus-visible:ring-primary dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 cursor-pointer outline-none"
         >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span className="font-heading">
               {LOCALE_INFO[currentLocale].name}
            </span>
            <ChevronDown className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
         </DropdownMenuTrigger>
         
         <DropdownMenuContent
            align="end"
            className="w-36 rounded-xl border border-neutral-200 bg-white p-1 shadow-md dark:border-neutral-800 dark:bg-neutral-950"
         >
            {SUPPORTED_LOCALES.map((locale) => {
               const isActive = locale === currentLocale;

               return (
                  <DropdownMenuItem
                     key={locale}
                     onClick={() => handleChangeLanguage(locale)}
                     className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors focus:bg-neutral-100 focus:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-100"
                  >
                     <span className={isActive ? "font-semibold text-primary" : "text-neutral-600 dark:text-neutral-400"}>
                        {LOCALE_INFO[locale].name}
                     </span>
                     {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
               );
            })}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default ChangeLanguage;
