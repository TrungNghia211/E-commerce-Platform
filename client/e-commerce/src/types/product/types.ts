import { UploadFile } from "antd/lib/upload/interface";

export interface FormVariation {
  name: string;
  options: string[];
}

export interface ProductItem {
  id: string;
  variationOptions: { name: string; value: string }[];
  sku: string;
  price: number;
  quantityInStock: number;
  thumbnail?: UploadFile[];
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
