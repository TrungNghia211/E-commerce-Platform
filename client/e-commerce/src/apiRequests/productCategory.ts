import http from "@/lib/http";

const productCategoryApiRequest = {
  get8ProductCategories: () => http.get<any>("/categories"),
};

export default productCategoryApiRequest;
