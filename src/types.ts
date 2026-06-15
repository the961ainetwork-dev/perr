export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "pickle" | "pepper" | "oil" | "starter";
  image: string;
  spiceLevel: "None" | "Mild" | "Medium" | "Hot" | "Extreme";
  stock: number;
  rating: number;
  reviewsCount: number;
  ingredients: string[];
  sellerName: string;
  tags: string[];
  size?: string; // e.g. "16 oz Jar" or "4 oz Packet"
  isDropshipped?: boolean;
  wholesaleCost?: number;
  supplierName?: string;
  originalProductId?: string;
  isSeasonal?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface RecipeReview {
  id: string;
  recipeId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: "Easy" | "Advanced" | "Time-Intensive";
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  instructions: string[];
  spiceLevel: "Mild" | "Medium" | "Hot" | "Extreme";
  author: string;
  relatedProductIds: string[]; // products available to purchase for this recipe
  approved: boolean;
  createdAt: string;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  zipCode: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shippingAndTax: number;
  total: number;
  status: "Pending" | "Ready for Shipping" | "Shipped" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface SellerProductSubmission {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "pickle" | "pepper" | "oil" | "starter";
  spiceLevel: "None" | "Mild" | "Medium" | "Hot" | "Extreme";
  ingredients: string[];
  sellerName: string;
  sellerEmail: string;
  imageFile?: string; // Mock Base64 or placeholder
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface RecipeSubmission {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Advanced" | "Time-Intensive";
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  instructions: string[];
  spiceLevel: "Mild" | "Medium" | "Hot" | "Extreme";
  author: string;
  authorEmail: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}
