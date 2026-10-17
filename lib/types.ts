export interface Category {
    _id?: string;
    name: string;
    description?: string
}

export interface Supplier {
    _id?: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    companyName: string;
}

export interface Product {
    _id: string;
    productName: string;
    sku: string;
    quantity: number;
    minimumStock: number;
    purchasePrice: number;
    sellingPrice: number;
    brand?: string;
    description?: string;
    category: Category;
    supplier: Supplier;
}
export interface ProductFormData {
    productName: string;
    sku: string;
    quantity: number;
    minimumStock: number;
    purchasePrice: number;
    sellingPrice: number;
    brand?: string;
    description?: string;
    category: string;
    supplier: string;
}