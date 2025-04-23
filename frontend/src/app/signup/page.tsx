'use client';

import { useForm } from "react-hook-form";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { api } from "@/lib/axios";
import Link from "next/link";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
    dateOfBirth: z.date({ required_error: "Date of Birth is required" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export default function SignUp() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            dateOfBirth: undefined,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { confirmPassword: _unused, ...sendData } = data;
        
        // Format date as ISO string for Go's time.Time compatibility
        const formattedData = {
            ...sendData,
            dateOfBirth: sendData.dateOfBirth.toISOString()
        };
        
        try {
            const res = await api.post("/signup", formattedData);
            console.log(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Head>
                <title>Signup Page</title>
            </Head>
            <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Create Account</h2>

                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                <Input type={showPassword ? "text" : "password"} {...field} />
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

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-2"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DatePicker
                                                    selected={field.value}
                                                    onChange={(date: Date | null, _event?: React.SyntheticEvent<Element, Event>) => {
                                                        if (date) {
                                                            field.onChange(date);
                                                        }
                                                    }}
                                                    dateFormat="MMMM d, yyyy"
                                                    placeholderText="Select date of birth"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                                    maxDate={new Date()}
                                                    calendarClassName="bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">Sign Up</Button>
                        </form>
                    </Form>

                    <div className="my-6 text-center text-gray-400 text-sm dark:text-gray-500">or continue with</div>

                    <div id="g_id_onload" data-client_id="YOUR_GOOGLE_CLIENT_ID" data-callback="handleGoogleResponse" data-auto_prompt="false"></div>
                    {/* <div className="flex flex-col gap-4">
                        <div className="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left"></div>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Image src="/apple.svg" alt="apple" className="h-5" />
                            <span>Apple</span>
                        </Button>
                    </div> */}
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}