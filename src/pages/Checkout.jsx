import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

import { api } from "../api";
import "../App.css";
import { AddressInput } from "../components/AddressInput";
import { checkDeliveryZones } from "../components/AddressInput";
import { CutleryCounter } from "../components/CutleryCounter";
import PhoneInputComponent from "../components/PhoneInput";
import { getDeliveryPrice } from "../utils/deliveryPriceApi";

const OPTIONS_LABEL = {
    'delivery': 'Доставка',
    'self_drive': 'Самовывоз',
    'preorder': 'Предзаказ'
}

export const Checkout = ({ cartItems, setCartItems, partner, onBack }) => {
    // partner.use_yandex_delivery = true;
    const [searchParams] = useSearchParams();

    const [address, setAddress] = useState(null);
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState("");
    const [deliveryType, setDeliveryType] = useState("");
    const [freeDeliverySum, setFreeDeliverySum] = useState(0);
    const [deliveryPrice, setDeliveryPrice] = useState(null);
    const [apiDeliveryPrice, setApiDeliveryPrice] = useState(null);
    const [isLoadingDeliveryPrice, setIsLoadingDeliveryPrice] = useState(false);
    const [cutleryCount, setCutleryCount] = useState(1);

    useEffect(() => {
        if (partner?.free_delivery_sum !== 0) {
            setFreeDeliverySum(partner.free_delivery_sum)
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

    // Function to fetch delivery price from API
    const fetchDeliveryPriceFromApi = useCallback(async () => {
        if (!partner?.use_yandex_delivery || !address || !partner?.address) {
            return;
        }

        setIsLoadingDeliveryPrice(true);
        try {
            const priceData = await getDeliveryPrice(partner.address, address);
            setApiDeliveryPrice(Number(priceData.price) || 0);
        } catch (error) {
            console.error('Failed to fetch delivery price:', error);
            setApiDeliveryPrice(null);
        } finally {
            setIsLoadingDeliveryPrice(false);
        }
    }, [partner?.use_yandex_delivery, partner?.address, address]);

    // Fetch delivery price when address changes and partner uses API
    useEffect(() => {
        if (deliveryType === 'delivery' && partner?.use_yandex_delivery && address) {
            fetchDeliveryPriceFromApi();
        } else {
            setApiDeliveryPrice(null);
        }
    }, [address, partner?.use_yandex_delivery, deliveryType, fetchDeliveryPriceFromApi]);

    // Clear delivery price when address is cleared
    useEffect(() => {
        if (!address) {
            setDeliveryPrice(null);
            setApiDeliveryPrice(null);
        }
    }, [address]);

    const handleSubmit = () => {
        const foods = cartItems.map((item) => ({ food_id: item._id, count: item.quantity }));

        const orderData = {
            foods,
            address,
            user_name: username,
            phone,
            comment,
            delivery_option: deliveryType,
            fork_count: cutleryCount,
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

    const isNotAvailableZone = useMemo(() => {
        if (address && partner) {
            // If partner uses API pricing, check if we have a valid price
            if (partner.use_yandex_delivery) {
                if (apiDeliveryPrice !== null && apiDeliveryPrice !== undefined) {
                    setDeliveryPrice(Number(apiDeliveryPrice));
                    return false;
                } else if (isLoadingDeliveryPrice) {
                    // Still loading, don't block checkout
                    return false;
                } else {
                    // API failed or no price available
                    setDeliveryPrice(null);
                    return true;
                }
            } else {
                // Use radius-based pricing (existing logic)
                const zoneObj = checkDeliveryZones(
                    [address.point.lon, address.point.lat], partner.radius_zones, [partner.address.point.lon, partner.address.point.lat]
                );

                if (zoneObj.inZone) {
                    setDeliveryPrice(zoneObj.price);
                    return false;
                } else {
                    setDeliveryPrice(null);
                    return true;
                }
            }
        } else {
            // No address or partner, clear delivery price
            setDeliveryPrice(null);
            return false;
        }
    }, [address, partner, apiDeliveryPrice, isLoadingDeliveryPrice]);

    useEffect(() => {
        WebApp.onEvent('mainButtonClicked', handleSubmit);

        return () => {
            WebApp.offEvent('mainButtonClicked', handleSubmit);
        };
    }, [cartItems, address, username, phone, comment, deliveryType, cutleryCount]);

    const isValid = useMemo(() => {
        if (deliveryType === 'delivery') {
            // if (isNotAvailableZone) {
            //     alert('Извините ваш адрес не входит в зону доставки.')
            // }

            return cartItems.length && phone && deliveryType && address && username && !isNotAvailableZone;
        }

        return cartItems.length && username && phone && deliveryType;
    }, [cartItems, address, phone, username, deliveryType, isNotAvailableZone]);

    useEffect(() => {
        // WebApp.MainButton.text = `Оплатить - ${total} сом`;
        WebApp.MainButton.text = `Оплатить`;

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
                    {deliveryType === 'delivery' && Boolean(freeDeliverySum) && (
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
                                        Boolean(deliveryPrice) ? <p>Доставка: {deliveryPrice} сом</p> : null
                                    ) : (
                                        'Доставка: 0 сом'
                                    )}
                                </p>
                            ) : (
                                Boolean(deliveryPrice) ? <p>Доставка: {deliveryPrice} сом</p> : null
                            )}

                            <strong>
                                Итого: {freeDeliverySum ? (
                                    freeDeliverySum - total > 0 ? (
                                        Boolean(deliveryPrice) ? total + Number(deliveryPrice) : total
                                    ) : (
                                        total
                                    )
                                ) : (
                                    Boolean(deliveryPrice) ? total + Number(deliveryPrice) : total
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

            {isNotAvailableZone && !isLoadingDeliveryPrice && (
                <div className="delivery-not-available">Извините не можем доставить в ваш адрес</div>
            )}

            {isLoadingDeliveryPrice && (
                <div className="delivery-loading">Загрузка цены доставки...</div>
            )}

            <div className="form-wrapper">
                <div className="field-wrapper select-wrapper">
                    <label htmlFor="delivery-type" className="field-label">Тип заказа</label>
                    <select 
                        id="delivery-type" 
                        className={`select-field ${!deliveryType ? 'select-placeholder' : ''}`} 
                        value={deliveryType} 
                        onChange={(e) => setDeliveryType(e.target.value)}
                    >
                        <option value="" disabled>Выберите тип доставки</option>
                        {partner?.delivery_options?.map((option) => (
                            <option key={option} value={option}>{OPTIONS_LABEL[option]}</option>
                        ))}
                    </select>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z"/>
                    </svg>
                </div>

                {deliveryType === 'delivery' && (
                    <>
                        <AddressInput setAddress={setAddress} />
                        <CutleryCounter count={cutleryCount} setCount={setCutleryCount} />
                    </>
                )}

                <div className="field-wrapper">
                    <label htmlFor="name" className="field-label">Имя</label>
                    <input type="text" id="name" className="text-field" placeholder="Руслан" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <PhoneInputComponent
                    value={phone}
                    onChange={setPhone}
                    label="Номер телефона"
                    placeholder="+996 555 555 555"
                    required={true}
                />

                <div className="field-wrapper">
                    <label htmlFor="comment" className="field-label">Комментарий к заведению</label>

                    <textarea id="comment" rows="3" className="text-field" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
            </div>
        </div>
    );
};
