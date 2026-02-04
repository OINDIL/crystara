import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    tag?: string;
    benefit?: string;
  };
  index?: number;
  linkTo?: string;
}

const ProductCard = ({ product, index = 0, linkTo }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productLink = linkTo || `/product/${product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative bg-card rounded-xl overflow-hidden shadow-crystal hover:shadow-glow transition-shadow duration-300">
        {/* Image container */}
        <Link to={productLink} className="block relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.tag && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {product.tag}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="w-9 h-9 rounded-full bg-background/90 hover:bg-background"
              onClick={(e) => e.preventDefault()}
            >
              <Heart size={16} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-9 h-9 rounded-full bg-background/90 hover:bg-background"
              onClick={(e) => e.preventDefault()}
            >
              <Eye size={16} />
            </Button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              className="w-full" 
              size="sm"
              onClick={(e) => e.preventDefault()}
            >
              <ShoppingBag size={16} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </Link>

        {/* Content */}
        <Link to={productLink} className="block p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-serif font-semibold text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>
          {product.benefit && (
            <p className="text-xs text-muted-foreground mb-2">
              {product.benefit}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
