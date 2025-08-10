import { useEffect, useState } from "react";
import AnimatedBottomButton from "../components/AnimatedBottomButton";
// import { Footer } from "../components/Footer";

import "../App.css";

export const Order = ({ cartItems, setCartItems, dishes, partner, onCheckout }) => {
    const [dishCategory, setDishCategory] = useState('');

    useEffect(() => {
        setDishCategory(dishes?.[0]?.category ?? '');
    }, [dishes]);

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
                    {partner?.address?.address_name && (<p>{partner.address.address_name}</p>)}
                </div>
            )}

            <div className="field-wrapper categories-container">
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
                {grouped[dishCategory] && grouped[dishCategory].filter((d) => !d.active).map(dish => {
                    const qty = getQuantity(dish._id);
                    return (
                        <div className="dish-card" key={dish._id} onClick={() => {
                            if (qty === 0) {
                                updateCart(dish, 1)
                            }
                        }}>
                            <div className="dish-card-image">
                                <img src={`https://booklink.pro/cf/photo?id=${dish.photo}`} alt="" />
                            </div>
                            <div className="dish-details">
                                <span className="dish-price">{dish.price} сом</span>
                                <span className="dish-weight">{dish.weight} г / мл</span>
                            </div>

                            <p className="dish-title">{dish.name}</p>

                            {qty === 0 ? (
                                <button className="primary-button">Добавить</button>
                            ) : (
                                <div className="dish-counters">
                                    <button className="primary-button" onClick={(e) => {
                                        e.stopPropagation();
                                        updateCart(dish, qty - 1)
                                    }}>-</button>
                                    <span>{qty}</span>
                                    <button className="primary-button" onClick={(e) => {
                                        e.stopPropagation();
                                        updateCart(dish, qty + 1)
                                    }}>+</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* <Footer /> */}

            <AnimatedBottomButton
                visible={cartItems.length > 0}
                text={`Оформить заказ – ${total} сом`}
                onClick={onCheckout}
            />
        </div>
    );
};
