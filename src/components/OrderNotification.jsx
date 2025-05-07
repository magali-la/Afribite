import React from 'react';
import { useState } from 'react';
import ActiveIcon from '../assets/active.svg';
import Button from './button.jsx';
import OrderPopup from './OrderPopup.jsx';


const OrderNotification = ({id, orderStatus, orderTime, customerName, orderName, orderQuantity, orderPrice, deliveryTime, orderNumber, refreshOrders}) => {
    const [popupOpen, setPopupOpen] = useState(false)

    const toggleOrderPopup = () => {
        setPopupOpen(!popupOpen);
      };

    const displayOrderInfo = () => {
        switch(orderStatus.toLowerCase()) {
            case 'new':
                return (
                    <div className='w-full grid grid-cols-5 items-center'>
                        <p className='w-full col-span-4 pr-2 sm:break-normal text-n-n1 font-semibold'>{orderName} ({orderQuantity}x) order for {customerName} </p>
                        <p className='w-full text-right font-medium text-n-n2'>Total: £{orderPrice}</p>
                    </div>
                )
            case 'kitchen':
                return (
                    <div className='w-full grid grid-cols-5 items-center'>
                        <p className='w-full col-span-4 pr-2 sm:break-normal text-n-n1 font-semibold'>{orderName} ({orderQuantity}x) being prepared for {customerName} </p>
                        <p className='w-full text-right font-medium text-n-n2'>Total: £{orderPrice}</p>
                    </div>
                )
            case 'ongoing':
                return (
                    <div className='w-full grid grid-cols-5 items-center'>
                        <p className='w-full col-span-4 ml-2 pr-2 sm:break-normal text-n-n1 font-semibold'>{orderName} ({orderQuantity}x) being delivered to {customerName}</p>
                        <p className='w-full text-right font-medium text-n-n2'>Total: £{orderPrice}</p>
                    </div>
                )
            case 'delivered':
                return (
                    <div className='w-full grid grid-cols-5 items-center'>
                        <p className='w-full col-span-4 ml-2 pr-2 sm:break-normal text-n-n1 font-semibold'>{customerName}'s order was delivered at: {formatTileDeliveryTime(deliveryTime)}</p>
                        <p className='w-full text-right font-medium text-n-n2'>Total: £{orderPrice}</p>
                    </div>
                );
                default:
                    return null;
        }

    };

    // dynamic button text variable depending on whether the popup is open or not
    let buttonText;
    if (popupOpen == true){
        buttonText = "Hide Order";
    } else {
        buttonText = "View Order";
    }

    // function to format the server timestamp in firestore for UI in tile
    const formatTileDeliveryTime = (timestamp) => {
        // define a variable for the date delivered
        let date = timestamp.toDate();

        // customize UK time format options
        let tileTimeOptions = {hour: 'numeric', minute: '2-digit'};

        // return a string format with the full date and time to place in the UI
        return date.toLocaleTimeString('en-GB', tileTimeOptions)

    };
    
    return(
        // div controls both notification tile and popup behavior
        <div className='w-full flex flex-col md:flex-row gap-4'>
            {/* parent div of the tile itself */}
            <div className="w-full grid grid-cols-4 items-center px-4 py-3 min-h-16 max-h-[160px] rounded-md border border-n-n3 bg-notif hover:border-p-button">
                {/* left section - icon, order status, time, and number */}
                <div className='flex items-center py-3 px-2 sm:border-r-2 sm:border-r-p-button'>
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
                <div className='col-span-2 px-4'>
                    {displayOrderInfo()}                    
                </div>
                {/* view order button section */}
                <div className='flex w-full items-center justify-center'>
                    <div className='w-full'>
                        <Button
                            text={buttonText}
                            className="min-w-full bg-p-button3 hover:border-p-button3 hover:text-p-button3 hover:bg-n-n7"
                            onClick={toggleOrderPopup}
                        />  
                    </div> 
                </div>
            </div>
            {/* parent div of the popup */}
            <div className='flex justify-center'>
                {popupOpen && (
                        <OrderPopup
                            id={id}
                            customerName={customerName}
                            orderName={orderName}
                            orderNumber={orderNumber}
                            orderQuantity={orderQuantity}
                            orderPrice={orderPrice}
                            popupOpen={popupOpen}
                            toggleOrderPopup={toggleOrderPopup}
                            orderStatus={orderStatus}
                            deliveryTime={deliveryTime}
                            refreshOrders={refreshOrders}
                        />
                )}
            </div>
        </div>    
    );
};

export default OrderNotification;