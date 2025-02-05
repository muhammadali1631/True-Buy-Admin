import DashboardStats from "@/components/DashboardStats";
import Orders from "@/components/Orders";
import Products from "@/components/Products";
import React from "react";

function Home() {

  
  return (
    <div>
      <DashboardStats/>
      <Orders/>
      <Products/>
    </div>
  );
}

export default Home;
