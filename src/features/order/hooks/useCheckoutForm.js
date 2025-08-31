import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import WebApp from '@twa-dev/sdk';

import httpClient from '@shared/api/httpClient';
import { getDeliveryPrice } from '@order/services/deliveryService';
import { checkDeliveryZones } from '@shared/ui/AddressInput';
import { useCartStore } from '@order/store/useCartStore';

export function useCheckoutForm({ partner }) {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chat_id');
  const partnerId = searchParams.get('partner_id');

  // Form state
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [cutleryCount, setCutleryCount] = useState(1);

  // Delivery price state
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [apiDeliveryPrice, setApiDeliveryPrice] = useState(null);
  const [isLoadingDeliveryPrice, setIsLoadingDeliveryPrice] = useState(false);

  // Cart
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

  const fetchDeliveryPriceFromApi = useCallback(async () => {
    if (!partner?.use_yandex_delivery || !address || !partner?.address) return;
    setIsLoadingDeliveryPrice(true);
    try {
      const priceData = await getDeliveryPrice(partner.address, address);
      setApiDeliveryPrice(Math.floor(Number(priceData.price / 2)) || 0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch delivery price:', err);
      setApiDeliveryPrice(null);
    } finally {
      setIsLoadingDeliveryPrice(false);
    }
  }, [partner?.use_yandex_delivery, partner?.address, address]);

  useEffect(() => {
    if (deliveryType === 'delivery' && partner?.use_yandex_delivery && address) {
      fetchDeliveryPriceFromApi();
    } else {
      setApiDeliveryPrice(null);
    }
  }, [address, partner?.use_yandex_delivery, deliveryType, fetchDeliveryPriceFromApi]);

  // Clear price when no address
  useEffect(() => {
    if (!address) {
      setDeliveryPrice(null);
      setApiDeliveryPrice(null);
    }
  }, [address]);

  // Determine zone/price
  const isNotAvailableZone = useMemo(() => {
    if (address && partner) {
      if (deliveryType !== 'delivery') {
        setDeliveryPrice(null);
        return false;
      }
      if (partner.use_yandex_delivery) {
        if (apiDeliveryPrice !== null && apiDeliveryPrice !== undefined) {
          setDeliveryPrice(Number(apiDeliveryPrice));
          return false;
        } else if (isLoadingDeliveryPrice) {
          return false;
        } else {
          setDeliveryPrice(null);
          return true;
        }
      }
      const zoneObj = checkDeliveryZones(
        [address.point.lon, address.point.lat],
        partner.radius_zones,
        [partner.address.point.lon, partner.address.point.lat]
      );
      if (zoneObj.inZone) {
        setDeliveryPrice(zoneObj.price);
        return false;
      }
      setDeliveryPrice(null);
      return true;
    }
    setDeliveryPrice(null);
    return false;
  }, [address, partner, apiDeliveryPrice, isLoadingDeliveryPrice, deliveryType]);

  const isValid = useMemo(() => {
    if (deliveryType === 'delivery') {
      return items.length && phone && deliveryType && address && username && !isNotAvailableZone;
    }
    return items.length && username && phone && deliveryType;
  }, [items.length, address, phone, username, deliveryType, isNotAvailableZone]);

  const submit = useCallback(() => {
    const foods = items.map((item) => ({ food_id: item._id, count: item.quantity }));
    const orderData = {
      foods,
      address,
      user_name: username,
      phone,
      comment,
      delivery_option: deliveryType,
      fork_count: cutleryCount,
      user_id: parseInt(chatId),
      partner_id: parseInt(partnerId),
    };

    WebApp.MainButton.showProgress();
    httpClient
      .post('/order', orderData)
      .then((res) => {
        if (res.data) {
          WebApp.MainButton.hide();
          WebApp.openLink(res.data.url);
          WebApp.close();
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        WebApp.MainButton.hideProgress();
        WebApp.MainButton.text = 'Произошло какая то ошибка';
      });
  }, [items, address, username, phone, comment, deliveryType, cutleryCount, chatId, partnerId]);

  useEffect(() => {
    WebApp.MainButton.text = 'Оплатить';
    if (isValid) WebApp.MainButton.show();
    else WebApp.MainButton.hide();
  }, [isValid, total]);

  useEffect(() => {
    const handler = () => submit();
    WebApp.onEvent('mainButtonClicked', handler);
    return () => WebApp.offEvent('mainButtonClicked', handler);
  }, [submit]);

  return {
    // state
    address, setAddress,
    phone, setPhone,
    username, setUsername,
    comment, setComment,
    deliveryType, setDeliveryType,
    cutleryCount, setCutleryCount,
    // derived
    total,
    deliveryPrice,
    apiDeliveryPrice,
    isLoadingDeliveryPrice,
    isNotAvailableZone,
    isValid,
    // actions
    updateQuantity,
    submit,
  };
}


