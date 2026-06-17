export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  colors: Color[];
  description: string;
  image: string;
  gallery: string[];
  featured: boolean;
  created_at?: string;
}
