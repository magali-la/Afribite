import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs} from "@firebase/firestore";
import OrderSearch from "../components/OrderSearch.jsx";
import OrderTabs from "../components/OrderTabs.jsx";

function Notifications() {
  const [orders, setOrders] = useState([]);

  // function that fetches orders from Firestore
  const getOrderData = async () => {
    const db = getFirestore();
    const ordersRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersRef);

    // build an array with the orders data
    const ordersList = ordersSnapshot.docs.map((doc) => ({   id:doc.id,
      ...doc.data(),
    }));

    // sort the orders array descending by order number
    ordersList.sort((a, b) => b.orderNumber - a.orderNumber); 

    console.log("Fetched Orders:", ordersList);
    setOrders(ordersList);
  };

  useEffect(() => {
    getOrderData();
  }, []);

  console.log("orders before going to order tab:", orders);

  return (
    <div className="bg-eggshell rounded-lg p-4 flex flex-col w-full min-h-svh gap-8">
      {/* title and search */}
      <div className="flex flex-row">
        <div className="flex justify-between w-full">
          <h1 className="text-4xl text-terra-cotta">Order Notifications</h1>
          <OrderSearch/>
        </div>
      </div>
      {/* tabs and notificatons */}
      <div className="w-full flex-grow">
        <OrderTabs 
          orders={orders} 
          refreshOrders={getOrderData}/>
      </div>
    </div>
  );
}

export default Notifications;