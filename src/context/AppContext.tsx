import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Recipe, Order, Review, CartItem, SellerProductSubmission, RecipeSubmission, RecipeReview } from "../types";
import {
  INITIAL_PRODUCTS,
  INITIAL_RECIPES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_SELLER_SUBMISSIONS,
  INITIAL_RECIPE_SUBMISSIONS,
  INITIAL_RECIPE_REVIEWS,
} from "../data";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
  orderId?: string;
  duration?: number;
}

interface AppContextType {
  products: Product[];
  recipes: Recipe[];
  reviews: Review[];
  recipeReviews: RecipeReview[];
  orders: Order[];
  cart: CartItem[];
  sellerSubmissions: SellerProductSubmission[];
  recipeSubmissions: RecipeSubmission[];
  userRole: "customer" | "seller" | "admin";
  setUserRole: (role: "customer" | "seller" | "admin") => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  addToCart: (product: Product, quantity?: number, recipientEmail?: string, giftMessage?: string, selectedPrice?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (details: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    zipCode: string;
    paymentMethod: string;
  }) => Order;
  addReview: (productId: string, author: string, rating: number, comment: string) => void;
  addRecipeReview: (recipeId: string, author: string, rating: number, comment: string) => void;
  submitSellerProduct: (sub: Omit<SellerProductSubmission, "id" | "status" | "createdAt">) => void;
  submitSellerRecipe: (sub: Omit<RecipeSubmission, "id" | "status" | "createdAt">) => void;
  approveProductSubmission: (id: string) => void;
  rejectProductSubmission: (id: string) => void;
  approveRecipeSubmission: (id: string) => void;
  rejectRecipeSubmission: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;
  createProduct: (product: Product) => void;
  updateProductDetails: (id: string, updatedFields: Partial<Product>) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  headerSearchQuery: string;
  setHeaderSearchQuery: (query: string) => void;
  importDropshipProduct: (product: Product) => void;
  bulkImportProducts: (newProducts: Product[]) => void;
  bulkImportRecipes: (newRecipes: Recipe[]) => void;
  bulkImportReviews: (newReviews: Review[]) => void;
  resetAllToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Try loading initial state from localStorage or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("p_m_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("p_m_recipes");
    const parsed: Recipe[] = saved ? JSON.parse(saved) : INITIAL_RECIPES;
    const savedReviews = localStorage.getItem("p_m_recipe_reviews");
    const activeReviews: RecipeReview[] = savedReviews ? JSON.parse(savedReviews) : INITIAL_RECIPE_REVIEWS;

    return parsed.map((r) => {
      const matchReviews = activeReviews.filter((rev) => rev.recipeId === r.id);
      if (matchReviews.length > 0) {
        const sum = matchReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avg = parseFloat((sum / matchReviews.length).toFixed(1));
        return {
          ...r,
          rating: avg,
          reviewsCount: matchReviews.length
        };
      }
      return {
        ...r,
        rating: r.rating || 0,
        reviewsCount: r.reviewsCount || 0
      };
    });
  });

  const [recipeReviews, setRecipeReviews] = useState<RecipeReview[]>(() => {
    const saved = localStorage.getItem("p_m_recipe_reviews");
    return saved ? JSON.parse(saved) : INITIAL_RECIPE_REVIEWS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("p_m_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("p_m_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("p_m_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [sellerSubmissions, setSellerSubmissions] = useState<SellerProductSubmission[]>(() => {
    const saved = localStorage.getItem("p_m_seller_submissions");
    return saved ? JSON.parse(saved) : INITIAL_SELLER_SUBMISSIONS;
  });

  const [recipeSubmissions, setRecipeSubmissions] = useState<RecipeSubmission[]>(() => {
    const saved = localStorage.getItem("p_m_recipe_submissions");
    return saved ? JSON.parse(saved) : INITIAL_RECIPE_SUBMISSIONS;
  });

  const [userRole, setUserRoleState] = useState<"customer" | "seller" | "admin">(() => {
    return (localStorage.getItem("p_m_user_role") as any) || "customer";
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("p_m_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 6000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist states to localStorage when they change
  useEffect(() => {
    localStorage.setItem("p_m_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("p_m_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("p_m_recipes", JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem("p_m_recipe_reviews", JSON.stringify(recipeReviews));
  }, [recipeReviews]);

  useEffect(() => {
    localStorage.setItem("p_m_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("p_m_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("p_m_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("p_m_seller_submissions", JSON.stringify(sellerSubmissions));
  }, [sellerSubmissions]);

  useEffect(() => {
    localStorage.setItem("p_m_recipe_submissions", JSON.stringify(recipeSubmissions));
  }, [recipeSubmissions]);

  const setUserRole = (role: "customer" | "seller" | "admin") => {
    setUserRoleState(role);
    localStorage.setItem("p_m_user_role", role);
  };

  // CART WORKFLOW
  const addToCart = (
    product: Product,
    quantity: number = 1,
    recipientEmail?: string,
    giftMessage?: string,
    selectedPrice?: number
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.recipientEmail === recipientEmail &&
          item.giftMessage === giftMessage &&
          item.selectedPrice === selectedPrice
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          item.recipientEmail === recipientEmail &&
          item.giftMessage === giftMessage &&
          item.selectedPrice === selectedPrice
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.stock, quantity),
          recipientEmail,
          giftMessage,
          selectedPrice,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    // For removing we can remove items matching this product.id. 
    // To be safe and let user remove specific variants, let's remove by product id first
    // or if we have special metadata we'd matching them. Here simple filter is fine:
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock;
          return { ...item, quantity: Math.max(1, Math.min(max, qty)) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // ORDER MANAGEMENT
  const placeOrder = (details: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    zipCode: string;
    paymentMethod: string;
  }) => {
    const subtotal = cart.reduce((acc, item) => {
      const price = item.selectedPrice !== undefined ? item.selectedPrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    // Exclude gift cards from shipping cost calculation
    const shippableSubtotal = cart.reduce((acc, item) => {
      const isGift = item.product.id === "gift_card" || item.product.tags?.includes("giftcard");
      if (isGift) return acc;
      const price = item.selectedPrice !== undefined ? item.selectedPrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    const hasShippableItems = cart.some(
      (item) => !(item.product.id === "gift_card" || item.product.tags?.includes("giftcard"))
    );

    const shippingAndTax = hasShippableItems ? (shippableSubtotal > 40 ? 4.99 : 8.99) : 0;
    const total = parseFloat((subtotal + shippingAndTax).toFixed(2));

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderItems = cart.map((item) => {
      const price = item.selectedPrice !== undefined ? item.selectedPrice : item.product.price;
      const isGift = item.product.id === "gift_card" || item.product.tags?.includes("giftcard");
      return {
        productId: item.product.id,
        productName: item.product.name + (item.selectedPrice ? ` ($${item.selectedPrice})` : ""),
        price,
        quantity: item.quantity,
        image: item.product.image,
        recipientEmail: item.recipientEmail,
        giftMessage: item.giftMessage,
        isGiftCard: isGift,
      };
    });

    const newOrder: Order = {
      id: orderId,
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      shippingAddress: details.shippingAddress,
      city: details.city,
      zipCode: details.zipCode,
      paymentMethod: details.paymentMethod,
      items: orderItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingAndTax,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send Webhook signals for each gift card item in the order
    cart.forEach((item) => {
      const isGift = item.product.id === "gift_card" || item.product.tags?.includes("giftcard");
      if (isGift && item.recipientEmail) {
        const price = item.selectedPrice !== undefined ? item.selectedPrice : item.product.price;
        fetch("/api/webhooks/gift-card-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            cardValue: price,
            recipientEmail: item.recipientEmail,
            giftMessage: item.giftMessage || "",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Gift card webhook successful:", data);
          })
          .catch((err) => {
            console.error("Error pushing webhook:", err);
          });
      }
    });

    // Update stock levels
    setProducts((prev) =>
      prev.map((p) => {
        const itemInCart = cart.find((item) => item.product.id === p.id);
        if (itemInCart) {
          return { ...p, stock: Math.max(0, p.stock - itemInCart.quantity) };
        }
        return p;
      })
    );

    clearCart();
    return newOrder;
  };

  // REVIEW WORKFLOW
  const addReview = (productId: string, author: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author: author || "Curious Gourmet",
      rating,
      date: new Date().toISOString().split("T")[0],
      comment,
      verified: true,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update Product Rating dynamically
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const productReviews = [newReview, ...reviews.filter((r) => r.productId === productId)];
          const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
          const avg = parseFloat((sum / productReviews.length).toFixed(1));
          return {
            ...p,
            rating: avg,
            reviewsCount: productReviews.length,
          };
        }
        return p;
      })
    );
  };

  const addRecipeReview = (recipeId: string, author: string, rating: number, comment: string) => {
    const newReview: RecipeReview = {
      id: `rec-rev-${Date.now()}`,
      recipeId,
      author: author || "Curious Chef",
      rating,
      date: new Date().toISOString().split("T")[0],
      comment,
    };

    setRecipeReviews((prev) => [newReview, ...prev]);

    // Update Recipe Rating dynamically
    setRecipes((prevRecipes) =>
      prevRecipes.map((r) => {
        if (r.id === recipeId) {
          const matchingReviews = [newReview, ...recipeReviews.filter((rev) => rev.recipeId === recipeId)];
          const sum = matchingReviews.reduce((acc, rev) => acc + rev.rating, 0);
          const avg = parseFloat((sum / matchingReviews.length).toFixed(1));
          return {
            ...r,
            rating: avg,
            reviewsCount: matchingReviews.length,
          };
        }
        return r;
      })
    );
  };

  // SELLER SUBMISSIONS
  const submitSellerProduct = (sub: Omit<SellerProductSubmission, "id" | "status" | "createdAt">) => {
    const newSub: SellerProductSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setSellerSubmissions((prev) => [newSub, ...prev]);
  };

  const submitSellerRecipe = (sub: Omit<RecipeSubmission, "id" | "status" | "createdAt">) => {
    const newSub: RecipeSubmission = {
      ...sub,
      id: `rsub-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setRecipeSubmissions((prev) => [newSub, ...prev]);
  };

  // ADMIN OPERATIONS
  const approveProductSubmission = (id: string) => {
    const sub = sellerSubmissions.find((s) => s.id === id);
    if (!sub) return;

    // Create real product
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: sub.name,
      description: sub.description,
      price: sub.price,
      category: sub.category,
      // Fallback images depending on category
      image:
        sub.category === "pickle"
          ? "https://images.unsplash.com/photo-1589135794132-cefe12fc55ae?auto=format&fit=crop&q=80&w=800"
          : sub.category === "pepper"
          ? "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
          : sub.category === "oil"
          ? "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
          : "https://images.unsplash.com/photo-1583224923948-c87dcf85b2c7?auto=format&fit=crop&q=80&w=800",
      spiceLevel: sub.spiceLevel,
      stock: 25, // default stock on approval
      rating: 5.0,
      reviewsCount: 0,
      ingredients: sub.ingredients,
      sellerName: sub.sellerName,
      tags: [sub.category, "Artisanal", "New Addition"],
      size: "16 oz Jar",
    };

    setProducts((prev) => [newProduct, ...prev]);
    setSellerSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Approved" } : s))
    );
  };

  const rejectProductSubmission = (id: string) => {
    setSellerSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Rejected" } : s))
    );
  };

  const approveRecipeSubmission = (id: string) => {
    const sub = recipeSubmissions.find((r) => r.id === id);
    if (!sub) return;

    const newRecipe: Recipe = {
      id: `rec-${Date.now()}`,
      title: sub.title,
      description: sub.description,
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800",
      difficulty: sub.difficulty,
      prepTime: sub.prepTime,
      cookTime: sub.cookTime,
      ingredients: sub.ingredients,
      instructions: sub.instructions,
      spiceLevel: sub.spiceLevel,
      author: sub.author,
      relatedProductIds: [],
      approved: true,
      createdAt: new Date().toISOString(),
    };

    setRecipes((prev) => [newRecipe, ...prev]);
    setRecipeSubmissions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  const rejectRecipeSubmission = (id: string) => {
    setRecipeSubmissions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
  };

  const createProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProductDetails = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const importDropshipProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const bulkImportProducts = (newProducts: Product[]) => {
    setProducts((prev) => {
      const existingIds = new Set(prev.map(p => p.id));
      const filtered = newProducts.filter(p => !existingIds.has(p.id));
      return [...filtered, ...prev];
    });
    addToast({
      title: "Products Populated",
      message: `Successfully registered ${newProducts.length} new specimens into the live catalog.`,
      type: "success"
    });
  };

  const bulkImportRecipes = (newRecipes: Recipe[]) => {
    setRecipes((prev) => {
      const existingIds = new Set(prev.map(r => r.id));
      const filtered = newRecipes.filter(r => !existingIds.has(r.id));
      return [...filtered, ...prev];
    });
    addToast({
      title: "Culinary Recipes Seeded",
      message: `Enrolled ${newRecipes.length} new culinary formulas into the library database.`,
      type: "success"
    });
  };

  const bulkImportReviews = (newReviews: Review[]) => {
    setReviews((prev) => [...newReviews, ...prev]);
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const productReviews = [...newReviews, ...reviews].filter((r) => r.productId === p.id);
        if (productReviews.length === 0) return p;
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = parseFloat((sum / productReviews.length).toFixed(1));
        return {
          ...p,
          rating: avg,
          reviewsCount: productReviews.length
        };
      })
    );
    addToast({
      title: "Ratings Synchronized",
      message: `Acquired and computed ${newReviews.length} client experience logs.`,
      type: "info"
    });
  };

  const resetAllToDefaults = () => {
    localStorage.removeItem("p_m_products");
    localStorage.removeItem("p_m_recipes");
    localStorage.removeItem("p_m_reviews");
    localStorage.removeItem("p_m_recipe_reviews");
    localStorage.removeItem("p_m_orders");
    localStorage.removeItem("p_m_seller_submissions");
    localStorage.removeItem("p_m_recipe_submissions");
    localStorage.removeItem("p_m_wishlist");
    localStorage.removeItem("p_m_cart");

    setProducts(INITIAL_PRODUCTS);
    setRecipes(INITIAL_RECIPES);
    setReviews(INITIAL_REVIEWS);
    setRecipeReviews(INITIAL_RECIPE_REVIEWS);
    setOrders(INITIAL_ORDERS);
    setSellerSubmissions(INITIAL_SELLER_SUBMISSIONS);
    setRecipeSubmissions(INITIAL_RECIPE_SUBMISSIONS);
    setWishlist([]);
    setCart([]);
    addToast({
      title: "Curation Reset",
      message: "Database successfully cleared and repopulated with master specimens.",
      type: "success"
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        products,
        recipes,
        reviews,
        orders,
        cart,
        sellerSubmissions,
        recipeSubmissions,
        userRole,
        setUserRole,
        toasts,
        addToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        addReview,
        addRecipeReview,
        recipeReviews,
        submitSellerProduct,
        submitSellerRecipe,
        approveProductSubmission,
        rejectProductSubmission,
        approveRecipeSubmission,
        rejectRecipeSubmission,
        updateOrderStatus,
        deleteProduct,
        updateProductStock,
        createProduct,
        updateProductDetails,
        wishlist,
        toggleWishlist,
        headerSearchQuery,
        setHeaderSearchQuery,
        importDropshipProduct,
        bulkImportProducts,
        bulkImportRecipes,
        bulkImportReviews,
        resetAllToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
