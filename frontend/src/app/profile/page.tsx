'use client';

import Head from "next/head";
import { useUser } from "@/hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";

const Profile = () => {
    const { data: user, isLoading, isError } = useUser();
    const router = useRouter();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Failed to load user data.</p>;

    console.log("data", user);
    const handleLogout = async () => {
        try {
            await api.post("/logout");
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
        <Navbar />
            <Head>
                <title>Profile</title>
            </Head>
            <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">

                        <div className="flex justify-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.avatarUrl || "/default-avatar.png"} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <p className="text-gray-700 dark:text-gray-300">{user.name}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
                        </div>
                        {/* You can add more profile information here */}
                        <div className="flex justify-between mt-6">
                            <Button variant="outline" className="bg-[var(--danger)] text-[var(--text)]" onClick={handleLogout}>Logout</Button>
                            <Link href="/settings">
                                <Button variant="outline">Settings</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
};

export default Profile;