"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
            <nav className="max-w-7xl mx-auto px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/20 flex justify-between items-center">
                <Link 
                    href="/" 
                    className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
                >
                    Stock Tracker
                </Link>
                
                <div className="flex gap-6">
                    <NavLink href="/" active={pathname === "/"}>
                        Home
                    </NavLink>
                    <NavLink href="/stocks" active={pathname.startsWith("/stocks")}>
                        Track Stocks
                    </NavLink>
                    <NavLink href="/profile" active={pathname === "/profile"}>
                        Profile
                    </NavLink>
                </div>
            </nav>
        </div>
    );
}

interface NavLinkProps {
    href: string;
    active?: boolean;
    children: React.ReactNode;
}

const NavLink = ({ href, active, children }: NavLinkProps) => (
    <Link
        href={href}
        className={cn(
            "relative px-2 py-1 transition-colors duration-200",
            "text-gray-600 hover:text-indigo-600",
            active && "text-indigo-600 font-medium",
            active && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full"
        )}
    >
        {children}
    </Link>
);