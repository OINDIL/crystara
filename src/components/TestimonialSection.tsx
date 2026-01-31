import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    text: "The Rose Quartz bracelet I received was absolutely stunning! I could feel the positive energy immediately. The quality exceeded my expectations.",
    product: "Rose Quartz Bracelet",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Mumbai",
    rating: 5,
    text: "Crystara's Citrine pyramid has been a game-changer for my home office. I've noticed increased focus and positive vibes since placing it on my desk.",
    product: "Citrine Pyramid",
  },
  {
    id: 3,
    name: "Ananya Reddy",
    location: "Bangalore",
    rating: 5,
    text: "I've purchased from many crystal shops, but Crystara stands out for their authentic, high-quality crystals and beautiful packaging. Highly recommend!",
    product: "Amethyst Tree",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy customers who've experienced the magic of our healing crystals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-xl shadow-crystal relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-foreground/80 mb-4 italic">
                "{testimonial.text}"
              </p>
              
              <div className="pt-4 border-t border-border">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location} • {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
