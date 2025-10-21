"use client"
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    ChevronLeft,
    BarChart3,
    Cpu,
    UserCheck,
    Video,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { wakeUpBackend } from "@/lib/firestoreApi";

interface DashboardLayoutProps {
    children: ReactNode;
    userRole: "admin" | "hr" | "manager" | "employee" | "candidate";
    userName: string;
}

const roleMenuItems = {
    admin: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/admin" },
        { icon: Users, label: "User Management", path: "/dashboard/admin/users" },
        { icon: BarChart3, label: "Analytics", path: "/dashboard/admin/analytics" },
        { icon: Cpu, label: "AI Models", path: "/dashboard/admin/ai-monitor" },
        { icon: Settings, label: "Departments", path: "/dashboard/admin/departments" },
        { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
    ],
    hr: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/hr" },
        { icon: Briefcase, label: "Jobs", path: "/dashboard/hr/jobs" },
        { icon: Users, label: "Candidates", path: "/dashboard/hr/candidates" },
        { icon: Calendar, label: "Interviews", path: "/dashboard/hr/interviews" },
        { icon: FileText, label: "Reports", path: "/dashboard/hr/offers" },
    ],
    manager: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/manager" },
        { icon: Users, label: "Team", path: "/dashboard/manager/team" },
        { icon: UserCheck, label: "Attendance", path: "/dashboard/manager/attendance" },
        { icon: BarChart3, label: "Performance", path: "/dashboard/manager/performance" },
    ],
    employee: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/employee" },
        { icon: Calendar, label: "Attendance", path: "/dashboard/employee/attendance" },
        { icon: FileText, label: "Payroll", path: "/dashboard/employee/payroll" },
        { icon: User, label: "Profile", path: "/dashboard/employee/profile" },
    ],
    candidate: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/candidate" },
        { icon: User, label: "Profile", path: "/dashboard/candidate/profile" },
        { icon: Briefcase, label: "Jobs", path: "/dashboard/candidate/jobs" },
        { icon: Video, label: "AI Interview", path: "/dashboard/candidate/interview" },
        { icon: CheckCircle, label: "Results", path: "/dashboard/candidate/result" },
    ],
};

export const DashboardLayout = ({ children, userRole, userName }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();
    const menuItems = roleMenuItems[userRole];

    // Wake up backend when dashboard loads (for Render free tier)
    useEffect(() => {
        wakeUpBackend();
    }, []);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background stars effect */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(91,159,255,0.1),transparent_50%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,140,66,0.05),transparent_50%)] pointer-events-none" />

            {/* Top Navbar */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 right-0 left-0 z-40 h-16 bg-card/80 backdrop-blur-md border-b border-glass-border"
            >
                <div className="h-full px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden md:flex"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <h1 className="text-xl font-bold text-foreground">
                            HRMS <span className="text-primary">Dashboard</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-glass border border-glass-border">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-foreground">{userName}</p>
                                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </motion.header>

            {/* Sidebar - Desktop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-card/30 backdrop-blur-glass border-r border-glass-border z-30"
                    >
                        <nav className="p-4 space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;
                                return (
                                    <Link key={item.path} href={item.path}>
                                        <motion.div
                                            whileHover={{ x: 4 }}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Sidebar - Mobile */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-card backdrop-blur-glass border-r border-glass-border z-50"
                        >
                            <nav className="p-4 space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                                            <div
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main
                className={cn(
                    "pt-20 pb-8 px-4 transition-all duration-300",
                    sidebarOpen ? "md:pl-72" : "md:pl-8"
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};
