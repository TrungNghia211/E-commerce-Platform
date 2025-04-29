import http from "@/lib/http";

const productApiRequest = {
  getHomepageProducts: (pageNumber: any) =>
    http.get<any>(`/products?pageNumber=${pageNumber}&pageSize=3`),
};

export default productApiRequest;
