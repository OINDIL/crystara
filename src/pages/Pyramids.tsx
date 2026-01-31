import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const pyramids = [
  {
    id: 5,
    name: "Clear Quartz Pyramid",
    price: 1499,
    originalPrice: 1999,
    image: product5,
    category: "Pyramids",
    tag: "Premium",
    benefit: "Amplify energy & clarity",
  },
  {
    id: 6,
    name: "Citrine Abundance Pyramid",
    price: 1799,
    originalPrice: 2299,
    image: product6,
    category: "Pyramids",
    benefit: "Attract wealth & success",
  },
  {
    id: 7,
    name: "Black Tourmaline Protection Pyramid",
    price: 1299,
    originalPrice: 1699,
    image: product7,
    category: "Pyramids",
    tag: "Bestseller",
    benefit: "Shield from negativity",
  },
  {
    id: 8,
    name: "Amethyst Meditation Pyramid",
    price: 1599,
    originalPrice: 2099,
    image: product8,
    category: "Pyramids",
    benefit: "Deep spiritual connection",
  },
];

const Pyramids = () => {
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
            Crystal <span className="text-gradient-mystic">Pyramids</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Harness sacred geometry with our powerful crystal pyramids for meditation, energy cleansing, and manifestation.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pyramids.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Pyramids;
