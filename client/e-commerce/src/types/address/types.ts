export interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

export interface District {
  DistrictID: number;
  DistrictName: string;
}

export interface Ward {
  WardCode: number;
  WardName: string;
}

export interface StoreCreationRequestType {
  district_id: number | undefined;
  ward_code: string | undefined;
  name: string;
  phone: string;
  address: string;
}