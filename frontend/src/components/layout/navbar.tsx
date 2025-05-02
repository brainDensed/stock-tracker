"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full px-6 py-4 bg-white shadow-md flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
                Stock Tracker
            </Link>
            <div className="flex gap-4">
                <>
                    <Link href="/flights" className="text-gray-700 hover:text-indigo-600">
                        Book Flights
                    </Link>
                </>
            </div>
        </nav>
    );
}
