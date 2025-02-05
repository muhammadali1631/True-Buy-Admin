import { client } from "@/sanity/lib/client";
import { FaChartBar, FaGift, FaShoppingCart, FaWallet, FaTasks, FaHome } from "react-icons/fa";
import { BadgeDollarSign, ArrowRightLeft, Users, ShoppingBasket } from 'lucide-react';
import Widget from "./Widget";
import { OrderType } from "@/types/order";

const stats = [
  { title: "Earnings", value: "$340.5", icon: <FaChartBar />, bgColor: "bg-purple-500" },
  { title: "Spend this month", value: "$642.39", icon: <FaGift />, bgColor: "bg-purple-500" },
  { title: "Sales", value: "$574.34", icon: <FaShoppingCart />, bgColor: "bg-purple-500" },
  { title: "Your Balance", value: "$1,000", icon: <FaWallet />, bgColor: "bg-purple-500" },
  { title: "New Tasks", value: "145", icon: <FaTasks />, bgColor: "bg-purple-500" },
  { title: "Total Projects", value: "$2433", icon: <FaHome />, bgColor: "bg-purple-500" },
];

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
      <Widget title='Total Sales' icon={<BadgeDollarSign size={60}/>} value={`$ ${totalCost.toFixed(2).toString()}`}/>
      <Widget title='Orders' icon={<ArrowRightLeft />} value={orders.length}/>
      <Widget title='Users' icon={<Users />} value={users.length}/>
      <Widget title='Products' icon={<ShoppingBasket />} value={products.length}/>
    </div>
  );
};

export default DashboardStats;
