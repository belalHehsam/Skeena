import { Outlet } from "react-router-dom";
import ChangeLanguage from "@/components/common/ChangeLanguage";

export default function AuthLayout() {
    return (
        <div className="auth-pattern relative min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <div className="absolute right-4 top-4 z-50 rtl:left-4 rtl:right-auto">
                <ChangeLanguage />
            </div>
            <main className="flex min-h-screen items-center justify-center px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}