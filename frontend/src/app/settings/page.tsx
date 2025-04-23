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

const Settings = () => {
  const { data: user, isLoading, isError } = useUser();
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !user) return <p>Failed to load user data.</p>;

  const handleLogout = async () => {
    try {
      await api.post("/logoutFromAllDevices");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-gray-300 dark:border-gray-700">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Account Settings</CardTitle>
            <div className="flex justify-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatarUrl || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Email</Label>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/settings/change-email">Change</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/settings/change-password">Change</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Date of Birth</Label>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/settings/change-dob">Update</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Logout from All Devices</Label>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Settings;
