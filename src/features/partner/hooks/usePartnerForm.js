import { useCallback, useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import deepEqual from 'deep-equal';
import httpClient from '@shared/api/httpClient';
import { toISO, fromISOToHHmm } from '@partner/utils/time';

export function usePartnerForm({ existingPartner = null }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState(true);
  const [selfDrive, setSelfDrive] = useState(true);
  const [preorder, setPreorder] = useState(false);
  const [freeDeliverySum, setFreeDeliverySum] = useState(0);
  const [photoId, setPhotoId] = useState('');
  const [zones, setZones] = useState([]);
  const [finikId, setFinikId] = useState('');
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('22:00');
  const [useYandexDelivery, setUseYandexDelivery] = useState(false);

  useEffect(() => {
    if (!existingPartner) return;
    setName(existingPartner.name || '');
    setAddress(existingPartner.address || null);
    setPhone(existingPartner.contact || '');
    setFreeDeliverySum(existingPartner.free_delivery_sum || 0);
    setZones((existingPartner.radius_zones || []).map((z) => ({ ...z })));
    const opts = existingPartner.delivery_options || [];
    setDelivery(opts.includes('delivery'));
    setSelfDrive(opts.includes('self_drive'));
    setPreorder(opts.includes('preorder'));
    setPhotoId(existingPartner.photo || '');
    setFinikId(existingPartner.finik_id || '');
    setUseYandexDelivery(existingPartner.use_yandex_delivery || false);
    if (existingPartner.work_time?.from && existingPartner.work_time?.to) {
      setWorkStartTime(fromISOToHHmm(existingPartner.work_time.from));
      setWorkEndTime(fromISOToHHmm(existingPartner.work_time.to));
    }
  }, [existingPartner]);

  const deliveryOptionsArray = useMemo(() => {
    const arr = [];
    if (delivery) arr.push('delivery');
    if (selfDrive) arr.push('self_drive');
    if (preorder) arr.push('preorder');
    return arr;
  }, [delivery, selfDrive, preorder]);

  const currentPayload = useMemo(() => ({
    _id: existingPartner?._id,
    name,
    address,
    contact: phone,
    delivery_options: deliveryOptionsArray,
    photo: photoId,
    free_delivery_sum: parseInt(freeDeliverySum),
    finik_id: finikId,
    use_yandex_delivery: useYandexDelivery,
    work_time: { from: toISO(workStartTime), to: toISO(workEndTime) },
    radius_zones: zones.map((z) => ({ radius: Number(z.radius), price: Number(z.price) })),
  }), [existingPartner?._id, name, address, phone, deliveryOptionsArray, photoId, freeDeliverySum, finikId, useYandexDelivery, workStartTime, workEndTime, zones]);

  const isChanged = useMemo(() => {
    if (!existingPartner) return Boolean(name && address && phone);
    const { chat_id, preorder_service_charge_rate, ...cleaned } = existingPartner;
    return !deepEqual(currentPayload, cleaned);
  }, [existingPartner, currentPayload, name, address, phone]);

  useEffect(() => {
    WebApp.MainButton.setText(existingPartner ? 'Сохранить' : 'Создать');
    if (isChanged) WebApp.MainButton.show();
    else WebApp.MainButton.hide();
  }, [isChanged, existingPartner]);

  const submit = useCallback(() => {
    console.log('submit', currentPayload);
    WebApp.sendData(JSON.stringify(currentPayload));
  }, [currentPayload]);

  useEffect(() => {
    WebApp.onEvent('mainButtonClicked', submit);
    return () => WebApp.offEvent('mainButtonClicked', submit);
  }, [submit]);

  const uploadPhoto = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await httpClient.post('/photo/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (res.data?.id) setPhotoId(res.data.id);
    return res.data;
  }, []);

  return {
    // state
    name, setName,
    address, setAddress,
    phone, setPhone,
    delivery, setDelivery,
    selfDrive, setSelfDrive,
    preorder, setPreorder,
    freeDeliverySum, setFreeDeliverySum,
    photoId, setPhotoId,
    zones, setZones,
    finikId, setFinikId,
    workStartTime, setWorkStartTime,
    workEndTime, setWorkEndTime,
    useYandexDelivery, setUseYandexDelivery,
    // derived
    deliveryOptionsArray,
    isChanged,
    // actions
    uploadPhoto,
    submit,
  };
}


