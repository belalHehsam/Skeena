import { customFetch } from "@/services/customFetch";
import type {
    AuthPayload,
    JSendSuccess,
    LoginRequest,
    MePayload,
    RegisterRequest,
} from "../types/auth";

export async function loginRequest(payload: LoginRequest) {
    const response = await customFetch<JSendSuccess<AuthPayload>>(
        "/api/auth/login",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return response.data;
}

export async function registerRequest(payload: RegisterRequest) {
    const response = await customFetch<JSendSuccess<AuthPayload>>(
        "/api/auth/register",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return response.data;
}

export async function getMeRequest() {
    const response = await customFetch<JSendSuccess<MePayload>>("/api/auth/me");

    return response.data;
}

export async function logoutRequest() {
    const response = await customFetch<JSendSuccess<{ message: string }>>(
        "/api/auth/logout",
        {
            method: "POST",
        },
    );

    return response.data;
}