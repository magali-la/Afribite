import React, {useState} from 'react';
import Button from "./button";

const OrderPopup = ({customerName, orderName, orderNumber, orderQuantity, orderPrice, popupOpen, toggleOrderPopup, orderStatus, updateOrderStatus, deliveryTime }) => {
    
    return (
        popupOpen && (
        <div className="flex flex-col justify-center items-center w-[85%] sm:w-[80%] md:w-[300px] lg:max-w-[350px] xl:w-[400px] 2xl:w-[500px] bg-notif border-2 border-terra-cotta text-n-n1 gap-y-5 py-[21px] px-[23px] rounded-lg leading-5">
            {/* div that holds the popup text and button */}
            <div className="flex w-full text-n-n1">
                {orderStatus === "new" && (
                    // section with order details
                    <div className='font-normal w-full text-center md:text-left'>
                        <h2 className='text-xl font-semibold text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='text-sm sm:text-base md:text-sm font-medium mt-2 text-n-n1'>New Order #{orderNumber} from {customerName}!</p>
                        <p className="text-sm sm:text-lg md:text-base font-medium mt-4 text-n-n1">Order Summary:</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Dish:</span> {orderName}</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Quantity:</span> {orderQuantity}x</p>
                        <p className='text-sm sm:text-lg md:text-base font-semibold text-n-n1'><span className='font-medium text-n-n2'>Total:</span> £{orderPrice}</p><br/>
                        <p className='text-sm sm:text-base md:text-sm italic text-n-n2'>Please Start Preparing the Order.</p><br/>
                        <p className='text-sm sm:text-base md:text-sm font-medium text-n-n2'>Update Order Status once it's Ready for Pickup.</p>
                    
                        {/* section with button */}
                        <div className='mt-4 flex justify-center'>
                            <Button 
                                text="Ready for Pickup"
                                className="bg-accent text-notif rounded-lg font-medium"
                                onClick={() => updateOrderStatus("ongoing")}
                            />
                        </div>
                    </div>
                )}
                

                {orderStatus === "ongoing" && (
                    <div>
                        <h2 className='text-xl font-normal text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='font-medium mt-2 text-n-n1'>Order #{orderNumber} is being delivered to {customerName}.</p>
                        <p className="font-medium mt-4 text-n-n2">Order Summary:</p>
                        <p className='text-n-n2'>Dish: {orderName}</p>
                        <p className='text-n-n2'>Quantity: {orderQuantity}x</p>
                        <p className='text-n-n2'>Total: £{orderPrice}</p><br/>
                        <p className='text-n-n2'>Take the next step to complete the order.</p>
                        <div className='mt-4 flex justify-center'>
                            <Button
                            text="Complete Delivery"
                            className="bg-accent text-notif text-lg p-4 rounded-lg font-medium"
                            onClick={() => updateOrderStatus("delivered")}
                            />   
                        </div>
                        
                    </div>             
                )}
                {orderStatus === "delivered" && (
                    <div>
                        <h2 className='text-xl font-normal text-p-button'>Order Details: #{orderNumber}</h2>
                        <p className='font-medium mt-2 text-n-n1'>Order #{orderNumber} was delivered to {customerName}, and your service was outstanding!</p>
                        <p className="font-medium mt-4 text-n-n2">Order Summary:</p>
                        <p className='text-n-n2'>Dish: {orderName}</p>
                        <p className='text-n-n2'>Quantity: {orderQuantity}x</p>
                        <p className='text-n-n2'>Total: £{orderPrice}</p>
                        <p className='text-n-n2'>Delivery Time: {deliveryTime}</p><br/>
                        <p className='text-n-n2'>Thank you for your commitment to great service!</p>
                        <div className='mt-4 flex justify-center'>
                            <Button
                            text="View Order History"
                            className="bg-accent text-notif text-lg p-4 rounded-lg font-medium"
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