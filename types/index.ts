export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreatePartInput {
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image?: File;
}
