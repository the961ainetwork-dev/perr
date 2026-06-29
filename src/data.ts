import { Product, Recipe, Order, Review, SellerProductSubmission, RecipeSubmission, RecipeReview } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Classic Garlic Dill Spears",
    description: "Old-school kosher dills fermented in small-batch stoneware crocks. Packed with premium garlic cloves, fresh dill weed, and black peppercorns for a satisfyingly sharp, crisp snap.",
    price: 9.99,
    category: "pickle",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Mild",
    stock: 45,
    rating: 4.8,
    reviewsCount: 24,
    ingredients: ["Cucumbers", "Filtered Water", "Distilled Vinegar", "Salt", "Garlic", "Fresh Dill", "Black Peppercorns", "Calcium Chloride (for crispness)"],
    sellerName: "Grateful Brines",
    tags: ["Classic", "Dill", "Low Sodium", "Organic"],
    size: "16 oz Jar"
  },
  {
    id: "prod-2",
    name: "Sweet Heat Bread & Butter Chips",
    description: "The ideal balance of sweet and fiery. Thinly crinkled cucumber chips pickled with sweet onions and kissed with organic habanero flakes. Excellent for premium burger toppings.",
    price: 8.49,
    category: "pickle",
    image: "https://images.unsplash.com/photo-1589134711812-78d10b784e20?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Medium",
    stock: 12, // Low stock to trigger alert!
    rating: 4.6,
    reviewsCount: 18,
    ingredients: ["Cucumbers", "Organic Cane Sugar", "Apple Cider Vinegar", "Sweet Yellow Onion", "Sea Salt", "Yellow Mustard Seeds", "Celery Seeds", "Turmeric", "Habanero Flakes"],
    sellerName: "Grateful Brines",
    tags: ["Sweet", "Crunchy", "Burger-Perfect"],
    size: "12 oz Jar",
    isSeasonal: true
  },
  {
    id: "prod-3",
    name: "Smoked Jalapeño Rings",
    description: "Freshly sliced jalapeños slow-smoked over hickory wood chips, then brined in dark brown sugar and cider vinegar. Rich, smokey, tangy, and deeply satisfying with a solid mid-level kick.",
    price: 10.99,
    category: "pepper",
    image: "https://images.unsplash.com/photo-1583224933948-2b8aaeeed42c?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Hot",
    stock: 30,
    rating: 4.9,
    reviewsCount: 31,
    ingredients: ["Wood-Smoked Jalapeño Peppers", "Cider Vinegar", "Brown Sugar", "Garlic Cloves", "Sea Salt", "Cumin Seeds", "Mustard Seeds"],
    sellerName: "Smokehouse Pickling Co.",
    tags: ["Smoked", "Spicy", "Hickory"],
    size: "16 oz Jar"
  },
  {
    id: "prod-4",
    name: "The Ghost Pepper Decimator",
    description: "WARNING: NOT FOR THE FAINT OF HEART! Artisan whole habanero and ghost pepper pickles brined in our custom capsaicin-blend brine. Features initial notes of dill and sweet peach, rapidly overtaken by immense heat.",
    price: 13.99,
    category: "pickle",
    image: "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Extreme",
    stock: 22,
    rating: 4.7,
    reviewsCount: 42,
    ingredients: ["Cucumbers", "Vinegar", "Water", "Ghost Peppers (Bhut Jolokia)", "Habanero Peppers", "Kosher Salt", "Peach Juice Nectar", "Garlic", "Dill Leaf", "Coriander Seeds"],
    sellerName: "Chili Head Farms",
    tags: ["Extreme Heat", "Ghost Pepper", "Gourmet Challenge"],
    size: "16 oz Jar"
  },
  {
    id: "prod-5",
    name: "Candied Serrano Slivers",
    description: "Sweet, sticky, and dangerously addictive. Slices of brilliant green serrano peppers preserved in a highly concentrated spiced cane syrup. Drizzle the leftover syrup over cornbread or vanilla ice cream!",
    price: 9.49,
    category: "pepper",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Hot",
    stock: 8, // Low stock!
    rating: 4.5,
    reviewsCount: 15,
    ingredients: ["Serrano Peppers", "Pure Cane Sugar", "Rice Vinegar", "Ginger Root", "Cinnamon Sticks", "Star Anise"],
    sellerName: "Sweet Sting Kitchens",
    tags: ["Sweet Heat", "Serrano", "Dessert Pairing"],
    size: "8 oz Jar",
    isSeasonal: true
  },
  {
    id: "prod-6",
    name: "Wild Fermented Kimchi Paste & Starter",
    description: "An ancient heirloom bacterial culture of Lactobacillus designed to kickstart your own organic fermentation. Concentrated paste with hand-ground Szechuan chilies, salted shrimp, plum syrup, and mountain ginger.",
    price: 14.99,
    category: "starter",
    image: "https://images.unsplash.com/photo-1583224923948-c87dcf85b2c7?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Medium",
    stock: 50,
    rating: 4.9,
    reviewsCount: 52,
    ingredients: ["Korean Red Pepper Flakes (Gochugaru)", "Fermented Shrimp Salt", "Fish Sauce", "Garlic", "Ginger", "Sweet Plum Syrup", "Active Probiotic Lacto-Cultures"],
    sellerName: "Han River Ferments",
    tags: ["Starter", "Fermentation", "Probiotic", "K-Style"],
    size: "4 oz Packet"
  },
  {
    id: "prod-7",
    name: "Signature Barrel-Aged Chili Crisp Oil",
    description: "A decadent chili oil infused with dynamic crispy garlic chunks, shallots, roasted peanuts, sesame seeds, and crushed dried pickles. Aged for 30 days in charred bourbon barrels for unparalleled woodsy depth.",
    price: 12.99,
    category: "oil",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Hot",
    stock: 19,
    rating: 5.0,
    reviewsCount: 88,
    ingredients: ["Non-GMO Canola Oil", "Szechuan Pepper", "Chili Flakes", "Crispy Garlic", "Crispy Shallots", "Dry Salted Pickles", "Bourbon Barrel Oak Infusions", "Peanuts", "Toasted Sesame", "Mushroom Powder"],
    sellerName: "Smokehouse Pickling Co.",
    tags: ["Chili Oil", "Barrel-Aged", "Garlic Crisps"],
    size: "6 oz Jar"
  },
  {
    id: "prod-8",
    name: "Pickled Rainbow Carrots & Serranos",
    description: "Vibrant yellow, purple, and orange carrot batons pickled with spicy serrano coins, doused in Mexican oregano, lime juice, and white vinegar. A classic cantina pickle that brings immense crunch and festive presentation.",
    price: 8.99,
    category: "pickle",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "Medium",
    stock: 35,
    rating: 4.7,
    reviewsCount: 19,
    ingredients: ["Rainbow Carrots", "Serrano Peppers", "Filtered Water", "Distilled Vinegar", "Key Lime Juice", "Sea Salt", "Mexican Oregano", "Coriander Stalk"],
    sellerName: "Sweet Sting Kitchens",
    tags: ["Mexican Style", "Carrots", "Crunchy", "Colorful"],
    size: "16 oz Jar",
    isSeasonal: true
  },
  {
    id: "gift_card",
    name: "Digital Gift Card",
    description: "Give the gift of premium Lebanese small-batch dills, sweet and spicy peppers, and probiotic-rich ferments. Perfect for any home chef or fermentation enthusiast.",
    price: 50.00,
    category: "starter",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "None",
    stock: 9999,
    rating: 5.0,
    reviewsCount: 15,
    ingredients: ["Gourmet Hospitality", "Fermentation Passion", "Good Taste"],
    sellerName: "Hamod & Har Official",
    tags: ["giftcard", "digital"],
    size: "Digital Delivery"
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    title: "Crispy Country Dill Fried Pickles",
    description: "Get that perfect tavern-style crunch at home! These beer-battered pickle chips are best cooked using heavily spiced garlic dills. Served alongside a homemade spicy jalapeño ranch dip.",
    image: "https://images.unsplash.com/photo-1621370041285-d7256e090aef?auto=format&fit=crop&q=80&w=800",
    difficulty: "Easy",
    prepTime: "15 mins",
    cookTime: "10 mins",
    ingredients: [
      "2 cups of Classic Garlic Dill Spears, sliced into 1/4-inch chips",
      "1 cup of all-purpose flour",
      "1/2 cup of local cornstarch",
      "1 tsp of smoked paprika and onion powder",
      "1 cup of cold light lager or club soda",
      "Vegetable oil for high-heat pan frying",
      "Sour cream, dill weed, and finely minced pickled jalapeños (for dip)"
    ],
    instructions: [
      "Drain the cucumber chips completely and pat them thoroughly dry on heavy paper towels.",
      "In a shallow mixing bowl, whisk together the flour, cornstarch, salt, paprika, and onion powder.",
      "Pour cold lager gradually into the flour mix, whisking constantly until a smooth buttermilk-like batter forms.",
      "Heat 1.5 inches of vegetable oil in a heavy iron skillet until it reaches 375°F (190°C).",
      "Dip each pickle slice into the cold batter, letting any excess drip off, then slide carefully into hot oil.",
      "Fry chips for 2-3 minutes per side until they turn deeply golden brown and highly crisp. Drain on a wire rack.",
      "Serve hot alongside your favorite cool dipping ranch mixed with pickled pepper flakes."
    ],
    spiceLevel: "Mild",
    author: "Chef Brenda 'Brine' Miller",
    relatedProductIds: ["prod-1", "prod-2"],
    approved: true,
    createdAt: "2026-05-12T10:00:00Z"
  },
  {
    id: "rec-2",
    title: "Double-Crust Spicy Habanero Burger Stacker",
    description: "An explosive gourmet burger experience. Searing beef patties topped with dripping cheddar, heavy garlic mayo, and heaps of sweet and spicy crisp bread & butters paired with caramelized shallots.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    difficulty: "Advanced",
    prepTime: "20 mins",
    cookTime: "15 mins",
    ingredients: [
      "1/2 cup Sweet Heat Bread & Butter Chips",
      "1 lb Premium Ground Chuck beef (80/20 ratio)",
      "4 Brioche Burger Buns",
      "4 slices of Aged Wisconsin Cheddar Cheese",
      "1 red onion, sliced thin on a mandoline",
      "2 tbsp Signature Barrel-Aged Chili Crisp Oil",
      "1/4 cup real mayonnaise"
    ],
    instructions: [
      "Preheat a cast-iron flat-top skillet on high heat until smoking.",
      "Squeeze the beef into four 4oz balls. Press them down hard on the smoking hot metal to create a crisp, charred outer lace crust.",
      "Flip the patties after 2 minutes, slap on cheddar slices immediately, and cover to let the cheese melt perfectly.",
      "Toast brioche burger buns spread with butter until lightly golden.",
      "Whisk mayonnaise with a tablespoon of Signature Barrel-Aged Chili Crisp Oil to create a rich, glowing spicy burger sauce.",
      "Assemble: spread the bottom bun with the spicy mayo, lay on two charred cheddar patties, mound high with candied onions and a massive layer of Sweet Heat Bread & Butter Chips. Press down and feast!"
    ],
    spiceLevel: "Medium",
    author: "Marcus Vance",
    relatedProductIds: ["prod-2", "prod-7"],
    approved: true,
    createdAt: "2026-05-20T14:30:00Z"
  },
  {
    id: "rec-3",
    title: "The Ultimate Fermented Probiotic Chili Paste",
    description: "Harness the power of wild fermentation! Learn how to transform standard grocery chilis into an incredibly complex, probiotic-packed hot paste using our custom starter cultures.",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&q=80&w=800",
    difficulty: "Time-Intensive",
    prepTime: "25 mins",
    cookTime: "48 hours (Fermentation)",
    ingredients: [
      "1 packet Wild Fermented Kimchi Paste & Starter",
      "2 lbs fresh ripe Red Chili Peppers or Serranos",
      "6 garlic cloves, organic peeled",
      "1 tbsp non-iodized sea salt (iodine inhibits lactobacillus)",
      "1 cup filtered dechlorinated water"
    ],
    instructions: [
      "Roughly chop the fresh chili peppers while wearing safety gloves (essential for hot chilis!). Retain seeds for extra heat.",
      "In a sterilized glass jar, pack the chopped peppers and garlic cloves tightly, leaving 2 inches of headspace.",
      "Combine sea salt and dechlorinated water to make a simple salt brine. Dissolve completely.",
      "Blend a tablespoon of our active culture Starter paste with the brine, then pour over the chilis. Use a fermentation weight to ensure all peppers remain safely submerged under the liquid line.",
      "Cap the jar with an active fermentation airlock lid or burp it daily in a dark cupboard (68-75°F) for 3-7 days.",
      "Once you see active bubbles and smell a sharp, delicious tang, pour the ingredients into a blender and spin till incredibly smooth. Bottle and keep in the fridge!"
    ],
    spiceLevel: "Extreme",
    author: "Grandpa Kim",
    relatedProductIds: ["prod-6", "prod-3"],
    approved: true,
    createdAt: "2026-06-01T09:15:00Z"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    author: "Evelyn K.",
    rating: 5,
    date: "2026-06-10",
    comment: "These dill spears have altered my life path. They maintain a phenomenal crunch that you just cannot find in national brand grocery aisles. Absolute top-tier garlic bite!",
    verified: true
  },
  {
    id: "rev-2",
    productId: "prod-1",
    author: "Dave S.",
    rating: 4,
    date: "2026-06-05",
    comment: "Great flavor, dill is extremely fragrant. I wish there was just a tiny bit more salt in the brine, but otherwise superb snaps.",
    verified: true
  },
  {
    id: "rev-3",
    productId: "prod-2",
    author: "Samantha Cook",
    rating: 5,
    date: "2026-06-12",
    comment: "Simply spectacular on cheeseburgers! The habanero is subtly integrated. It doesn't instantly scorch you, but offers a lingering, playful heat that marries the sweetness beautifully.",
    verified: true
  },
  {
    id: "rev-4",
    productId: "prod-4",
    author: "SpicyGamer99",
    rating: 5,
    date: "2026-06-11",
    comment: "A monumental challenge. My forehead was sweating within 5 seconds. Yet they didn't skimp on flavor—the floral ghost pepper taste comes across nicely before the flames activate. 10/10.",
    verified: false
  },
  {
    id: "rev-5",
    productId: "prod-7",
    author: "Chef Raymond",
    rating: 5,
    date: "2026-06-13",
    comment: "The bourbon barrel-aging shines in the aroma. It has a beautiful sweet-smoke background. The inclusion of crispy bits of dried pickles is a stroke of pure culinary genius.",
    verified: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-94812",
    customerName: "Alice Henderson",
    customerEmail: "alice.h@example.com",
    shippingAddress: "452 Oak Avenue, Suite 4B",
    city: "Chicago",
    zipCode: "60614",
    paymentMethod: "Visa ended 4311",
    items: [
      {
        productId: "prod-1",
        productName: "Classic Garlic Dill Spears",
        price: 9.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800"
      },
      {
        productId: "prod-7",
        productName: "Signature Barrel-Aged Chili Crisp Oil",
        price: 12.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
      }
    ],
    subtotal: 32.97,
    shippingAndTax: 5.40,
    total: 38.37,
    status: "Completed",
    createdAt: "2026-06-10T11:40:00Z"
  },
  {
    id: "ORD-30511",
    customerName: "Robert Vance",
    customerEmail: "bob@vancefrigeration.com",
    shippingAddress: "1724 Scranton industrial Blvd",
    city: "Scranton",
    zipCode: "18508",
    paymentMethod: "Google Pay",
    items: [
      {
        productId: "prod-3",
        productName: "Smoked Jalapeño Rings",
        price: 10.99,
        quantity: 3,
        image: "https://images.unsplash.com/photo-1583224933948-2b8aaeeed42c?auto=format&fit=crop&q=80&w=800"
      }
    ],
    subtotal: 32.97,
    shippingAndTax: 4.90,
    total: 37.87,
    status: "Shipped",
    createdAt: "2026-06-12T15:20:00Z"
  },
  {
    id: "ORD-11029",
    customerName: "Cassandra Cruz",
    customerEmail: "cassy.cruz@gmail.com",
    shippingAddress: "901 Desert Willow Dr",
    city: "Phoenix",
    zipCode: "85002",
    paymentMethod: "Mastercard ended 9081",
    items: [
      {
        productId: "prod-4",
        productName: "The Ghost Pepper Decimator",
        price: 13.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?auto=format&fit=crop&q=80&w=800"
      },
      {
        productId: "prod-5",
        productName: "Candied Serrano Slivers",
        price: 9.49,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800"
      }
    ],
    subtotal: 23.48,
    shippingAndTax: 4.15,
    total: 27.63,
    status: "Pending",
    createdAt: "2026-06-13T19:42:00Z"
  }
];

