import { motion } from "framer-motion";
import { Shield, Sparkles, Truck, RefreshCw, Award, Heart } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Every crystal is genuine, natural, and ethically sourced from trusted mines.",
  },
  {
    icon: Sparkles,
    title: "Energized & Blessed",
    description: "All products are cleansed and charged with positive healing energy.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Enjoy free shipping on all orders above ₹2,000 across India.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Not satisfied? Return within 7 days for a full refund.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Rigorous quality checks ensure you receive only the finest crystals.",
  },
  {
    icon: Heart,
    title: "Expert Guidance",
    description: "Our crystal healers help you choose the perfect crystal for your needs.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-gradient-crystal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Why Choose Crystara?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to bringing you authentic healing crystals with love and positive energy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-crystal transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
