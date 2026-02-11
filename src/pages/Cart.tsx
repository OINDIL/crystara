import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-center mb-3">
            Your <span className="text-gradient-mystic">Cart</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
            Review your selected crystals before checkout
          </p>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 md:py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 text-sm">Discover our collection of healing crystals</p>
              <Link to="/shop">
                <Button className="gap-2">Continue Shopping <ArrowRight size={18} /></Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex gap-3 md:gap-4 p-3 md:p-4 bg-card rounded-xl border border-border">
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="text-[10px] md:text-xs text-muted-foreground uppercase">{item.category}</p>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-serif font-semibold text-sm md:text-base truncate hover:text-primary">{item.name}</h3>
                          </Link>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => removeFromCart(item.id)}>
                          <X size={14} />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-md">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={12} />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={12} />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm md:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                          {item.originalPrice && (
                            <p className="text-xs text-muted-foreground line-through">₹{(item.originalPrice * item.quantity).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive text-xs">
                  Clear Cart
                </Button>
              </div>

              <div className="bg-card p-5 md:p-6 rounded-xl border border-border h-fit sticky top-24">
                <h3 className="text-lg font-serif font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">{totalPrice >= 999 ? "Free" : "₹99"}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg">₹{(totalPrice + (totalPrice >= 999 ? 0 : 99)).toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
                <p className="text-[10px] text-muted-foreground text-center mt-2">Free shipping on orders above ₹999</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
