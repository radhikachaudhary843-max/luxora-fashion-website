const ADMIN_PRODUCTS_KEY = "luxora_products";

function isBrowser() {
  return typeof window !== "undefined";
}

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export function getAdminProducts() {
  if (!isBrowser()) return [];

  try {
    const products = localStorage.getItem(
      ADMIN_PRODUCTS_KEY
    );

    if (!products) return [];

    const parsedProducts = JSON.parse(products);

    return Array.isArray(parsedProducts)
      ? parsedProducts
      : [];
  } catch (error) {
    console.error(
      "Failed to load admin products:",
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE PRODUCTS
========================================================= */

function saveAdminProducts(products) {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(
      ADMIN_PRODUCTS_KEY,
      JSON.stringify(products)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save admin products:",
      error
    );

    return false;
  }
}

/* =========================================================
   ADD PRODUCT
========================================================= */

export function addAdminProduct(product = {}) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const products = getAdminProducts();

  const name = String(
    product.name || ""
  ).trim();

  const description = String(
    product.description || ""
  ).trim();

  const category = String(
    product.category || ""
  ).trim();

  const price = Number(
    product.price
  ) || 0;

  const discount = Number(
    product.discount
  ) || 0;

  const stock = Number(
    product.stock
  ) || 0;

  const image = String(
    product.image || ""
  ).trim();

  if (!name) {
    return {
      success: false,
      message:
        "Product name is required.",
    };
  }

  if (!category) {
    return {
      success: false,
      message:
        "Product category is required.",
    };
  }

  if (price < 0) {
    return {
      success: false,
      message:
        "Price cannot be negative.",
    };
  }

  if (discount < 0 || discount > 100) {
    return {
      success: false,
      message:
        "Discount must be between 0 and 100.",
    };
  }

  if (stock < 0) {
    return {
      success: false,
      message:
        "Stock cannot be negative.",
    };
  }

  const newProduct = {
    id: `product_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    name,

    description,

    category,

    price,

    discount,

    stock,

    image,

    featured:
      product.featured === true,

    active:
      product.active !== false,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  const saved = saveAdminProducts([
    newProduct,
    ...products,
  ]);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to create product.",
    };
  }

  return {
    success: true,
    message:
      "Product added successfully.",
    product: newProduct,
  };
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export function updateAdminProduct(
  productId,
  updates = {}
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const products = getAdminProducts();

  const productIndex =
    products.findIndex(
      (product) =>
        product.id === productId
    );

  if (productIndex === -1) {
    return {
      success: false,
      message:
        "Product not found.",
    };
  }

  const existingProduct =
    products[productIndex];

  const updatedProduct = {
    ...existingProduct,

    name:
      updates.name !== undefined
        ? String(
            updates.name
          ).trim()
        : existingProduct.name,

    description:
      updates.description !== undefined
        ? String(
            updates.description
          ).trim()
        : existingProduct.description,

    category:
      updates.category !== undefined
        ? String(
            updates.category
          ).trim()
        : existingProduct.category,

    price:
      updates.price !== undefined
        ? Number(
            updates.price
          ) || 0
        : existingProduct.price,

    discount:
      updates.discount !== undefined
        ? Number(
            updates.discount
          ) || 0
        : existingProduct.discount,

    stock:
      updates.stock !== undefined
        ? Number(
            updates.stock
          ) || 0
        : existingProduct.stock,

    image:
      updates.image !== undefined
        ? String(
            updates.image
          ).trim()
        : existingProduct.image,

    featured:
      updates.featured !== undefined
        ? Boolean(
            updates.featured
          )
        : existingProduct.featured,

    active:
      updates.active !== undefined
        ? Boolean(
            updates.active
          )
        : existingProduct.active,

    updatedAt:
      new Date().toISOString(),
  };

  if (!updatedProduct.name) {
    return {
      success: false,
      message:
        "Product name is required.",
    };
  }

  if (!updatedProduct.category) {
    return {
      success: false,
      message:
        "Product category is required.",
    };
  }

  if (updatedProduct.price < 0) {
    return {
      success: false,
      message:
        "Price cannot be negative.",
    };
  }

  if (
    updatedProduct.discount < 0 ||
    updatedProduct.discount > 100
  ) {
    return {
      success: false,
      message:
        "Discount must be between 0 and 100.",
    };
  }

  if (updatedProduct.stock < 0) {
    return {
      success: false,
      message:
        "Stock cannot be negative.",
    };
  }

  products[productIndex] =
    updatedProduct;

  const saved =
    saveAdminProducts(products);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to update product.",
    };
  }

  return {
    success: true,
    message:
      "Product updated successfully.",
    product: updatedProduct,
  };
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export function deleteAdminProduct(
  productId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const products = getAdminProducts();

  const exists = products.some(
    (product) =>
      product.id === productId
  );

  if (!exists) {
    return {
      success: false,
      message:
        "Product not found.",
    };
  }

  const updatedProducts =
    products.filter(
      (product) =>
        product.id !== productId
    );

  const saved =
    saveAdminProducts(
      updatedProducts
    );

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to delete product.",
    };
  }

  return {
    success: true,
    message:
      "Product deleted successfully.",
  };
}

/* =========================================================
   GET PRODUCT BY ID
========================================================= */

export function getAdminProductById(
  productId
) {
  if (!productId) return null;

  const products =
    getAdminProducts();

  return (
    products.find(
      (product) =>
        product.id === productId
    ) || null
  );
}

/* =========================================================
   TOGGLE ACTIVE STATUS
========================================================= */

export function toggleAdminProductStatus(
  productId
) {
  const product =
    getAdminProductById(
      productId
    );

  if (!product) {
    return {
      success: false,
      message:
        "Product not found.",
    };
  }

  return updateAdminProduct(
    productId,
    {
      active: !product.active,
    }
  );
}

/* =========================================================
   TOGGLE FEATURED STATUS
========================================================= */

export function toggleAdminProductFeatured(
  productId
) {
  const product =
    getAdminProductById(
      productId
    );

  if (!product) {
    return {
      success: false,
      message:
        "Product not found.",
    };
  }

  return updateAdminProduct(
    productId,
    {
      featured:
        !product.featured,
    }
  );
}

/* =========================================================
   GET PRODUCTS BY CATEGORY
========================================================= */

export function getAdminProductsByCategory(
  category
) {
  const products =
    getAdminProducts();

  if (!category) {
    return products;
  }

  return products.filter(
    (product) =>
      String(
        product.category || ""
      ).toLowerCase() ===
      String(category)
        .trim()
        .toLowerCase()
  );
}