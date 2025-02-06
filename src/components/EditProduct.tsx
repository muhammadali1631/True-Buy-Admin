'use client';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ProductType } from "@/types/Products";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const UpdateProduct = ({ product }: { product: ProductType }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState<{ [color: string]: { files: File[], previewUrls: string[] } }>({});

  // Pre-fill form fields with existing product data
  setValue("name", product.name);
  setValue("description", product.description);
  setValue("price", product.price);
  setValue("discountPercent", product.discountPercent);
  setValue("stock", product.stock);
  setValue("category", product.category);
  setValue("sizes", product.sizes.join(", "));
  setValue("colors", product.colors.join(", "));

  // Handle new image selection
  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setNewImages((prev) => ({
      ...prev,
      [color]: {
        files: prev[color]?.files || [],
        previewUrls: prev[color]?.previewUrls || [],
        files: [...prev[color]?.files || [], ...files],
        previewUrls: [...prev[color]?.previewUrls || [], ...previewUrls],
      },
    }));
  };

  const handleRemoveImage = (color: string, index: number) => {
    setNewImages((prev) => {
      if (!prev[color]) return prev;

      const updatedImages = { ...prev };
      updatedImages[color].files.splice(index, 1);
      updatedImages[color].previewUrls.splice(index, 1);
      return updatedImages;
    });
  };

  // Handle image upload to Sanity
  const handleImageUpload = async (color: string) => {
    if (!newImages[color] || newImages[color].files.length === 0) return [];

    const uploadedImages = await Promise.all(
      newImages[color].files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `https://api.sanity.io/v1/assets/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        return {
          _type: "image",
          asset: { _ref: data.document._id, _type: "reference" },
        };
      })
    );

    return uploadedImages;
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const updatedImages = { ...product.images };

      // Upload new images for colors that have updates
      for (const color of Object.keys(newImages)) {
        const uploadedImages = await handleImageUpload(color);
        if (uploadedImages.length > 0) {
          updatedImages[color] = [...(updatedImages[color] || []), ...uploadedImages];
        }
      }

      // Update product data in Sanity
    //   await client.patch(product._id)
    //     .set(
      const pro = {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          discountPercent: Number(data.discountPercent),
          stock: Number(data.stock),
          category: data.category,
          sizes: data.sizes.split(","),
          colors: data.colors.split(","),
          images: Object.entries(updatedImages).map(([color, imageArray]) => ({
            _key: color,
            color,
            image: imageArray,
          })),
        }
        console.log(pro)
        // .commit();

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Update Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Product Name" className="w-full p-2 border rounded" required />
        <textarea {...register("description")} placeholder="Description" className="w-full p-2 border rounded" required />
        <input {...register("price")} type="number" placeholder="Price" className="w-full p-2 border rounded" required />
        <input {...register("discountPercent")} type="number" placeholder="Discount (%)" className="w-full p-2 border rounded" />
        <input {...register("stock")} type="number" placeholder="Stock" className="w-full p-2 border rounded" required />
        <input {...register("category")} placeholder="Category" className="w-full p-2 border rounded" required />
        <input {...register("sizes")} placeholder="Sizes (comma separated)" className="w-full p-2 border rounded" />
        <input {...register("colors")} placeholder="Colors (comma separated)" className="w-full p-2 border rounded" />

        {/* Existing Images by Color */}
        <h3 className="text-lg font-semibold text-gray-700">Product Images</h3>
        {product.images.map((imgGroup) => (
          <div key={imgGroup._key} className="mb-4">
            <p className="font-semibold text-gray-800">{imgGroup.color}</p>
            <div className="flex space-x-2">
              {imgGroup.image.map((img: any, idx: number) => (
                <div key={idx} className="relative">
                  <Image
                    src={urlFor(img).url()}
                    alt={img.color}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                  <button
                    onClick={() => handleRemoveImage(imgGroup.color, idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {/* Upload New Images for Color */}
            <input
              type="file"
              multiple
              onChange={(e) => handleImageSelection(e, imgGroup.color)}
              className="mt-2 w-full border rounded p-2"
            />
            {/* Preview New Images */}
            {newImages[imgGroup.color] && (
              <div className="mt-2 flex space-x-2">
                {newImages[imgGroup.color].previewUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="New Upload"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
