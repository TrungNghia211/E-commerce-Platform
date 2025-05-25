export interface ShopCreationRequest {
    id: number;

    name: string;
  
    phone: string;
  
    addressLine: string;
  
    provinceId: number;
    provinceName: string;
  
    districtId: number;
    districtName: string;
  
    wardId: number;
    wardName: string;
  
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolderName: string;
  
    citizenIdFrontImage: File;
    citizenIdBackImage: File;
}