export interface ProductType {
    _type: string;
    slug: string;
    stock: number;
    discountPercent: number;
    price: number;
    _createdAt: string;
    _updatedAt: string;
    name: string;
    _id: string;
    images: ImageVariant[];
    rating: number;
    colors: string[];
    sizes: string[];
    category: string;
    _rev: string;
    description: string;
    isNew: boolean;
    tags: string[];
    cost: number;
  }

interface ImageVariant {
  _key: string;
  color: string;
  image: Image[];
}

interface Image {
  _type: string;
  asset: {
    _ref: string;
  };
}