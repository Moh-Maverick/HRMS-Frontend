"use client"
import { motion } from "framer-motion";
import { Cpu, Zap, TrendingUp } from "lucide-react";

const aiSteps = [
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Advanced machine learning models process and analyze HR data in real-time",
  },
  {
    icon: Zap,
    title: "Automated Actions",
    description: "Smart automation handles routine tasks, freeing up your team for strategic work",
  },
  {
    icon: TrendingUp,
    title: "Predictive Insights",
    description: "Data-driven forecasts help you make informed decisions about your workforce",
  },
];

const AIHighlights = () => {
  return (
    <section id="ai-highlights" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How Our AI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of artificial intelligence transforming HR management
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-lg border border-border rounded-3xl p-8 lg:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {aiSteps.map((step, index) => (
                <div key={index} className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <step.icon className="text-primary-foreground" size={36} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Connector line (not on last item) */}
                  {index < aiSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                </div>
              ))}
            </div>

            {/* Call-to-action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-lg font-medium text-foreground mb-6">
                Ready to transform your HR operations?
              </p>
              <a
                href="/auth/signup"
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>Start Your Free Trial</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIHighlights;
