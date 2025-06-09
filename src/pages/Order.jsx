import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import "../App.css";

export const Order = ({ cartItems, setCartItems, onCheckout }) => {
    const [searchParams] = useSearchParams();
    const [dishes, setDishes] = useState([]);
    const [partner, setPartner] = useState(null);
    const [dishCategory, setDishCategory] = useState(cartItems[0]?.category ?? '');

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const res = await api.get(`/foods?partner_id=${searchParams.get('partner_id')}`);
                setDishes(res.data);
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

    const updateCart = (dish, quantity) => {
        if (quantity <= 0) {
            // Удаляем из корзины
            setCartItems(prev => prev.filter(item => item._id !== dish._id));
        } else {
            setCartItems(prev => {
                const exists = prev.find(item => item._id === dish._id);
                if (exists) {
                    // Обновляем количество
                    return prev.map(item =>
                        item._id === dish._id ? { ...item, quantity } : item
                    );
                } else {
                    // Добавляем новое блюдо (обязательно делаем копию объекта!)
                    return [...prev, { ...dish, quantity }];
                }
            });
        }
    };

    const getQuantity = (id) => {
        return cartItems.find(item => item._id === id)?.quantity || 0;
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const grouped = dishes.reduce((acc, dish, index) => {
        const cat = dish.category || "Без категории";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({ ...dish, index });
        return acc;
    }, {});

    return (
        <div className="order-page">
            {partner && (
                <div className="partner-details">
                    <h2>{partner.name}</h2>
                    <p>{partner.address}</p>
                </div>
            )}

            <div className="field-wrapper">
                <span className="field-label">Выберите категорию:</span>

                <div className="dish-categories-container">
                    {Object.keys(grouped).map((category) => (
                        <label className="radio-input-label" key={category}>
                            <input type="radio" name="houseType" value={category} className="radio-input" checked={dishCategory === category} onChange={(e) => setDishCategory(e.target.value)} />

                            <span className="radio-input-text">
                                {category}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="dish-list">
                {dishes.map(dish => {
                    const qty = getQuantity(dish._id);
                    return (
                        <div className="dish-card" key={dish._id}>
                            <img src={`https://booklink.pro/cf/photo?id=${dish.photo}`} alt="" />
                            <h4>{dish.name}</h4>
                            <p>{dish.price} сом</p>
                            {qty === 0 ? (
                                <button onClick={() => updateCart(dish, 1)}>Добавить</button>
                            ) : (
                                <div className="counter">
                                    <button onClick={() => updateCart(dish, qty - 1)}>-</button>
                                    <span>{qty}</span>
                                    <button onClick={() => updateCart(dish, qty + 1)}>+</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {cartItems.length > 0 && (
                <div className="order-footer">
                    <button onClick={onCheckout}>
                        Оформить заказ – {total} сом
                    </button>
                </div>
            )}
        </div>
    );
};
