import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthTextField } from "../components/AuthTextField";
import { loginSchema, type LoginFormValues } from "../schemas/authSchemas";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as { from?: { pathname?: string } } | null;
    const redirectTo = state?.from?.pathname ?? "/";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    });

    async function onSubmit(values: LoginFormValues) {
        try {
            await login(
                {
                    email: values.email,
                    password: values.password,
                },
                values.rememberMe,
            );

            toast.success("Welcome back");
            navigate(redirectTo, { replace: true });
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Login failed"));
        }
    }

    return (
        <section className="w-full max-w-[420px]">
            <div className="mb-5 flex flex-col items-center text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <img src="/logo-icon.png" alt="Majlis" className="size-8" />
                </div>

                <h1 className="font-heading text-2xl font-bold text-neutral-900">
                    Majlis
                </h1>

                <p className="mt-1 text-sm text-neutral-500">
                    Welcome to your community of Sakina.
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <AuthTextField
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
                                className="text-xs font-semibold text-neutral-800"
                            >
                                Password
                            </label>

                            <Link
                                to="#"
                                className="text-[11px] font-semibold text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <AuthTextField
                            id="password"
                            label=""
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            startIcon={<Lock className="size-4" />}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="rounded-sm text-neutral-500 hover:text-neutral-800"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
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

                    <label className="flex items-center gap-2 text-xs text-neutral-600">
                        <input
                            type="checkbox"
                            className="size-3.5 rounded border-neutral-300 accent-primary"
                            {...register("rememberMe")}
                        />
                        Keep me signed in
                    </label>

                    <Button
                        type="submit"
                        className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary-600"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>

            <p className="mt-5 text-center text-sm text-neutral-600">
                New to Majlis?{" "}
                <Link
                    to="/register"
                    className="font-semibold text-primary hover:underline"
                >
                    Create an account
                </Link>
            </p>
        </section>
    );
}