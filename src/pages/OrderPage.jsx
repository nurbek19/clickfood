import { useState } from "react";
import { Order } from "./Order";
import { Checkout } from "./Checkout";

export const OrderPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState("order");

    return (
        <div className="order-page-container">
            {currentPage === "order" && (
                <Order
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    onCheckout={() => setCurrentPage("checkout")}
                />
            )}

            {currentPage === "checkout" && (
                <Checkout
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    onBack={() => setCurrentPage("order")}
                />
            )}
        </div>
    );
};