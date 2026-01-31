import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const products = [
  {
    id: 1,
    name: "Rose Quartz Crystal Bracelet – 8mm",
    price: 499,
    originalPrice: 999,
    image: product1,
    category: "Bracelets",
    tag: "Bestseller",
    benefit: "Love & Emotional Healing",
  },
  {
    id: 2,
    name: "7 Chakra Healing Bracelet",
    price: 699,
    originalPrice: 1299,
    image: product2,
    category: "Bracelets",
    tag: "Popular",
    benefit: "Balance & Harmony",
  },
  {
    id: 3,
    name: "Citrine Abundance Pyramid",
    price: 1299,
    originalPrice: 2499,
    image: product3,
    category: "Pyramids",
    tag: "New",
    benefit: "Wealth & Prosperity",
  },
  {
    id: 4,
    name: "Amethyst Crystal Tree",
    price: 1599,
    originalPrice: 2999,
    image: product4,
    category: "Crystal Trees",
    benefit: "Wisdom & Intuition",
  },
  {
    id: 5,
    name: "Clear Quartz Crystal Sphere",
    price: 2499,
    originalPrice: 3999,
    image: product5,
    category: "Spheres",
    benefit: "Clarity & Amplification",
  },
  {
    id: 6,
    name: "Black Obsidian Protection Bracelet",
    price: 599,
    originalPrice: 1199,
    image: product6,
    category: "Bracelets",
    benefit: "Protection & Grounding",
  },
  {
    id: 7,
    name: "Rose Quartz Ganesha Idol",
    price: 1899,
    originalPrice: 3499,
    image: product7,
    category: "Figurines",
    tag: "Spiritual",
    benefit: "New Beginnings",
  },
  {
    id: 8,
    name: "Amethyst Jaap Mala – 108 Beads",
    price: 1499,
    originalPrice: 2799,
    image: product8,
    category: "Malas",
    benefit: "Meditation & Peace",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Our most loved healing crystals, handpicked for their powerful energy and beauty
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 group self-start md:self-auto">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
