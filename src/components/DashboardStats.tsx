import { client } from "@/sanity/lib/client";
import { BadgeDollarSign, ArrowRightLeft, Users, ShoppingBasket } from 'lucide-react';
import Widget from "./Widget";
import { OrderType } from "@/types/order";


const DashboardStats = async() => {
  const orders:OrderType[] = await client.fetch(`*[_type == 'order']`, {}, {cache: 'no-store'})
  const response = await fetch(`https://api.clerk.com/v1/users`, {
    headers: {
      "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY_SECOND}`,
    },
  })
  const users = await response.json()
  const products = await client.fetch(`*[_type == 'products']`, {}, {cache: 'no-store'})

  let totalCost = 0;
  orders.forEach(order => {
    order.products.forEach(product => {
      totalCost += product.quantity * product.price;
    });
  });
  return (
    <div className="w-full flex flex-wrap gap-4 justify-around my-10">
      <Widget title='Total Sales' Icon={BadgeDollarSign } value={`$ ${totalCost.toFixed(2).toString()}`}/>
      <Widget title='Orders' Icon={ArrowRightLeft} value={orders.length}/>
      <Widget title='Users' Icon={Users} value={users.length}/>
      <Widget title='Products' Icon={ShoppingBasket} value={products.length}/>
    </div>
  );
};

export default DashboardStats;
