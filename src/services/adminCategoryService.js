const CATEGORIES_KEY = "luxora_categories";

function isBrowser() {
  return typeof window !== "undefined";
}

/* =========================================================
   GET CATEGORIES
========================================================= */

export function getAdminCategories() {
  if (!isBrowser()) return [];

  try {
    const saved =
      localStorage.getItem(CATEGORIES_KEY);

    if (!saved) return [];

    const categories = JSON.parse(saved);

    return Array.isArray(categories)
      ? categories
      : [];
  } catch (error) {
    console.error(
      "Failed to load categories:",
      error
    );

    return [];
  }
}

/* =========================================================
   SAVE CATEGORIES
========================================================= */

function saveCategories(categories) {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(categories)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save categories:",
      error
    );

    return false;
  }
}

/* =========================================================
   ADD CATEGORY
========================================================= */

export function addAdminCategory({
  name,
  description = "",
  image = "",
}) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const cleanName =
    String(name || "").trim();

  const cleanDescription =
    String(description || "").trim();

  const cleanImage =
    String(image || "").trim();

  if (!cleanName) {
    return {
      success: false,
      message:
        "Category name is required.",
    };
  }

  const categories =
    getAdminCategories();

  const exists = categories.some(
    (category) =>
      String(category.name || "")
        .trim()
        .toLowerCase() ===
      cleanName.toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      message:
        "This category already exists.",
    };
  }

  const newCategory = {
    id: `category_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    name: cleanName,

    description:
      cleanDescription,

    image: cleanImage,

    active: true,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  const saved =
    saveCategories([
      ...categories,
      newCategory,
    ]);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to create category.",
    };
  }

  return {
    success: true,
    message:
      "Category created successfully.",
    category: newCategory,
  };
}

/* =========================================================
   UPDATE CATEGORY
========================================================= */

export function updateAdminCategory(
  categoryId,
  updates = {}
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  if (!categoryId) {
    return {
      success: false,
      message:
        "Category ID is required.",
    };
  }

  const categories =
    getAdminCategories();

  const index =
    categories.findIndex(
      (category) =>
        category.id === categoryId
    );

  if (index === -1) {
    return {
      success: false,
      message:
        "Category not found.",
    };
  }

  const updatedName =
    updates.name !== undefined
      ? String(
          updates.name || ""
        ).trim()
      : categories[index].name;

  if (!updatedName) {
    return {
      success: false,
      message:
        "Category name is required.",
    };
  }

  const duplicate =
    categories.some(
      (category, categoryIndex) =>
        categoryIndex !== index &&
        String(
          category.name || ""
        )
          .trim()
          .toLowerCase() ===
          updatedName.toLowerCase()
    );

  if (duplicate) {
    return {
      success: false,
      message:
        "Another category already uses this name.",
    };
  }

  const updatedCategory = {
    ...categories[index],

    name: updatedName,

    description:
      updates.description !== undefined
        ? String(
            updates.description || ""
          ).trim()
        : categories[index]
            .description || "",

    image:
      updates.image !== undefined
        ? String(
            updates.image || ""
          ).trim()
        : categories[index].image ||
          "",

    active:
      updates.active !== undefined
        ? Boolean(updates.active)
        : categories[index].active !==
          false,

    updatedAt:
      new Date().toISOString(),
  };

  const updatedCategories =
    [...categories];

  updatedCategories[index] =
    updatedCategory;

  const saved =
    saveCategories(
      updatedCategories
    );

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to update category.",
    };
  }

  return {
    success: true,
    message:
      "Category updated successfully.",
    category:
      updatedCategory,
  };
}

/* =========================================================
   DELETE CATEGORY
========================================================= */

export function deleteAdminCategory(
  categoryId
) {
  if (!isBrowser()) {
    return {
      success: false,
      message:
        "Browser storage is not available.",
    };
  }

  const categories =
    getAdminCategories();

  const exists =
    categories.some(
      (category) =>
        category.id === categoryId
    );

  if (!exists) {
    return {
      success: false,
      message:
        "Category not found.",
    };
  }

  const filtered =
    categories.filter(
      (category) =>
        category.id !== categoryId
    );

  const saved =
    saveCategories(filtered);

  if (!saved) {
    return {
      success: false,
      message:
        "Unable to delete category.",
    };
  }

  return {
    success: true,
    message:
      "Category deleted successfully.",
  };
}

/* =========================================================
   TOGGLE CATEGORY STATUS
========================================================= */

export function toggleAdminCategoryStatus(
  categoryId
) {
  const categories =
    getAdminCategories();

  const category =
    categories.find(
      (item) =>
        item.id === categoryId
    );

  if (!category) {
    return {
      success: false,
      message:
        "Category not found.",
    };
  }

  return updateAdminCategory(
    categoryId,
    {
      active:
        category.active === false,
    }
  );
}

/* =========================================================
   GET CATEGORY BY ID
========================================================= */

export function getAdminCategoryById(
  categoryId
) {
  if (!categoryId) return null;

  const categories =
    getAdminCategories();

  return (
    categories.find(
      (category) =>
        category.id === categoryId
    ) || null
  );
}

/* =========================================================
   GET CATEGORY BY NAME
========================================================= */

export function getAdminCategoryByName(
  name
) {
  if (!name) return null;

  const normalizedName =
    String(name)
      .trim()
      .toLowerCase();

  const categories =
    getAdminCategories();

  return (
    categories.find(
      (category) =>
        String(
          category.name || ""
        )
          .trim()
          .toLowerCase() ===
        normalizedName
    ) || null
  );
}