import Link from "next/link";
import { BookOpen, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold font-heading text-slate-900">SkillBridge</span>
                        </div>
                        <p className="text-sm text-slate-600 max-w-xs">
                            Connecting ambitious students with expert tutors for personalized learning experiences.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Platform</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><Link href="/tutors" className="hover:text-primary">Find Tutors</Link></li>
                            <li><Link href="/register?role=TUTOR" className="hover:text-primary">Become a Tutor</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-primary">How it Works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Support</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-primary">Safety</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Connect</h3>
                        <div className="mt-4 flex space-x-4">
                            <Link href="#" className="text-slate-400 hover:text-slate-600">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-slate-600">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-slate-600">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
