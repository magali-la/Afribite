import React, {useState} from 'react';
import OrderNotification from './OrderNotification';

const OrderTabs = ({orders, refreshOrders}) => {
    console.log("Orders received in OrderTabs:", orders);

    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        {
            title: 'New',
            content: orders.filter(order => order && order.orderStatus && order.orderStatus.toLowerCase() === 'new').map(order => (
                <OrderNotification
                    key={order.id}
                    id={order.id}
                    orderStatus={order.orderStatus}
                    orderTime={order.orderTime}
                    customerName={order.customerName}
                    orderName={order.orderName}
                    orderQuantity={order.orderQuantity}
                    orderPrice={order.orderPrice}
                    deliveryTime={order.deliveryTime}
                    orderNumber={order.orderNumber}
                    refreshOrders={refreshOrders}
                />
            ) ),
            
        },
        {
            title: 'Ongoing',
            content: orders
                .filter(order => order && order.orderStatus && order.orderStatus.toLowerCase() === 'ongoing').map(order => (
                    <OrderNotification
                        key={order.id}
                        id={order.id}
                        orderStatus={order.orderStatus}
                        orderTime={order.orderTime}
                        customerName={order.customerName}
                        orderName={order.orderName}
                        orderQuantity={order.orderQuantity}
                        orderPrice={order.orderPrice}
                        deliveryTime={order.deliveryTime}
                        orderNumber={order.orderNumber}
                        refreshOrders={refreshOrders}
                    />
                )),
        },
        {
            title: 'Delivered',
            content: orders
                .filter(order => order && order.orderStatus && order.orderStatus.toLowerCase() === 'delivered').map(order => (
                    <OrderNotification
                        key={order.id}
                        id={order.id}
                        orderStatus={order.orderStatus}
                        orderTime={order.orderTime}
                        customerName={order.customerName}
                        orderName={order.orderName}
                        orderQuantity={order.orderQuantity}
                        orderPrice={order.orderPrice}
                        deliveryTime={order.deliveryTime}
                        orderNumber={order.orderNumber}
                        refreshOrders={refreshOrders}
                    />
                )),
        },
    ];

    console.log("Orders in Tabs:", orders);

    return (
        <div className='grid grid-cols-1 gap-8 h-full w-full rounded-lg'>
            {/* tabs */}
            <div className='flex flex-row gap-12'>
            {tabs.map((tab,index) => (
                <button
                    key={index}
                    className={`${activeTab === index 
                        ? 'border-b-2 font-semibold border-p-button text-p-button' : ''}`}
                    onClick={() => setActiveTab(index)}>
                        {tab.title}
                </button>
            ))}
            </div>
            {/* order notifications */}
            <div className='space-y-4'>
                {tabs[activeTab].content.map((item) => item)}
            </div>
        </div>
    );
};


export default OrderTabs;