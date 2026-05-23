import { Search, Bell, Settings, Menu } from "lucide-react";
import { Button } from "../ui/button";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4 lg:px-6">
            {/* Mobile Menu Button & Search */}
            <div className="flex flex-1 items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden text-neutral-600" 
                    onClick={onMenuClick}
                >
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                <div className="relative w-full  max-w-md hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-full rounded-full border border-input bg-neutral-50 px-9 py-1 text-sm  transition-colors placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-neutral-600">
                    <Bell className="size-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                
                <Button variant="ghost" size="icon" className="text-neutral-600">
                    <Settings className="size-5" />
                    <span className="sr-only">Settings</span>
                </Button>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary cursor-pointer hover:bg-primary/30 transition-colors">
                    AL
                </div>
            </div>
        </header>
    );
}
