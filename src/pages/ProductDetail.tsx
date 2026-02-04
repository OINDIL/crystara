import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft, Sparkles, Shield, Truck, RotateCcw } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductById, getAllProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = productId ? getProductById(productId) : null;
  
  // Get related products from same category
  const relatedProducts = product 
    ? getAllProducts()
        .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
        .slice(0, 4)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shop">
              <Button>
                <ChevronLeft size={18} className="mr-2" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const features = [
    { icon: Sparkles, text: "100% Natural Crystal" },
    { icon: Shield, text: "Energetically Cleansed" },
    { icon: Truck, text: "Free Delivery above ₹999" },
    { icon: RotateCcw, text: "7 Days Easy Return" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/category/${product.categorySlug}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <Link 
              to={`/category/${product.categorySlug}/${product.subCategorySlug}`} 
              className="hover:text-foreground transition-colors"
            >
              {product.subCategory}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card shadow-crystal">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-4 left-4 text-sm px-3 py-1"
                  >
                    -{discount}% OFF
                  </Badge>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className={`absolute top-4 right-4 rounded-full ${
                    isWishlisted ? 'bg-primary text-primary-foreground' : 'bg-background/90'
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </Button>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <span className="text-sm text-primary font-medium uppercase tracking-wider">
                  {product.subCategory}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {product.name} {product.subCategory}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {product.benefit}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3">About this crystal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This beautiful {product.name} is carefully selected for its exceptional quality and powerful 
                  metaphysical properties. Known for its ability to {product.benefit.toLowerCase()}, this crystal 
                  makes a perfect addition to your spiritual practice or as a meaningful gift for loved ones.
                  Each piece is unique and may vary slightly in color and pattern, making your crystal truly one-of-a-kind.
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button size="lg" className="flex-1">
                  <ShoppingBag size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart 
                    size={20} 
                    className="mr-2"
                    fill={isWishlisted ? "currentColor" : "none"} 
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <feature.icon size={20} className="text-primary" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={{
                      id: index,
                      name: `${relatedProduct.name} ${relatedProduct.subCategory}`,
                      price: relatedProduct.price,
                      originalPrice: relatedProduct.originalPrice,
                      image: relatedProduct.image,
                      category: relatedProduct.category,
                      benefit: relatedProduct.benefit,
                    }}
                    index={index}
                    linkTo={`/product/${relatedProduct.id}`}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
