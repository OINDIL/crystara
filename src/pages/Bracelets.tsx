import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const bracelets = [
  {
    id: 1,
    name: "7 Chakra Healing Bracelet",
    price: 899,
    originalPrice: 1299,
    image: product1,
    category: "Bracelets",
    tag: "Bestseller",
    benefit: "Balance all 7 chakras",
  },
  {
    id: 2,
    name: "Tiger Eye Power Bracelet",
    price: 749,
    originalPrice: 999,
    image: product2,
    category: "Bracelets",
    benefit: "Boost confidence & courage",
  },
  {
    id: 3,
    name: "Rose Quartz Love Bracelet",
    price: 649,
    originalPrice: 899,
    image: product3,
    category: "Bracelets",
    tag: "New",
    benefit: "Attract love & harmony",
  },
  {
    id: 4,
    name: "Amethyst Serenity Bracelet",
    price: 799,
    originalPrice: 1099,
    image: product4,
    category: "Bracelets",
    benefit: "Calm mind & intuition",
  },
];

const Bracelets = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
            Crystal <span className="text-gradient-mystic">Bracelets</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Wear the power of crystals with our handcrafted healing bracelets designed for daily energy and protection.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bracelets.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Bracelets;
