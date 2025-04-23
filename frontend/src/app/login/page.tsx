'use client';

import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            const res = await api.post("/login", data, { withCredentials: true })
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Head>
                <title>Log In</title>
            </Head>
            <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Log In</h2>

                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">Log In</Button>
                        </form>
                    </Form>

                    <div className="my-6 text-center text-gray-400 text-sm dark:text-gray-500">or continue with</div>

                    {/* <div className="flex flex-col gap-4">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Image src="/google_logo.svg" alt="google" className="h-5" />
                            <span>Google</span>
                        </Button>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Image src="/apple.svg" alt="apple" className="h-5" />
                            <span>Apple</span>
                        </Button>
                    </div> */}
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don&apos;t have an account?
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}