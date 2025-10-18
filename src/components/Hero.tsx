"use client"
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Starfield from "./Starfield";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Starfield background */}
            <Starfield />

            {/* Glowing planet/sphere effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px]">
                    <div className="relative w-full h-full">
                        {/* Planet glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-3xl" />
                        {/* Planet edge highlight */}
                        <div className="absolute top-[40%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 pb-20">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                        Reinventing{" "}
                        <span className="text-accent">
                            HR Management
                        </span>{" "}
                        with AI
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Streamline hiring, automate payroll & empower your workforce with AI-driven insights.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="border-foreground/30 text-foreground hover:bg-foreground/5">
                                View Services
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
