import { z } from "zod";

const usernameSchema = z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
    );

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "Password must contain at least one letter and one number",
    );

export const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean(),
});

export const registerSchema = z
    .object({
        displayName: z
            .string()
            .trim()
            .min(3, "Full name must be at least 3 characters")
            .max(40, "Full name must be at most 40 characters"),
        username: usernameSchema,
        email: z.string().trim().email("Enter a valid email address"),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Confirm password is required"),
        acceptTerms: z
            .boolean()
            .refine(Boolean, "You must accept the community values"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;