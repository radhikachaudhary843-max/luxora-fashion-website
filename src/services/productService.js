import products from "@/data/products";

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find(
    (product) => product.id === id
  );
}

export function getProductsByCategory(category) {
  return products.filter(
    (product) =>
      product.category.toLowerCase() ===
      category.toLowerCase()
  );
}

export function getNewProducts() {
  return products.filter(
    (product) => product.badge === "New"
  );
}

export function getBestsellers() {
  return products.filter(
    (product) => product.badge === "Bestseller"
  );
}

export function getTrendingProducts() {
  return products.filter(
    (product) => product.badge === "Trending"
  );
}