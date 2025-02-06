"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { urlFor } from "@/sanity/lib/image"
import { client } from "@/sanity/lib/client"
import { ToastContainer, toast } from "react-toastify"
import { useDropzone } from "react-dropzone"

type SanityImage = {
  _type: "image"
  asset: {
    _ref: string
    _type: "reference"
  }
}

type Image = {
  _key: string
  color: string
  image: SanityImage[]
}

type Product = {
  discountPercent: number
  name: string
  _updatedAt: string
  _rev: string
  description: string
  tags: string[]
  sizes: string[]
  _createdAt: string
  slug: string
  images: Image[]
  cost: number
  rating: number
  _id: string
  _type: string
  isNew: boolean
  colors: string[]
  price: number
  category: string
  stock: number
}

export default function ProductEditForm({ product }: { product: Product }) {
  const [formData, setFormData] = useState<Product>(product)
  const [newImages, setNewImages] = useState<{ [color: string]: File[] }>({})
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], color: string) => {
    console.log(`Dropped files for color ${color}:`, acceptedFiles)
    setNewImages((prev) => ({
      ...prev,
      [color]: [...(prev[color] || []), ...acceptedFiles],
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "tags" | "sizes" | "colors") => {
    const values = e.target.value.split(",").map((item) => item.trim())
    setFormData((prev) => ({ ...prev, [field]: values }))
  }

  const handleRemoveImage = (colorToRemove: string, indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.color === colorToRemove ? { ...img, image: img.image.filter((_, index) => index !== indexToRemove) } : img,
      ),
    }))
  }

  const handleRemoveNewImage = (color: string, index: number) => {
    setNewImages((prev) => ({
      ...prev,
      [color]: prev[color].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      console.log("Starting image upload...")
      // Upload new images
      const uploadedImages = await Promise.all(
        Object.entries(newImages).flatMap(([color, files]) =>
          files.map((file) =>
            client.assets.upload("image", file).then((asset) => {
              console.log(`Uploaded image for color ${color}:`, asset)
              return { asset, color }
            }),
          ),
        ),
      )

      console.log("All images uploaded:", uploadedImages)

      // Prepare the updated images array
      const updatedImages: Image[] = formData.colors.map((color) => {
        const existingImages = formData.images.find((img) => img.color === color)?.image || []
        const newUploadedImages = uploadedImages
          .filter((img) => img.color === color)
          .map((img) => ({
            _type: "image" as const,
            asset: { _type: "reference" as const, _ref: img.asset._id },
          }))

        console.log(`Updated images for color ${color}:`, [...existingImages, ...newUploadedImages])

        return {
          _key: color,
          color: color,
          image: [...existingImages, ...newUploadedImages],
        }
      })

      console.log("Final updated images:", updatedImages)

      // Update the product in Sanity
      const updatedProduct = await client
        .patch(product._id)
        .set({
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
          stock: Number(formData.stock),
          images: updatedImages,
        })
        .commit()

      console.log("Product updated in Sanity:", updatedProduct)

      toast.success("Product has been updated", {
        position: "top-right",
        autoClose: 2000,
      })
      // Reset new images state
      setNewImages({})
      // Update formData with the new images
      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
      }))
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product", {
        position: "top-right",
        autoClose: 2000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, color),
  })

  const colorDropzones = formData.colors.map((color) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => onDrop(acceptedFiles, color),
    })
    return { getRootProps, getInputProps, color }
  })

  useEffect(() => {
    console.log("Current formData:", formData)
    console.log("Current newImages:", newImages)
  }, [formData, newImages])

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto my-7 px-4">
      <ToastContainer />
      <h3 className="font-bold text-2xl ">Edit: {formData.name}</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input type="number" id="cost" name="cost" value={formData.cost} onChange={handleChange} required />
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
          <Input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" value={formData.tags.join(", ")} onChange={(e) => handleArrayChange(e, "tags")} />
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
          onValueChange={(value) => setFormData((prev) => ({ ...prev, isNew: value === "true" }))}
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
        {colorDropzones.map(({ getRootProps, getInputProps, color }) => {
          return (
            <div key={color} className="space-y-2">
              <h4 className="font-semibold">{color}</h4>
              <div className="flex flex-wrap gap-2">
                {formData.images
                  .find((img) => img.color === color)
                  ?.image.map((img, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={urlFor(img).url() || "/placeholder.svg"}
                        alt={`${color} product image ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover h-[100px] w-[100px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(color, index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                {newImages[color]?.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`New ${color} product image ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover h-[100px] w-[100px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(color, index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag &apos;n&apos; drop some files here, or click to select files for {color}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? "Updating Product..." : "Update Product"}
      </Button>
    </form>
  )
}

