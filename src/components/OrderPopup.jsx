import React, {useState} from 'react';
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; 
import Button from "./button";

const OrderPopup = ({id, customerName, orderName, orderNumber, orderQuantity, orderPrice, popupOpen, toggleOrderPopup, orderStatus, deliveryTime, isSearching, handleSearch}) => {

    // this handles the order status change through firestore
    const advanceOrderStatus = async (newStatus) => {
        console.log(`Updating order status to: ${newStatus}`);

        const currentOrder = doc(db, 'orders', id);

        // conditions to determine how the order will be updated based on orderStatus
        if (orderStatus == "new"){
            // update the status to kitchen
            await updateDoc(currentOrder, {orderStatus: "kitchen"});
            console.log(`Order ${id} successfully updated to ${newStatus}`);

        } else if (orderStatus == "kitchen"){ 
            // update the status to ongoing
            await updateDoc(currentOrder, {orderStatus: "pickup"});
            console.log(`Order ${id} successfully updated to ${newStatus}`);

        } else if (orderStatus == "pickup"){ 
            // update the status to ongoing
            await updateDoc(currentOrder, {orderStatus: "ongoing"});
            console.log(`Order ${id} successfully updated to ${newStatus}`);

        } else if (orderStatus == "ongoing"){
            // update the status to delivered and update the timestamp
            await updateDoc(currentOrder, {orderStatus: "delivered", deliveryTime: serverTimestamp()});
            console.log(`Order ${id} successfully updated to ${newStatus}`);
        }

        // close the popup
        toggleOrderPopup();

        // set condition to refresh search results if an open result's status changes
        if (isSearching == true){
            handleSearch();
        }
    };

    // this handles reversing the order status change through firestore
    const revertOrderStatus = async (newStatus) => {
        console.log(`Reversing order status to: ${newStatus}`);

        const currentOrder = doc(db, 'orders', id);

        // conditions to determine how the order will be updated based on orderStatus
        if (orderStatus == "kitchen"){
            // revert the status back to new
            await updateDoc(currentOrder, {orderStatus: "new"});
            console.log(`Order ${id} successfully reverted to ${newStatus}`);

        } else if (orderStatus == "pickup"){
            // revert the status back to kitchen
            await updateDoc(currentOrder, {orderStatus: "kitchen"});
            console.log(`Order ${id} successfully reverted to ${newStatus}`);

        } else if (orderStatus == "ongoing"){
            // revert the status back to kitchen
            await updateDoc(currentOrder, {orderStatus: "pickup"});
            console.log(`Order ${id} successfully reverted to ${newStatus}`);

        } else if (orderStatus == "delivered"){
            // revert the status back to ongoing and remove the timestamp
            await updateDoc(currentOrder, {orderStatus: "ongoing", deliveryTime: null});
            console.log(`Order ${id} successfully reverted to ${newStatus}`);
        }

        // close the popup
        toggleOrderPopup();

        // set condition to refresh search results if an open result's status changes
        if (isSearching == true){
            handleSearch();
        }
    };

    // function to format the server timestamp in firestore for UI in popup
    const formatPopupDeliveryTime = (timestamp) => {
        // define a variable for the date delivered
        let date = timestamp.toDate();

        // customize UK date and time format options
        let popupDateOptions = {day: 'numeric', month: 'short', year: 'numeric'};
        let popupTimeOptions = {hour: 'numeric', minute: '2-digit'};

        // return a string format with the full date and time to place in the UI
        return `${date.toLocaleDateString('en-GB', popupDateOptions)} at ${date.toLocaleTimeString('en-GB', popupTimeOptions)}`

    };
    
    return (
        popupOpen && (
        <div className="flex flex-col justify-center items-center w-[85%] sm:w-[80%] md:w-[300px] lg:max-w-[350px] xl:w-[400px] 2xl:w-[500px] bg-notif border-2 border-terra-cotta text-n-n1 gap-y-5 py-[21px] px-[23px] rounded-lg leading-5">
            {/* div that holds the popup text and button */}
            <div className="flex w-full text-n-n1">
                {/* popup for new orders */}
                {orderStatus === "new" && (
                    // section with order details
                    <div className='font-normal w-full text-center md:text-left'>
                        <h2 className='text-xl font-semibold text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='text-sm sm:text-base md:text-sm font-medium mt-2 text-n-n1'>New Order #{orderNumber} from {customerName}!</p>
                        <p className="text-sm sm:text-lg md:text-base font-medium mt-4 text-n-n1">Order Summary:</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Dish:</span> {orderName}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Quantity:</span> {orderQuantity}x</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Total:</span> £{orderPrice}</p><br/>
                        <p className='text-sm sm:text-base md:text-sm font-medium text-n-n2'>Accept this order to begin preparing.</p>
                    
                        {/* section with button */}
                        <div className='mt-4 text-center'>
                            <Button 
                                text="Accept Order"
                                className="w-4/5 p-4 bg-accent text-notif rounded-lg font-medium"
                                onClick={() => advanceOrderStatus("kitchen")}
                            />
                        </div>
                    </div>
                )}

                {/* popup for cooking orders */}
                {orderStatus === "kitchen" && (
                    // section with order details
                    <div className='font-normal w-full text-center md:text-left'>
                        <h2 className='text-xl font-semibold text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='text-sm sm:text-base md:text-sm font-medium mt-2 text-n-n1'>Order #{orderNumber} is being prepared for {customerName}.</p>
                        <p className="text-sm sm:text-lg md:text-base font-medium mt-4 text-n-n1">Order Summary:</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Dish:</span> {orderName}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Quantity:</span> {orderQuantity}x</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Total:</span> £{orderPrice}</p><br/>
                        <p className='text-sm sm:text-base md:text-sm font-medium text-n-n2'>Take the next step to start delivery.</p>

                        {/* section with buttons */}
                        <div className='mt-4 grid grid-rows-2 text-center items-center gap-0.5'>
                            {/* button to update status */}
                            <Button
                            text="Ready for Pickup"
                            className="w-4/5 bg-accent text-notif text-lg p-4 rounded-lg font-medium"
                            onClick={() => advanceOrderStatus("pickup")}
                            />

                            {/* button to reverse status */}
                            <Button
                            text="Reverse Status"
                            className="w-4/5 bg-p-button5 text-p-button3 hover:text-p-button3 hover:border-p-button3 hover:font-medium text-lg p-2 rounded-lg font-normal"
                            onClick={() => revertOrderStatus("new")}
                            />
                        </div>
                        
                    </div>             
                )}

                {/* popup for orders ready for pickup */}
                {orderStatus === "pickup" && (
                    // section with order details
                    <div className='font-normal w-full text-center md:text-left'>
                        <h2 className='text-xl font-semibold text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='text-sm sm:text-base md:text-sm font-medium mt-2 text-n-n1'>Order #{orderNumber} for {customerName} is ready for pickup.</p>
                        <p className="text-sm sm:text-lg md:text-base font-medium mt-4 text-n-n1">Order Summary:</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Dish:</span> {orderName}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Quantity:</span> {orderQuantity}x</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Total:</span> £{orderPrice}</p><br/>
                        <p className='text-sm sm:text-base md:text-sm font-medium text-n-n2'>Take the next step once the order has been picked up.</p>

                        {/* section with buttons */}
                        <div className='mt-4 grid grid-rows-2 text-center items-center gap-0.5'>
                            {/* button to update status */}
                            <Button
                            text="Start Delivery"
                            className="w-4/5 bg-accent text-notif text-lg p-4 rounded-lg font-medium"
                            onClick={() => advanceOrderStatus("ongoing")}
                            />

                            {/* button to reverse status */}
                            <Button
                            text="Reverse Status"
                            className="w-4/5 bg-p-button5 text-p-button3 hover:text-p-button3 hover:border-p-button3 hover:font-medium text-lg p-2 rounded-lg font-normal"
                            onClick={() => revertOrderStatus("kitchen")}
                            />
                        </div>
                        
                    </div>             
                )}
                
                {/* popup for orders out for delivery */}
                {orderStatus === "ongoing" && (
                    // section with order details
                    <div className='font-normal w-full text-center md:text-left'>
                        <h2 className='text-xl font-semibold text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='text-sm sm:text-base md:text-sm font-medium mt-2 text-n-n1'>Order #{orderNumber} is being delivered to {customerName}.</p>
                        <p className="text-sm sm:text-lg md:text-base font-medium mt-4 text-n-n1">Order Summary:</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Dish:</span> {orderName}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Quantity:</span> {orderQuantity}x</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Total:</span> £{orderPrice}</p><br/>
                        <p className='text-sm sm:text-base md:text-sm font-medium text-n-n2'>Take the next step to complete the order.</p>

                        {/* section with buttons */}
                        <div className='mt-4 grid grid-rows-2 text-center items-center gap-0.5'>
                            {/* button to update status */}
                            <Button
                            text="Complete Delivery"
                            className="w-4/5 bg-accent text-notif text-lg p-4 rounded-lg font-medium"
                            onClick={() => advanceOrderStatus("delivered")}
                            />

                            {/* button to reverse status */}
                            <Button
                            text="Reverse Status"
                            className="w-4/5 bg-p-button5 text-p-button3 hover:text-p-button3 hover:border-p-button3 hover:font-medium text-lg p-2 rounded-lg font-normal"
                            onClick={() => revertOrderStatus("pickup")}
                            />
                        </div>
                        
                    </div>             
                )}

                {/* popup for delivered orders */}
                {orderStatus === "delivered" && (
                    // section with order details
                    <div className='font-normal w-full text-center md:text-left'>
                        <h2 className='text-xl font-semibold text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='text-sm sm:text-base md:text-sm font-medium mt-2 text-n-n1'>Order #{orderNumber} was delivered to {customerName}, and your service was outstanding!</p>
                        <p className="text-sm sm:text-lg md:text-base font-medium mt-4 text-n-n2">Order Summary:</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Dish:</span> {orderName}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Quantity:</span> {orderQuantity}x</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Total:</span> £{orderPrice}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Delivery Time:</span> {formatPopupDeliveryTime(deliveryTime)}</p><br/>
                        <p className='text-sm sm:text-base md:text-sm font-medium text-n-n2'>Thank you for your commitment to great service!</p>

                        {/* section with button */}
                        <div className='mt-4 grid text-center'>
                            <Button
                            text="Reverse Status"
                            className="w-4/5 bg-p-button5 text-p-button3 hover:text-p-button3 hover:border-p-button3 hover:font-medium text-lg p-2 rounded-lg font-normal"

                            // option to revert order status
                            onClick={() => revertOrderStatus("ongoing")}
                            />
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
        )
    ); 
};

export default OrderPopup;