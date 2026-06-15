import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="auth-pattern min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <main className="flex min-h-screen items-center justify-center px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}