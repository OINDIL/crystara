import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Wishlist = () => {
  // Mock wishlist data - in a real app this would come from state management
  const wishlistItems: any[] = [];

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
            Your <span className="text-gradient-mystic">Wishlist</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Save your favorite crystals for later
          </p>

          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start adding crystals you love to your wishlist
              </p>
              <Link to="/shop">
                <Button className="gap-2">
                  Explore Crystals
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Wishlist items would go here */}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
