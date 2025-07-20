import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Order } from "./Order";
import { Checkout } from "./Checkout";
import { api } from "../api";

export const OrderPage = () => {
    const [searchParams] = useSearchParams();

    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState("order");

    const [dishes, setDishes] = useState([]);
    const [partner, setPartner] = useState(null);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await api.get(`/foods?partner_id=${searchParams.get('partner_id')}`);
                setDishes(res.data);
                // setDishCategory(res.data?.[0]?.category ?? '');
            } catch (err) {
                console.error(err);
            }
        };
        fetchDishes();
    }, []);

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const res = await api.get(`/partner?chat_id=${searchParams.get('partner_id')}`);
                setPartner(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPartner();
    }, []);

    return (
        <div className="order-page-container">
            {currentPage === "order" && (
                <Order
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    dishes={dishes}
                    partner={partner}
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