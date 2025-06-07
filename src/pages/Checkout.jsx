import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import { api } from "../api";
import "../App.css";

export const Checkout = ({ cartItems, setCartItems, onBack }) => {
    const [searchParams] = useSearchParams();

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [deliveryType, setDeliveryType] = useState("delivery");

    const updateQuantity = (id, quantity) => {
        if (quantity === 0) {
            setCartItems(prev => prev.filter(item => item._id !== id));
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item._id === id ? { ...item, quantity } : item
                )
            );
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = () => {
        if (!address.trim() || !phone.trim()) {
            alert("Пожалуйста, заполните адрес и телефон.");
            return;
        }

        const orderData = {
            foods: cartItems,
            // total,
            address,
            phone,
            comment,
            delivery_option: deliveryType,
            user_id: searchParams.get('chat_id'),
            partner_id: searchParams.get('partner_id')
        };

        console.log("Заказ отправлен:", orderData);
        console.log("Заказ отправлен:", JSON.stringify(orderData));

        // TODO: Отправить на сервер здесь при необходимости

        WebApp.MainButton.showProgress();
        api.post('/order', orderData).then((res) => {
            if (res.data) {
                WebApp.MainButton.hide();
                // window.location.href = res.data.url;
                WebApp.openLink(res.data.url);
                WebApp.close();
            }
        }).catch((err) => {
            console.log(err);
            WebApp.MainButton.hideProgress();
            WebApp.MainButton.text = 'Произошло какая то ошибка';
        }) //переписать на try catch

        // Очистить корзину
        // setCartItems([]);

        // Можно также показать сообщение или перейти на другую страницу
        // alert("Заказ оформлен!");
    };

    useEffect(() => {
        WebApp.onEvent('mainButtonClicked', handleSubmit);

        return () => {
            WebApp.offEvent('mainButtonClicked', handleSubmit);
        };
    }, [cartItems, address, phone, comment, deliveryType]);

    const isValid = useMemo(() => {
        return cartItems.length && address && phone && deliveryType;
    }, [cartItems, address, phone, deliveryType]);

    useEffect(() => {
        WebApp.MainButton.text = 'Оплатить';

        if (isValid) {
            WebApp.MainButton.show();

        } else {
            WebApp.MainButton.hide();
        }

        // return () => {
        //     WebApp.MainButton.hide();
        // };
    }, [isValid]);

    return (
        <div className="checkout-page">
            <button className="back-button" onClick={onBack}>← Назад</button>
            <h2>Оформление заказа</h2>

            <div className="checkout-list">
                {cartItems.map(item => (
                    <div key={item._id} className="checkout-item">
                        <span>{item.name}</span>
                        <div>
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-wrapper">
                <input
                    type="text"
                    placeholder="Адрес"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-field"
                />
                <input
                    type="text"
                    placeholder="Телефон"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-field"
                />
                <textarea
                    placeholder="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="text-area"
                />
                <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="text-field"
                >
                    <option value="delivery">Доставка</option>
                    <option value="self_drive">Самовывоз</option>
                    <option value="preorder">Предзаказ</option> 
                    {/* сделать так чтобы запросить данные партнера потом исходя от него сделать опшины */}
                </select>
            </div>

            <div className="total-wrapper">
                <strong>Сумма: {total} сом</strong>
                {/* <button className="button" onClick={handleSubmit}>Оплатить</button>/ */}
            </div>
        </div>
    );
};
