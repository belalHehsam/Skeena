import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/common/TextField";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/constants/authSchema";
import { useRegister } from "@/features/auth/hooks/useRegister";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const registerMutation = useRegister({
    onSuccess: () => {
      navigate("/", { replace: true });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate({
      payload: {
        username: values.username,
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      rememberMe: true,
    });
  }

  return (
    <section className="w-full max-w-[460px]">
      <div className="mb-5 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-3 flex size-12 items-center justify-center rounded-full">
          <img src="/logo-icon.png" alt="Majlis" className="size-8" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
          {t("register.title")}
        </h1>

        <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          {t("register.welcome")}
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            id="displayName"
            label={t("register.fullNameLabel")}
            type="text"
            placeholder={t("register.fullNamePlaceholder")}
            autoComplete="name"
            startIcon={<User className="size-4" />}
            error={errors.displayName?.message}
            {...register("displayName")}
          />

          <TextField
            id="username"
            label={t("register.usernameLabel")}
            type="text"
            placeholder={t("register.usernamePlaceholder")}
            autoComplete="username"
            startIcon={<User className="size-4" />}
            error={errors.username?.message}
            {...register("username")}
          />

          <TextField
            id="email"
            label={t("register.emailLabel")}
            type="email"
            placeholder={t("register.emailPlaceholder")}
            autoComplete="email"
            startIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="password"
              label={t("register.passwordLabel")}
              type={showPassword ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
              autoComplete="new-password"
              startIcon={<Lock className="size-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  aria-label={showPassword ? t("hidePassword", { defaultValue: "Hide password" }) : t("showPassword", { defaultValue: "Show password" })}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />

            <TextField
              id="confirmPassword"
              label={t("register.confirmPasswordLabel")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("register.confirmPasswordPlaceholder")}
              autoComplete="new-password"
              startIcon={<Lock className="size-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="rounded-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  aria-label={
                    showConfirmPassword ? t("hidePassword", { defaultValue: "Hide password" }) : t("showPassword", { defaultValue: "Show password" })
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>

          <div>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                className="accent-primary mt-0.5 size-3.5 rounded border-neutral-300 dark:border-neutral-700"
                {...register("acceptTerms")}
              />

              <span>
                {t("register.termsText")}
                <span className="text-primary font-semibold">{t("register.respect")}</span>,{" "}
                <span className="text-primary font-semibold">{t("register.sakina")}</span>, {t("register.and")}
                <span className="text-primary font-semibold">{t("register.truthfulness")}</span>.
              </span>
            </label>

            {errors.acceptTerms?.message && (
              <p className="text-destructive mt-1 text-xs font-medium">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary-600 h-10 w-full rounded-md text-sm font-semibold text-white"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? t("register.submitting") : t("register.submit")}
          </Button>
        </form>

        <div className="my-5 h-px bg-neutral-200 dark:bg-neutral-800" />

        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {t("register.alreadyMember")}{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            {t("register.signIn")}
          </Link>
        </p>
      </div>
    </section>
  );
}
