import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/common/TextField";
import {
    registerSchema,
    type RegisterFormValues,
} from "@/constants/authSchema";
import { useRegister } from "@/features/auth/hooks/useRegister";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

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
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <img src="/logo-icon.png" alt="Majlis" className="size-8" />
                </div>

                <h1 className="font-heading text-2xl font-bold text-neutral-900">
                    Join the Community
                </h1>

                <p className="mt-1 max-w-sm text-sm text-neutral-500">
                    Assalamu Alaikum! Welcome to a space of Sakina and respectful
                    connection.
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                        id="displayName"
                        label="Full Name"
                        type="text"
                        placeholder="E.g. Omar Farooq"
                        autoComplete="name"
                        startIcon={<User className="size-4" />}
                        error={errors.displayName?.message}
                        {...register("displayName")}
                    />

                    <TextField
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="E.g. omar_farooq"
                        autoComplete="username"
                        startIcon={<User className="size-4" />}
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="name@domain.com"
                        autoComplete="email"
                        startIcon={<Mail className="size-4" />}
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="new-password"
                            startIcon={<Lock className="size-4" />}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
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

                        <TextField
                            id="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm"
                            autoComplete="new-password"
                            startIcon={<Lock className="size-4" />}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (value) => !value,
                                        )
                                    }
                                    className="rounded-sm text-neutral-500 hover:text-neutral-800"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
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
                        <label className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600">
                            <input
                                type="checkbox"
                                className="mt-0.5 size-3.5 rounded border-neutral-300 accent-primary"
                                {...register("acceptTerms")}
                            />

                            <span>
                                I agree to uphold the community values of{" "}
                                <span className="font-semibold text-primary">
                                    respect
                                </span>
                                ,{" "}
                                <span className="font-semibold text-primary">
                                    Sakina
                                </span>
                                , and truthfulness.
                            </span>
                        </label>

                        {errors.acceptTerms?.message && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.acceptTerms.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-white hover:bg-primary-600"
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending
                            ? "Creating account..."
                            : "Register"}
                    </Button>
                </form>

                <div className="my-5 h-px bg-neutral-200" />

                <p className="text-center text-sm text-neutral-600">
                    Already a member?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-secondary-700 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </section>
    );
}