"use client"
import { motion } from "framer-motion";
import { Brain, MessageSquare, BarChart3, DollarSign, Shield, Users } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI-Powered Resume Screening",
        description: "Intelligent algorithms analyze thousands of resumes in seconds, identifying the best candidates for your roles.",
    },
    {
        icon: MessageSquare,
        title: "Smart Interview Bot",
        description: "Automated initial screening interviews with natural language processing, saving hours of manual work.",
    },
    {
        icon: BarChart3,
        title: "Performance Analytics Dashboard",
        description: "Real-time insights into employee performance, engagement, and productivity metrics.",
    },
    {
        icon: DollarSign,
        title: "Attendance & Payroll Automation",
        description: "Seamlessly track attendance and process payroll with zero errors and complete compliance.",
    },
    {
        icon: Shield,
        title: "Role-Based Dashboards",
        description: "Customized interfaces for admins, HR, managers, and employees with appropriate access controls.",
    },
    {
        icon: Users,
        title: "Workforce Management",
        description: "Complete employee lifecycle management from onboarding to exit, all in one platform.",
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Powerful Features for Modern HR
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to transform your HR operations with cutting-edge technology
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="group relative bg-background/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:border-white/20 transition-all duration-300"
                        >
                            {/* Glass effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="text-primary-foreground" size={28} />
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-foreground/60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Accent border on hover */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