export const INITIAL_SELLER_SUBMISSIONS: SellerProductSubmission[] = [
  {
    id: "sub-1",
    name: "Aunt May's Pickled Sweet Garlic",
    description: "Whole plump garlic cloves pickled in vinegar and sugar until sweet, translucent, and perfect for snacking, antipastoboards, or martini skewers. Extremely low heat but incredible robust flavor.",
    price: 7.99,
    category: "pickle",
    spiceLevel: "None",
    ingredients: ["Garlic Cloves", "Vinegar", "Raw Sugar", "Salt", "Bay Leaf"],
    sellerName: "Aunt May's Jars",
    sellerEmail: "may.parker@example.com",
    status: "Pending",
    createdAt: "2026-06-13T10:00:00Z"
  },
  {
    id: "sub-2",
    name: "Fermented Habanero Mango Elixir",
    description: "A thick, velvety direct hot sauce mash combining fully fermented orange habaneros and fresh organic Kent mangoes. Bright fruity notes with immediate high-scale capsicum punch.",
    price: 11.50,
    category: "pepper",
    spiceLevel: "Hot",
    ingredients: ["Fermented Habanero Peppers", "Organic Mangoes", "Mustard Seed", "Lime juice", "Vinegar", "Cane Sugar"],
    sellerName: "Citrus & Stinger",
    sellerEmail: "info@citrusstinger.com",
    status: "Pending",
    createdAt: "2026-06-13T14:45:00Z"
  }
];

