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
    <section id="ai-highlights" className="py-20 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Heading */}
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

        {/* AI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {aiSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative bg-background/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:border-white/20 transition-all duration-300"
            >
              {/* Hover glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <step.icon className="text-primary-foreground" size={28} />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {step.title}
                </h3>

                <p className="text-foreground/60 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Accent border on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
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
      </div>
    </section>
  )
}

export default AIHighlights;
