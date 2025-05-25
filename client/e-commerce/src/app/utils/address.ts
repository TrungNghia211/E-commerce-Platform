import { GHN_API_TOKEN } from "@/app/constants/constants";
import { District, Province, StoreCreationRequestType, Ward } from "@/types/address/types";

const getProvinces = async (): Promise<Province[]> => {
  const res = await fetch(
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
    {
      headers: { Token: GHN_API_TOKEN },
    }
  );
  const data = await res.json();
  return data.code === 200 ? data.data : [];
};

const getDistricts = async (provinceId: number): Promise<District[]> => {
  const res = await fetch(
    `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
    {
      headers: { Token: GHN_API_TOKEN },
    }
  );
  const data = await res.json();
  return data.code === 200 ? data.data : [];
};

const getWards = async (districtId: number): Promise<Ward[]> => {
  const res = await fetch(
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Token: GHN_API_TOKEN },
      body: JSON.stringify({ district_id: districtId }),
    }
  );
  const data = await res.json();
  return data.code === 200 ? data.data : [];
};

const createShopGHN = async (request: StoreCreationRequestType): Promise<Number> => {
  const res = await fetch(
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Token: GHN_API_TOKEN },
      body: JSON.stringify(request)
    }
  );
  const response = await res.json();
  return response.data.shop_id;
};

export { getProvinces, getDistricts, getWards, createShopGHN };
