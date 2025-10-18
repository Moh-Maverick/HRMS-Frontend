"use client"
import { Mail, Linkedin, Twitter, Facebook } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-background/60 backdrop-blur-lg border-t border-white/10 text-foreground py-12 mt-20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-white">FWC HRMS</h3>
                        <p className="text-foreground/60">
                            Reinventing HR Management with AI-driven insights and automation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-foreground/60 hover:text-accent transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#ai-highlights" className="text-foreground/60 hover:text-accent transition-colors">
                                    AI Highlights
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-foreground/60 hover:text-accent transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
                        <div className="space-y-3">
                            <a
                                href="mailto:contact@fwchrms.com"
                                className="flex items-center space-x-2 text-foreground/60 hover:text-accent transition-colors"
                            >
                                <Mail size={18} />
                                <span>contact@fwchrms.com</span>
                            </a>
                            <div className="flex space-x-4 pt-2">
                                <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                                    <Facebook size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-8 text-center text-foreground/60">
                    <p>&copy; 2025 • FWC HRMS • All rights reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
