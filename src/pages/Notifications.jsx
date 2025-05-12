import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, or, getDocs} from "@firebase/firestore";
import OrderSearch from "../components/OrderSearch.jsx";
import OrderTabs from "../components/OrderTabs.jsx";
import Button from "../components/button.jsx";
import OrderNotification from "../components/OrderNotification.jsx";

function Notifications() {
  const [orders, setOrders] = useState([]);
  // use states for search function
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // define as global variables
  const db = getFirestore();
  const ordersRef = collection(db, "orders");

  // function that fetches orders from Firestore
  const getOrderData = async () => {
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

  // function that handles search when term is passed from search bar
  const handleSearch = async (term) => {
    let searchValue = term || searchTerm;

    // update isSearching state to true
    setIsSearching(true);
    console.log(`Search initialized for '${searchValue}'`);

    // convert search term to title case for case insensitive search
    function toTitleCase(string) {
      // take the searchValue, split it into an array by spaces
      let convertedSearchValue = string.split(' ');

      // take the first character of each element using map convert it to uppercase then add the rest as lowercase
      convertedSearchValue = convertedSearchValue.map(element => element.charAt(0).toUpperCase() + element.slice(1).toLowerCase());
      console.log(convertedSearchValue);

      // then join it back 
      convertedSearchValue = convertedSearchValue.join(' ');

      return convertedSearchValue;
    }

    let titleCaseSearchValue = toTitleCase(searchValue);
    console.log(titleCaseSearchValue);


    // set up OR query with where conditions 
    let q = query(ordersRef, 
        or(where('orderNumber', '==', searchValue),
            where('customerName', '==', searchValue),
            where('customerName', '==', titleCaseSearchValue)
          )
    )
    console.log(`Checking for matches for '${searchValue}'`);

    // fetch the snapshot of the orders matching the case
    const querySnapshot = await getDocs(q);
    const resultsList = querySnapshot.docs.map((doc) => ({id:doc.id, ...doc.data(), }));

    // sort the results list descending for customer searches
    resultsList.sort((a, b) => b.orderNumber - a.orderNumber);
    console.log("Matches found:", resultsList);

    // update the search results state with the matching orders
    setSearchResults(resultsList);
  };

  // function that handles clearing the search by reseting the states
  const clearSearch = () => {
    console.log(`Search for '${searchTerm}' clearing.`);

    // closes the conditional render of the search
    setIsSearching(false);

    // clears the stored matched orders
    setSearchResults([]);
    
    // clears the search term
    setSearchTerm('');
  };

  return (
    <div className="bg-eggshell rounded-lg p-4 flex flex-col w-full min-h-svh gap-8">
      {/* title and search */}
      <div className="flex flex-row">
        <div className="flex justify-between w-full">
          <h1 className="text-4xl text-terra-cotta">Order Notifications</h1>
          <OrderSearch
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>
      </div>

      {/* conditional render of search results */}
      {isSearching && (
        <div className="border-2 border-p-button3 w-full h-[30%]">
          {/* section with header and clear button */}
          <div className="flex flex-row justify-between">
            <h3 className="text-xl text-left mr-4 text-p-button3">Search results for: <span className="italic font-light">'{searchTerm}'</span></h3>
            {/* button section */}
            <div>
              <Button 
                text="Clear Search"
                className="text-xs hover:font-medium py-0.5"
                onClick={() => clearSearch()}
              />
            </div>
          </div>

          {/* section with the search results as tiles */}
          <div className="border-2 border-p-button">
            {searchResults.map(result =>(
              <OrderNotification
                key={result.id}
                id={result.id}
                orderStatus={result.orderStatus}
                orderTime={result.orderTime}
                customerName={result.customerName}
                orderName={result.orderName}
                orderQuantity={result.orderQuantity}
                orderPrice={result.orderPrice}
                deliveryTime={result.deliveryTime}
                orderNumber={result.orderNumber}
                refreshOrders={getOrderData}
                isSearching={isSearching}
                handleSearch={handleSearch}
              />
            ))}
          </div>
        </div>
      )}

      {/* tabs and notificatons */}
      <div className="w-full flex-grow">
        <OrderTabs 
          orders={orders} 
          refreshOrders={getOrderData}
          isSearching={isSearching}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
}

export default Notifications;