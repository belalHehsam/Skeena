import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/common/TextField";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/constants/authSchema";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { from?: { pathname?: string } } | null;
  const redirectTo = state?.from?.pathname ?? "/";

  const loginMutation = useLogin({
    onSuccess: () => {
      navigate(redirectTo, { replace: true });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate({
      payload: {
        email: values.email,
        password: values.password,
      },
      rememberMe: values.rememberMe,
    });
  }

  return (
    <section className="w-full max-w-105">
      <div className="mb-5 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-3 flex size-12 items-center justify-center rounded-full">
          <img src="/logo-icon.png" alt="Majlis" className="size-8" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
          Majlis
        </h1>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Welcome to your community of Sakina.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            startIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Password
              </label>

              <Link
                to="#"
                className="text-primary text-[11px] font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              startIcon={<Lock className="size-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
          </div>

          <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              className="accent-primary size-3.5 rounded border-neutral-300 dark:border-neutral-700"
              {...register("rememberMe")}
            />
            Keep me signed in
          </label>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary-600 h-10 w-full rounded-md text-sm font-semibold text-white"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-neutral-600 dark:text-neutral-400">
        New to Majlis?{" "}
        <Link
          to="/register"
          className="text-primary font-semibold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}
