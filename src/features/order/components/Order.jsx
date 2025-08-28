import { useEffect, useState } from "react";
import AnimatedBottomButton from "./AnimatedBottomButton";
import { DishDescriptionDrawer } from "./DishDescriptionDrawer";
// import { Footer } from "../../../shared/ui/Footer";

import "../../../app/App.css";

const formatTime = (isoTime) => {
    if (!isoTime) return '';

    // Create date object from ISO string - it will automatically convert to local timezone
    const date = new Date(isoTime);

    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const Order = ({ cartItems, setCartItems, dishes, partner, onCheckout }) => {
    const [dishCategory, setDishCategory] = useState('');
    const [selectedDish, setSelectedDish] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

    const handleDishClick = (dish) => {
        // Only open drawer if dish has description
        if (dish.description) {
            setSelectedDish(dish);
            setIsDrawerOpen(true);
        }
    };

    const handleDrawerQuantityChange = (dish, quantity) => {
        updateCart(dish, quantity);
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
                    <div className="partner-info">
                        <h2>{partner.name}</h2>
                        {partner?.address?.address_name && (<p className="partner-address">{partner.address.address_name}</p>)}
                        {partner?.work_time?.from && partner?.work_time?.to && (
                            <p className="partner-work-time">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
                                </svg>
                                {formatTime(partner.work_time.from)} - {formatTime(partner.work_time.to)}
                            </p>
                        )}
                    </div>
                    {partner?.photo && (
                        <div className="partner-photo">
                            <img src={`https://booklink.pro/cf/photo?id=${partner.photo}`} alt={partner.name} />
                        </div>
                    )}
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
                        <div className="dish-card" key={dish._id} onClick={() => handleDishClick(dish)}>
                            <div className="dish-card-image">
                                <img src={`https://booklink.pro/cf/photo?id=${dish.photo}`} alt="" />
                            </div>
                            <div className="dish-details">
                                <span className="dish-price">{dish.price} сом</span>
                                <span className="dish-weight">{dish.weight} г / мл</span>
                            </div>

                            <p className="dish-title">{dish.name}</p>

                            {qty === 0 ? (
                                <button
                                    className="primary-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateCart(dish, 1);
                                    }}
                                >
                                    Добавить
                                </button>
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

            {/* Dish Description Drawer */}
            <DishDescriptionDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                dish={selectedDish}
                quantity={selectedDish ? getQuantity(selectedDish._id) : 0}
                onQuantityChange={handleDrawerQuantityChange}
            />
        </div>
    );
};
