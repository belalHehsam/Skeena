import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Compass,
    Users,
    PlusSquare,
    User,
    LogOut,
    X,
} from "lucide-react";
import { Button } from "../ui/button";

const navLinks = [
    { name: "Home Feed", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Create Post", href: "/create", icon: PlusSquare },
];

interface SidebarProps {
    onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
    const location = useLocation();

    return (
        <aside className="flex h-full w-64 flex-col border-r rtl:border-l rtl:border-r-0 bg-background">
            {/* Logo */}
            <div className="flex pt-4 items-center justify-between px-6">
                <Link to="/" className="text-2xl font-heading gap-2 flex items-center font-bold text-primary" onClick={onClose}>
                <img src="/logo-icon.png" alt="" className="w-16" />
                    Majlis
                </Link>
                {onClose && (
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-2 p-4">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`flex items-center gap-3  rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex flex-col gap-2 p-4 mt-auto">
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        location.pathname === "/profile"
                            ? "bg-primary/10 text-primary border-r-4 rtl:border-l-4 rtl:border-r-0 border-primary"
                            : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                    }`}
                >
                    <User className="h-5 w-5" />
                    Profile
                </Link>
                <button
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
