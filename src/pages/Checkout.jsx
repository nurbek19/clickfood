import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import { api } from "../api";
import "../App.css";

const OPTIONS_LABEL = {
    'delivery': 'Доставка',
    'self_drive': 'Самовывоз',
    'preorder': 'Предзаказ'
}

export const Checkout = ({ cartItems, setCartItems, partner, onBack }) => {
    const [searchParams] = useSearchParams();

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [deliveryType, setDeliveryType] = useState("");
    const [freeDeliverySum, setFreeDeliverySum] = useState(0);
    const [fixedPrice, setFixedPrice] = useState(0);
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);

    useEffect(() => {
        if (partner?.free_delivery_sum !== 0) {
            setFreeDeliverySum(partner.free_delivery_sum)
        }

        const deliveryOption = partner?.delivery_options?.find((o) => o.option === 'delivery');

        if (deliveryOption?.price !== 0) {
            setFixedPrice(deliveryOption.price);
        } else {
            setIsFreeDelivery(true);
        }

    }, [partner]);

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
        if (deliveryType === 'delivery') {
            return cartItems.length && phone && deliveryType && address;
        }

        return cartItems.length && phone && deliveryType;
    }, [cartItems, address, phone, deliveryType]);

    useEffect(() => {
        WebApp.MainButton.text = `Оплатить - ${total} сом`;

        if (isValid) {
            WebApp.MainButton.show();

        } else {
            WebApp.MainButton.hide();
        }
    }, [isValid, total]);

    return (
        <div className="checkout-page">
            <button className="back-button" onClick={onBack}>« Назад</button>
            <div className="checkout-list">
                {cartItems.map(item => (
                    <div key={item._id} className="checkout-item">
                        <p>{item.name}</p>
                        <div className="increase-decrease-buttons">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                </svg>
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                <div className="total-wrapper">
                    {deliveryType === 'delivery' && freeDeliverySum && (
                        freeDeliverySum - total > 0 ? (
                            <div className="free-delivery-sum">До бесплатной доставки {freeDeliverySum - total} сом</div>
                        ) : (
                            <div className="free-delivery-sum">Бесплатная доставка</div>
                        )

                    )}

                    {deliveryType === 'delivery' ? (
                        <div className="delivery-sum">
                            <p>Сумма: {total} сом</p>
                            {freeDeliverySum ? (
                                <p>
                                    {freeDeliverySum - total > 0 ? (
                                        `Доставка: ${fixedPrice} сом`
                                    ) : (
                                        'Доставка: 0 сом'
                                    )}
                                </p>
                            ) : (
                                <p>Доставка: {isFreeDelivery ? 0 : fixedPrice} сом</p>
                            )}

                            <strong>
                                Итого: {freeDeliverySum ? (
                                    freeDeliverySum - total > 0 ? (
                                        total + fixedPrice
                                    ) : (
                                        total
                                    )
                                ) : (
                                    isFreeDelivery ? total : (total + fixedPrice)
                                )} сом
                            </strong>
                        </div>
                    ) : (
                        <strong>Сумма: {total} сом</strong>
                    )}
                </div>
            </div>

            {deliveryType === 'delivery' && Boolean(freeDeliverySum) && (
                <div className="delivery-information">Бесплатная доставка - для заказа от {partner.free_delivery_sum} сом</div>
            )}

            {deliveryType === 'delivery' && isFreeDelivery && (
                <div className="delivery-information">Доставка бесплатная</div>
            )}

            {deliveryType === 'delivery' && Boolean(fixedPrice) && (
                <div className="delivery-information">Фиксированная цена доставки {fixedPrice} сом</div>
            )}

            <div className="form-wrapper">
                <div className="field-wrapper select-wrapper">
                    <label htmlFor="delivery-type" className="field-label">Тип заказа</label>
                    <select id="delivery-type" className="select-field" value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                        <option value="" disabled>Выбрать тип заказа</option>
                        {partner.delivery_options?.map((obj) => (
                            <option key={obj.option} value={obj.option}>{OPTIONS_LABEL[obj.option]}</option>
                        ))}
                    </select>
                </div>

                {deliveryType === 'delivery' && (
                    <div className="field-wrapper">
                        <label htmlFor="address" className="field-label">Адрес</label>
                        <input type="text" id="address" className="text-field" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                )}


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

                <div className="field-wrapper">
                    <label htmlFor="comment" className="field-label">Комментарий к заведению</label>

                    <textarea id="comment" rows="3" className="text-field" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
            </div>
        </div>
    );
};
