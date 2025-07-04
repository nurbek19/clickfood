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
    const [deliveryType, setDeliveryType] = useState("");

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

        const foods = cartItems.map((item) => ({ food_id: item._id, count: item.quantity }));

        const orderData = {
            foods,
            address,
            phone,
            comment,
            delivery_option: deliveryType,
            user_id: parseInt(searchParams.get('chat_id')),
            partner_id: parseInt(searchParams.get('partner_id'))
        };

        console.log("Заказ отправлен:", orderData);
        console.log("Заказ отправлен:", JSON.stringify(orderData));

        // TODO: Отправить на сервер здесь при необходимости

        WebApp.MainButton.showProgress();
        api.post('/order', orderData).then((res) => {
            if (res.data) {
                WebApp.MainButton.hide();
                WebApp.openLink(res.data.url);
                WebApp.close();
            }
        }).catch((err) => {
            console.log(err);
            WebApp.MainButton.hideProgress();
            WebApp.MainButton.text = 'Произошло какая то ошибка';
        }) //переписать на try catch
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
    }, [isValid]);

    return (
        <div className="checkout-page">
            <button className="back-button" onClick={onBack}>« Назад</button>
            <div className="checkout-list">
                {cartItems.map(item => (
                    <div key={item._id} className="checkout-item">
                        <p>{item.name}</p>
                        <div className="increase-decrease-buttons">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                    </div>
                ))}

            <div className="total-wrapper">
                <strong>Сумма: {total} сом</strong>
            </div>
            </div>

            <div className="form-wrapper">
                <div className="field-wrapper">
                    <label htmlFor="address" className="field-label">Адрес</label>
                    <input type="text" id="address" className="text-field" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                {/* сделать так чтобы при доставке только высвечивалась */}


                <div className="field-wrapper">
                    <label htmlFor="phone" className="field-label">Номер телефона</label>
                    <input
                        type="tel"
                        pattern="[0-9]*"
                        noValidate
                        id="phone"
                        className="text-field"
                        placeholder="0555 555 555"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                    />
                </div>

                <div className="field-wrapper select-wrapper">
                    <label htmlFor="delivery-type" className="field-label">Тип заказа</label>
                    <select id="delivery-type" className="select-field" value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                        <option value="" disabled>Выбрать тип заказа</option>
                        <option value="delivery">Доставка</option>
                        <option value="self_drive">Самовывоз</option>
                        <option value="preorder">Предзаказ</option>
                        {/* сделать так чтобы запросить данные партнера потом исходя от него сделать опшины */}
                    </select>
                </div>

                <div className="field-wrapper">
                    <label htmlFor="comment" className="field-label">Комментарий к заведению</label>

                    <textarea id="comment" rows="3" className="text-field" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
            </div>
        </div>
    );
};
