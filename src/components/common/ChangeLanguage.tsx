import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
   DEFAULT_LOCALE,
   LANG_DIR,
   LOCALE_INFO,
   SUPPORTED_LOCALES,
} from "@/constants/i18nConfig";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateSettings } from "@/features/profile/hooks/useUpdateSettings";
import { cn } from "@/lib/utils";

const ChangeLanguage = () => {
   const { i18n } = useTranslation();
   const { user } = useAuth();

   const updateSettingsMutation =
      useUpdateSettings();

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
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-2 py-1 shadow-sm">
         <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Lang
         </span>

         <div className="flex items-center rounded-full bg-muted/70 p-0.5">
            {SUPPORTED_LOCALES.map(
               (locale) => {
                  const isActive =
                     locale === currentLocale;

                  return (
                     <Button
                        key={locale}
                        type="button"
                        variant={
                           isActive
                              ? "secondary"
                              : "ghost"
                        }
                        size="xs"
                        onClick={() => {
                           handleChangeLanguage(
                              locale,
                           );
                        }}
                        disabled={
                           updateSettingsMutation.isPending
                        }
                        className={cn(
                           "rounded-full px-2.5 text-[0.65rem] font-semibold tracking-wide",
                           isActive
                              ? "shadow-sm"
                              : "text-foreground/70 hover:text-foreground",
                        )}
                     >
                        <span className="font-heading">
                           {
                              LOCALE_INFO[locale]
                                 .name
                           }
                        </span>
                     </Button>
                  );
               },
            )}
         </div>
      </div>
   );
};

export default ChangeLanguage;