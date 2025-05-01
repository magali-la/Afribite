import React from 'react';
import { useState } from 'react';
import ActiveIcon from '../assets/active.svg';
import Button from './button.jsx';
import OrderPopup from './OrderPopup.jsx';


const OrderNotification = ({orderStatus, orderTime, customerName, orderName, orderQuantity, orderPrice, deliveryTime, orderNumber}) => {
    const [popupOpen, setPopupOpen] = useState(false)

    const toggleOrderPopup = () => {
        setPopupOpen(!popupOpen);
      };

    const updateOrderStatus = (newStatus) => {
        console.log(`Updating order status to: ${newStatus}`);
    };

    const displayOrderInfo = () => {
        switch(orderStatus.toLowerCase()) {
            case 'new':
                return (
                    <div className='w-full grid grid-cols-2 justify-start ml-12 items-center'>
                        <p className='text-n-n1 font-semibold truncate'>{orderName} ({orderQuantity}x) order for {customerName} </p>
                        <p className='font-medium text-n-n2 ml-20'>Total: £{orderPrice}</p>
                    </div>
                )
            case 'ongoing':
                return (
                    <div className='w-full grid grid-cols-2 justify-start ml-12 items-center'>
                        <p className='text-n-n1 font-semibold truncate'>{orderName} ({orderQuantity}x) in progress for {customerName}</p>
                        <p className='font-medium text-n-n2 ml-20'>Total: £{orderPrice}</p>
                    </div>
                )
            case 'delivered':
                return (
                    <div className='w-full grid grid-cols-2 justify-start items-center ml-12'>
                        <p className='text-n-n1 font-semibold'>{customerName}'s order was delivered at: {deliveryTime}</p>
                        <p className='font-medium text-n-n2 ml-20'>Total: £{orderPrice}</p>
                    </div>
                );
                default:
                    return null;
        }

    };
    
    return(
        <div className='w-full flex gap-4'>
            {/* parent div of the tile itself */}
            <div className="w-full grid grid-cols-4 items-center px-4 py-3 min-h-16 max-h-auto rounded-md border border-n-n3 bg-notif hover:border-p-button">
                {/* left section - icon, order status, time, and number */}
                <div className='flex items-center py-3 border-r-2 border-r-p-button'>
                    {/* icon div */}
                    <div className='shrink-0 laptop:mr-6 tablet:mr-5 mr-4'>
                        <img src={ActiveIcon} className='size-2.5'/>
                    </div>
                    {/* order status, time, number */}
                    <div className='flex flex-wrap items-center mx-auto laptop:gap-5 tablet:gap-3 gap-2'>
                        <p className='capitalize text-n-n2'>{orderStatus}</p>
                        <p className='text-n-n2'>{orderTime}</p>
                        <p className='text-n-n2 font-medium'>Order #{orderNumber}</p>
                    </div>
                </div>
                {/* main order info content */}
                <div className='col-span-2'>
                    {displayOrderInfo()}                    
                </div>
                {/* view order button section */}
                <div>
                    <Button
                        text="View Order"
                        className="min-w-full bg-p-button3 hover:border-p-button3 hover:text-p-button3 hover:bg-n-n7"
                        onClick={toggleOrderPopup}
                    />   
                </div>
            </div>
            <div>
                {popupOpen && (
                        <OrderPopup
                            customerName={customerName}
                            orderName={orderName}
                            orderNumber={orderNumber}
                            orderQuantity={orderQuantity}
                            orderPrice={orderPrice}
                            popupOpen={popupOpen}
                            toggleOrderPopup={toggleOrderPopup}
                            orderStatus={orderStatus}
                            updateOrderStatus={updateOrderStatus}
                            deliveryTime={deliveryTime}
                        />
                )}
            </div>
        </div>    
    );
};

export default OrderNotification;