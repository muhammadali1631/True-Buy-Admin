// import UpdateProduct from "@/components/EditProduct";
import ProductEditForm from "@/components/ProductEditForm";
import { client } from "@/sanity/lib/client";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product = await client.fetch(
    `*[_type == 'products' && slug == $slug][0]`,
    { slug }, { cache: "no-store" })

  return (
    <div>
        <ProductEditForm product={product}/>
        {/* <UpdateProduct product={product}/> */}
    </div>
  )
}
