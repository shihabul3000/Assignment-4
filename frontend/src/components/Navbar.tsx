"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "./ui/Button";
import { Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold font-heading text-slate-900">SkillBridge</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-6">
                            <Link href="/tutors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Find Tutors
                            </Link>
                            <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                How it Works
                            </Link>

                            {isAuthenticated && user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-slate-700">
                                        Hello, {user.name.split(' ')[0]}
                                    </span>
                                    <Link href={user.role === 'TUTOR' ? '/tutor/dashboard' : user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                                        <Button variant="outline" size="sm">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Log in</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        <Link
                            href="/tutors"
                            className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-slate-50 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Find Tutors
                        </Link>
                        <Link
                            href="/#categories"
                            className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-slate-50 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Subjects
                        </Link>
                        {!isAuthenticated && (
                            <>
                                <Link
                                    href="/login"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-slate-50 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-slate-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <>
                                <Link
                                    href={user?.role === 'TUTOR' ? '/tutor/dashboard' : '/dashboard'}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-slate-50 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-slate-50 hover:text-primary"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
