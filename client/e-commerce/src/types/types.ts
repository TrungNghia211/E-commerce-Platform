export type RegisterFormValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type RegisterValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginValues = {
  username: string;
  password: string;
};

export interface Role {
  name: string;
  description: string;
}

export interface Category {
  key: string;
  name: string;
  slug: string;
  thumbnail?: string;
  visible: boolean;
  parentId?: string;
  children?: Category[];
}
