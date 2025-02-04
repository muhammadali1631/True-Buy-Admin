"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { ToastContainer, toast } from "react-toastify";

type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

type Image = {
  _key: string;
  image: SanityImage[];
  color: string;
};

type Product = {
  discountPercent: number;
  name: string;
  _updatedAt: string;
  _rev: string;
  description: string;
  tags: string[];
  sizes: string[];
  _createdAt: string;
  slug: string;
  images: Image[];
  cost: number;
  rating: number;
  _id: string;
  _type: string;
  isNew: boolean;
  colors: string[];
  price: number;
  category: string;
  stock: number;
};

export default function ProductEditForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState<Product>(product);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "tags" | "sizes" | "colors"
  ) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.patch(product._id).set({
        discountPercent: Number(formData.discountPercent),
        name: formData.name,
        description: formData.description,
        tags: formData.tags,
        sizes: formData.sizes,
        slug: formData.slug,
        cost: Number(formData.cost),
        rating: Number(formData.rating),
        isNew: formData.isNew,
        colors: formData.colors,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),}).commit();
      toast.success("Status has been updated", {
        position: "top-right",
        autoClose: 2000,
      });
      console.log(formData)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-2xl mx-auto my-7 px-4"
    >
      <ToastContainer />
      <h3 className="font-bold text-2xl ">Edit: {formData.name}</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountPercent">Discount Percent</Label>
          <Input
            type="number"
            id="discountPercent"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags.join(", ")}
          onChange={(e) => handleArrayChange(e, "tags")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sizes">Sizes (comma-separated)</Label>
        <Input
          id="sizes"
          name="sizes"
          value={formData.sizes.join(", ")}
          onChange={(e) => handleArrayChange(e, "sizes")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colors">Colors (comma-separated)</Label>
        <Input
          id="colors"
          name="colors"
          value={formData.colors.join(", ")}
          onChange={(e) => handleArrayChange(e, "colors")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="isNew">Is New</Label>
        <Select
          name="isNew"
          value={formData.isNew.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, isNew: value === "true" }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <Input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="5"
        />
      </div>

      <div className="space-y-4">
        <Label>Images</Label>
        <h3>Sorry Currently you can not change</h3>
        <div className="flex gap-2 flex-wrap justify-around">
          {formData.images.map((image, index) => (
            <div key={image._key} className="space-y-2">
              <Image
                src={urlFor(image.image[0]).url()}
                alt={`Product image ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg object-cover h-[200px] w-[200px]"
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Update Product
      </Button>
    </form>
  );
}
