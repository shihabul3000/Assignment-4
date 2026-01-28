"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../validators";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function RegisterForm() {
    const { register: registerUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "STUDENT",
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);
        try {
            await registerUser(data);
        } catch (error) {
            // Error handled in useAuth
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-heading">
                    Create Account
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Join SkillBridge today
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-blue-50">
                                <input type="radio" value="STUDENT" className="sr-only" {...register("role")} defaultChecked />
                                <span className="text-sm font-medium">Student</span>
                            </label>
                            <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-blue-50">
                                <input type="radio" value="TUTOR" className="sr-only" {...register("role")} />
                                <span className="text-sm font-medium">Tutor</span>
                            </label>
                        </div>
                        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Create Account
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
