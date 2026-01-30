import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, Star, Users, Brain, Sparkles, CheckCircle, BookOpen, User } from "lucide-react";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-primary font-medium w-fit">
                                New way to learn
                            </div>
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-heading text-slate-900">
                                Unlock Your Potential with Expert Tutors
                            </h1>
                            <p className="max-w-[600px] text-slate-600 md:text-xl">
                                Connect with top-rated tutors for personalized learning in Math, Science, Languages, and more.
                                Pay securely with Cash on Delivery after your session.
                            </p>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link href="/register">
                                    <Button size="lg" className="px-8 text-base">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link href="/tutors">
                                    <Button variant="outline" size="lg" className="px-8 text-base">
                                        Find Tutors
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="mx-auto lg:ml-auto flex justify-center lg:justify-end">
                            {/* Visual Placeholder for Hero Image */}
                            <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bg-gradient-to-br from-blue-100 to-teal-50 rounded-full blur-3xl opacity-70 absolute top-0 right-0 -z-10 animate-pulse"></div>

                            <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                                    <div>
                                        <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                                        <div className="h-3 w-20 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-slate-100 rounded"></div>
                                    <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                                    <div className="h-3 w-4/6 bg-slate-100 rounded"></div>
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Verified Tutor</span>
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"><Star size={12} /> 5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-y border-slate-100">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-primary font-heading">10k+</h3>
                            <p className="text-sm text-slate-500 font-medium">Active Students</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-primary font-heading">500+</h3>
                            <p className="text-sm text-slate-500 font-medium">Expert Tutors</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-primary font-heading">50+</h3>
                            <p className="text-sm text-slate-500 font-medium">Subjects</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold text-primary font-heading">4.8</h3>
                            <p className="text-sm text-slate-500 font-medium">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-slate-50" id="categories">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-heading text-slate-900">
                            Explore Top Categories
                        </h2>
                        <p className="max-w-[700px] text-slate-600 md:text-lg">
                            Find the perfect tutor for any subject you want to master.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Mathematics", icon: Brain, color: "text-blue-600 bg-blue-50" },
                            { name: "Science", icon: Sparkles, color: "text-purple-600 bg-purple-50" },
                            { name: "English", icon: BookOpen, color: "text-pink-600 bg-pink-50" },
                            { name: "Programming", icon: Users, color: "text-teal-600 bg-teal-50" }
                        ].map((cat, i) => (
                            <Link href={`/tutors?category=${cat.name}`} key={i} className="group relative block overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-slate-100 hover:border-primary/20">
                                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                                    <cat.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="mt-2 text-sm text-slate-500">120+ Tutors Available</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Tutors (Placeholder for now) */}
            <section className="py-16 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-heading text-slate-900">
                            Meet Our Top Tutors
                        </h2>
                        <p className="max-w-[700px] text-slate-600 md:text-lg">
                            Highly rated by students like you.
                        </p>
                    </div>

                    {/* Grid of Mock Tutors */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-900">Dr. Sarah Smith</h3>
                                            <p className="text-sm text-slate-500">Mathematics Expert</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full text-yellow-700 text-xs font-bold">
                                        <Star size={12} fill="currentColor" /> 4.9
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mb-6 flex-1">
                                    Specializing in Calculus and Algebra with over 5 years of teaching experience.
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <span className="font-bold text-primary">20 BDT/hr</span>
                                    <Link href="/tutors/1">
                                        <Button variant="secondary" size="sm">View Profile</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/tutors">
                            <Button size="lg" variant="outline" className="px-8">View All Tutors</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-slate-900 text-white" id="how-it-works">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading">How SkillBridge Works</h2>
                        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">Simple, secure, and effective. Get started in minutes.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {[
                            { step: "01", title: "Search Tutors", desc: "Browse profiles by subject, rating, and price to find your perfect match." },
                            { step: "02", title: "Book a Session", desc: "Choose a time that works for you. No upfront payment required." },
                            { step: "03", title: "Pay After Class", desc: "Enjoy your lesson and pay cash directly to the tutor when you're done." }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl mb-6 border border-primary/20 backdrop-blur-sm">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}

                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-0 transform translate-y-1/2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
