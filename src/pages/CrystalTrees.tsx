import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

import product1 from "@/assets/product-1.jpg";
import product3 from "@/assets/product-3.jpg";
import product5 from "@/assets/product-5.jpg";
import product7 from "@/assets/product-7.jpg";

const crystalTrees = [
  {
    id: 9,
    name: "Amethyst Bonsai Tree",
    price: 2499,
    originalPrice: 3299,
    image: product1,
    category: "Crystal Trees",
    tag: "Premium",
    benefit: "Peace & spiritual growth",
  },
  {
    id: 10,
    name: "Citrine Money Tree",
    price: 2199,
    originalPrice: 2899,
    image: product3,
    category: "Crystal Trees",
    tag: "Bestseller",
    benefit: "Attract prosperity",
  },
  {
    id: 11,
    name: "Rose Quartz Love Tree",
    price: 1999,
    originalPrice: 2599,
    image: product5,
    category: "Crystal Trees",
    benefit: "Harmonize relationships",
  },
  {
    id: 12,
    name: "Seven Chakra Tree",
    price: 2799,
    originalPrice: 3499,
    image: product7,
    category: "Crystal Trees",
    tag: "New",
    benefit: "Complete energy balance",
  },
];

const CrystalTrees = () => {
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
            Crystal <span className="text-gradient-mystic">Trees</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Beautiful gemstone trees that bring prosperity, love, and positive energy to your home and workspace.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {crystalTrees.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CrystalTrees;
