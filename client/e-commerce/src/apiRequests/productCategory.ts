import http from "@/lib/http";

const productCategoryApiRequest = {
  get8ProductCategories: () => http.get<any>("/categories"),

  createProductCategory: (formData: FormData) =>
    http.post("/categories", formData),

  getAllCategories: () => http.get<any>("/categories/all"),
};

export default productCategoryApiRequest;
