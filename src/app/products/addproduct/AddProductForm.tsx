"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { client } from "@/sanity/lib/client";
import { ToastContainer, toast } from "react-toastify";

type ColorImages = {
  [color: string]: File[];
};

type ProductData = {
  name: string;
  description: string;
  price: number;
  cost: number;
  discountPercent: number;
  category: string;
  stock: number;
  tags: string[];
  sizes: string[];
  colors: string[];
  isNew: boolean;
  rating: number;
  images: ColorImages;
};

export default function AddProductForm() {
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    cost: 0,
    discountPercent: 0,
    category: "",
    stock: 0,
    tags: [],
    sizes: [],
    colors: [],
    isNew: false,
    rating: 0,
    images: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    color: string
  ) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [color]: Array.from(e.target.files!),
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const imageAssets = await Promise.all(
        Object.entries(formData.images).flatMap(([color, files]) =>
          files.map((file) =>
            client.assets
              .upload("image", file)
              .then((asset) => ({ asset, color }))
          )
        )
      );

      const productData = {
        _type: "products",
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        cost: Number(formData.cost),
        discountPercent: Number(formData.discountPercent),
        category: formData.category,
        stock: Number(formData.stock),
        tags: formData.tags,
        sizes: formData.sizes,
        colors: formData.colors,
        isNew: formData.isNew,
        rating: Number(formData.rating),
        slug: formData.name.toLowerCase().replace(/ /g, "-"),
        images: formData.colors.map((color) => ({
          _key: color,
          color: color,
          image: imageAssets
            .filter((img) => img.color === color)
            .map((img) => ({
              _type: "image",
              asset: {
                _type: "reference",
                _ref: img.asset._id,
              },
            })),
        })),
      };

      await client.create(productData);
      toast.success("Product has been added", {
        position: "top-right",
        autoClose: 2000,
      });
      setFormData({
        name: "",
        description: "",
        price: 0,
        cost: 0,
        discountPercent: 0,
        category: "",
        stock: 0,
        tags: [],
        sizes: [],
        colors: [],
        isNew: false,
        rating: 0,
        images: {},
      })
    } catch (error) {
      console.error("Error adding product:", error);
      setError("An error occurred while adding the product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <ToastContainer />
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
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
            required
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
          required
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sizes">Sizes (comma-separated)</Label>
        <Input
          id="sizes"
          name="sizes"
          value={formData.sizes.join(", ")}
          onChange={(e) => handleArrayChange(e, "sizes")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colors">Colors (comma-separated)</Label>
        <Input
          id="colors"
          name="colors"
          value={formData.colors.join(", ")}
          onChange={(e) => handleArrayChange(e, "colors")}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isNew"
          checked={formData.isNew}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isNew: checked as boolean }))
          }
          required
        />
        <Label htmlFor="isNew">Is New</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        <Input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
          step="0.1"
          min="0"
          max="5"
        />
      </div>

      <div className="space-y-4">
        <Label>Images</Label>
        <p>Fields will show after selecting color</p>
        <p className="text-yellow-600">
          Make sure if you want to upload multiple images for each color select
          all images in one time for a single color.
        </p>
        {formData.colors.map((color) => (
          <div key={color} className="space-y-2">
            <Label htmlFor={`images-${color}`}>{color} Images</Label>
            <Input
              type="file"
              id={`images-${color}`}
              name={`images-${color}`}
              onChange={(e) => handleImageChange(e, color)}
              required
              multiple
              accept="image/*"
            />
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding Product..." : "Add Product"}
      </Button>
    </form>
  );
}
