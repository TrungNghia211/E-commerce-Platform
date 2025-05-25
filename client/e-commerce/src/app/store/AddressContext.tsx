"use client";

import { createContext, useState } from "react";

import { District, Province, Ward } from "@/types/address/types";

interface AddressContextType {
  province: Province | undefined;
  district: District | undefined;
  ward: Ward | undefined;
  setProvince: (province: Province) => void;
  setDistrict: (district: District) => void;
  setWard: (ward: Ward) => void;
}

export const AddressContext = createContext<AddressContextType>({
  province: undefined,
  district: undefined,
  ward: undefined,
  setProvince: () => {},
  setDistrict: () => {},
  setWard: () => {},
});

export const AddressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [province, setProvince] = useState<Province | undefined>(undefined);
  const [district, setDistrict] = useState<District | undefined>(undefined);
  const [ward, setWard] = useState<Ward | undefined>(undefined);

  const value: AddressContextType = {
    province,
    district,
    ward,
    setProvince,
    setDistrict,
    setWard,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
