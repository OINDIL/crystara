import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import { motion } from "framer-motion";

const Shop = () => {
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
            Shop All <span className="text-gradient-mystic">Crystals</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Explore our complete collection of handpicked healing crystals and spiritual products.
          </p>
        </motion.div>
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
