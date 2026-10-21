import { Category, ProductFormData, Supplier } from "./types";

const API_URL = "http://localhost:5000";
// PRODUCTS //
export const getDashboard = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/dashboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    })
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data.");
    }

    return data;

}
export const getProducts = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/products/getAllProducts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products data.");
    }

    return data;
};
export const getProductById = async (id: string) => {
    const token = localStorage.getItem("token");
    console.log(token)
    const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products data.");
    }

    return data;
};
export const createProduct = async (data: ProductFormData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/products/createProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(data)

    });

    const res = await response.json();

    if (!response.ok) {
        throw new Error(res.message || "Failed to create product.");
    }

    return res;
};
export const updateProductById = async (id: string, data: ProductFormData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok) {
        throw new Error(res.message || "Failed to fetch products data.");
    }

    return res;
};
export const deleteProductById = async (id: string) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    })
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to delete product")
    }
    return data
    // try { }
    // catch (error) { }
}
// END OF PRODUCTS
// CATEGORIES //
export const getCategories = async () => {

    const response = await fetch(`${API_URL}/api/category/getCategories`, {
        method: "GET",

    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories data.");
    }

    return data;
};
export const createCategory = async (data: Category) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/category/createCategory`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(data)

    });

    const res = await response.json();

    if (!response.ok) {
        throw new Error(res.message || "Failed to create category.");
    }

    return res;
};
export const getCategoryById = async (id: string) => {
    const token = localStorage.getItem("token");
    console.log(token)
    const response = await fetch(`${API_URL}/api/category/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products data.");
    }

    return data;
};
//END
// SUPPLIER -Start
export const getSuppliers = async () => {

    const response = await fetch(`${API_URL}/api/supplier/getSuppliers`, {
        method: "GET",

    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch supplier data.");
    }

    return data;
};
export const createSupplier = async (data: Supplier) => {
    console.log(data)
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/supplier/createSupplier`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(data)

    });

    const res = await response.json();

    if (!response.ok) {
        throw new Error(res.message || "Failed to create supplier.");
    }

    return res;
};
export const updateSupplierById = async (id: string, data: Supplier) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/supplier/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();

    if (!response.ok) {
        throw new Error(res.message || "Failed to update supplier data.");
    }

    return res;
};

export const googleSignIn = async (credential: string) => {
    const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Google sign-in failed.");
    }

    return data;
};
export const signIn = async (credential: { email: string, password: string }) => {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Log in failed.")
    }
    return data
}
export const signUp = async (credential: { name: string, role: string, email: string, password: string }) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Sign up failed.")
    }
    return data
}
export const deleteSupplierById = async (id: string) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/supplier/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    })
    const data = await response.json();
    console.log(data)
    if (!response.ok) {
        throw new Error(data.message || "Failed to delete product")
    }
    return data

}
export const getStockInHistory = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/stock-in/getStockInHistory`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    })
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stock-in data.");
    }

    return data;

}
export const getStockOutHistory = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/stock-out/getStockOutHistory`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    })
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stock-out data.");
    }

    return data;

}