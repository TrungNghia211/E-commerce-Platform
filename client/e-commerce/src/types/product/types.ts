import { UploadFile } from "antd/lib/upload/interface";

export interface FormVariation {
  name: string;
  options: string[];
}

export interface VariationOption {
  id: number;
  value: string;
}

export interface ProductItem {
  id: number;
  variationOptions: VariationOption[];
  sku: string;
  price: number;
  quantityInStock: number;
  thumbnail?: string;
}

export interface ProductCreationRequestPayload {
  name: string;
  slug: string;
  categoryId: number;
  description?: string;
  sku?: string;
  price?: number;
  quantityInStock?: number;
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
  variations?: { name: string; options: { value: string }[] }[];
  productItems?: {
    sku: string;
    quantityInStock: number;
    price: number;
    variationOptionValues: string[];
  }[];
}

export interface ProductFormValues {
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  thumbnail?: UploadFile[];
  sku?: string;
  price?: number;
  quantityInStock?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  variations?: FormVariation[];
}

export interface ProductVariation {
  id: number;
  name: string;
  variationOptions: VariationOption[];
}

export interface ShopType {
  id: number;
  name: string;
}

export interface ProductDetailType {
  id: number;
  name: string;
  quantityInStock: number;
  price: number;
  buyTurn: number | null;
  description: string;
  thumbnail: string;
  purchaseCount: number | null;
  categoryName: string;
  shop: ShopType | null;
  productItems: ProductItem[];
  variations: ProductVariation[];
}