export const INITIAL_RECIPE_SUBMISSIONS: RecipeSubmission[] = [
  {
    id: "rsub-1",
    title: "Crispy Beer Batter Jalapeno Poppers",
    description: "Crisp and velvety cream-cheese stuffed fresh jalapenos dipped in cold double-hopped IPA batter. Crisp fry for 3 minutes for the ultimate football sunday plate.",
    difficulty: "Advanced",
    prepTime: "20 mins",
    cookTime: "10 mins",
    ingredients: ["12 Fresh medium Jalapeno peppers", "8 oz cream cheese, softened", "1 cup shredded Cheddar cheese", "1 cup sifted flour", "1 cup cold India Pale Ale beer", "Seasonings: cayenne, coarse salt"],
    instructions: ["Cut jalapeños in half lengthwise and clean out seeds completely using a spoon.", "Combine cream cheese with shredded cheddar and stuff each jalapeño half tightly.", "Whisk flour with beer and a pinch of cayenne until a sticky smooth batter is formed.", "Dip the stuffed jalapeños entirely, then slide into 375°F clean vegetable oil for 3 minutes until gold and popping."],
    spiceLevel: "Hot",
    author: "Danielle Peppers",
    authorEmail: "danielle@pepperheads.org",
    status: "Pending",
    createdAt: "2026-06-13T08:15:00Z"
  }
];

export const INITIAL_RECIPE_REVIEWS: RecipeReview[] = [
  {
    id: "rec-rev-1",
    recipeId: "rec-1",
    author: "BrineLover99",
    rating: 5,
    date: "2026-06-01",
    comment: "These were mindblowing! Followed the tip about drying the pickle slices thoroughly and they came out perfectly crispy, not soggy at all."
  },
  {
    id: "rec-rev-2",
    recipeId: "rec-1",
    author: "Sally_Spices",
    rating: 4,
    date: "2026-06-05",
    comment: "Excellent batter, nice and airy. It went great with the garlic dills. Could use a tiny bit more pepper in the flour though."
  },
  {
    id: "rec-rev-3",
    recipeId: "rec-2",
    author: "BurgerKingJames",
    rating: 5,
    date: "2026-06-03",
    comment: "The spicy mayo layer with the Habanero Burger is next-level. This has officially become our weekly family tradition."
  },
  {
    id: "rec-rev-4",
    recipeId: "rec-3",
    author: "FermentFanatic",
    rating: 5,
    date: "2026-06-10",
    comment: "Very solid recipe for lacto fermentation. Mine has been bubbling nicely for 5 days. Tasting incredible already!"
  }
];
