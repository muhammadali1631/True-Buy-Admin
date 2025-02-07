'use client'
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { ProductType } from "@/types/Products";
import { Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const Page = () => {
  const [products, setProducts] = useState<ProductType[]>()
  const getProducts = async() =>{

    const products: ProductType[] = await client.fetch(
      `*[_type == 'products'] | order(_createdAt desc)`,
      {},
      { next: { revalidate: 0 }}
    );
    setProducts(products)
  }
  getProducts()
  

  async function deleteProduct(productId: string) {
      if(confirm("Are you sure you want to delete this product?")){
        try {
          await client.delete(productId);
          toast.success("Product has been delete", {
            position: "top-right",
            autoClose: 2000,
          });
          const Products = products?.filter((item) => item._id !== productId);
          setProducts(Products)
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    }
  return (
    <div className="container mx-auto py-10 px-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href={"/products/addproduct"}>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {products?.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className=" h-60 flex justify-center">
              <Image
                src={urlFor(product.images[0].image[0]).url()}
                alt={product.name}
                className=" object-cover h-60 "
                height={240}
                width={240}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-2">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                In Stock: {product.stock}
              </p>
              <div className="flex justify-between">
                <Link href={`/products/edit/${product.slug}`}>
                  <button className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                </Link>
                <button
                  className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => deleteProduct(product._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
