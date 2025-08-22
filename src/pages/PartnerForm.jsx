import { useEffect, useState, useCallback, useMemo } from "react";
import WebApp from "@twa-dev/sdk";
import { useDropzone } from "react-dropzone";
import deepEqual from 'deep-equal';
import { api } from "../api";

import "../App.css";
import { AddressInput } from "../components/AddressInput";
import { RadiusZonesForm } from "../components/RadiusZonesForm";
import PhoneInputComponent from "../components/PhoneInput";

// Utility function to convert time string to ISO 8601 UTC format
const convertTimeToISO = (timeString) => {
  const today = new Date();
  const [hours, minutes] = timeString.split(':');
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
  // Remove milliseconds to match existing format
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

export const PartnerForm = ({ existingPartner = null }) => {
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

  // Заполняем данные при редактировании
  useEffect(() => {
    if (existingPartner) {
      setName(existingPartner.name || '');
      setAddress(existingPartner.address || null);
      const phoneNumber = existingPartner.contact || '';
      setPhone(phoneNumber);
      setFreeDeliverySum(existingPartner.free_delivery_sum || 0)
      setZones((existingPartner.radius_zones || []).map(z => ({ ...z })));

      const opts = existingPartner.delivery_options || [];
      setDelivery(opts.some(o => o === "delivery"));
      setSelfDrive(opts.some(o => o === "self_drive"));
      setPreorder(opts.some(o => o === "preorder"));

      setPhotoId(existingPartner.photo || '');
      setFinikId(existingPartner.finik_id || '');
      setUseYandexDelivery(existingPartner.use_yandex_delivery || false);

      // Handle work time data from work_time object
      if (existingPartner.work_time?.from && existingPartner.work_time?.to) {
        const convertISOToTimeString = (isoString) => {
          const date = new Date(isoString);
          return date.toTimeString().slice(0, 5); // Get HH:MM format
        };
        setWorkStartTime(convertISOToTimeString(existingPartner.work_time.from));
        setWorkEndTime(convertISOToTimeString(existingPartner.work_time.to));
      }
    }
  }, [existingPartner]);

  // Отправка данных
  const sendData = useCallback(() => {
    const delivery_options = [];

    if (delivery) delivery_options.push("delivery");
    if (selfDrive) delivery_options.push("self_drive");
    if (preorder) delivery_options.push("preorder");

    const workTimeFromISO = convertTimeToISO(workStartTime);
    const workTimeToISO = convertTimeToISO(workEndTime);

    WebApp.sendData(JSON.stringify({
      _id: existingPartner?._id,
      name,
      address,
      contact: phone,
      delivery_options,
      photo: photoId,
      free_delivery_sum: parseInt(freeDeliverySum),
      finik_id: finikId,
      use_yandex_delivery: useYandexDelivery,
      work_time: {
        from: workTimeFromISO,
        to: workTimeToISO,
      },
      radius_zones: zones.map((z) => ({ radius: Number(z.radius), price: Number(z.price) }))
    }));

    console.log({
      _id: existingPartner?._id,
      name,
      address,
      contact: phone,
      delivery_options,
      photo: photoId,
      free_delivery_sum: parseInt(freeDeliverySum),
      finik_id: finikId,
      use_yandex_delivery: useYandexDelivery,
      work_time: {
        from: workTimeFromISO,
        to: workTimeToISO,
      },
      radius_zones: zones.map((z) => ({ radius: Number(z.radius), price: Number(z.price) }))
    });
  }, [existingPartner, name, address, phone, delivery, selfDrive, preorder, freeDeliverySum, photoId, finikId, workStartTime, workEndTime, zones, useYandexDelivery]);

  const isChanged = useMemo(() => {
    if (!existingPartner) {
      return name && address && phone;
    } else {
      const delivery_options = [];

      if (delivery) delivery_options.push("delivery");
      if (selfDrive) delivery_options.push("self_drive");
      if (preorder) delivery_options.push("preorder");

      const { chat_id, ...cleanedPartner } = existingPartner;

      const currentWorkTimeFromISO = convertTimeToISO(workStartTime);
      const currentWorkTimeToISO = convertTimeToISO(workEndTime);

      const currentData = {
        _id: existingPartner._id,
        name,
        address,
        contact: phone,
        delivery_options,
        photo: photoId,
        free_delivery_sum: parseInt(freeDeliverySum),
        finik_id: finikId,
        use_yandex_delivery: useYandexDelivery,
        work_time: {
          from: currentWorkTimeFromISO,
          to: currentWorkTimeToISO,
        },
        radius_zones: zones.map((z) => ({ radius: Number(z.radius), price: Number(z.price) })),
        preorder_service_charge_rate: 0
      };

      const hasChanges = !deepEqual(currentData, cleanedPartner);

      // console.log('Current data:', JSON.stringify(currentData, null, 2));
      // console.log('Cleaned partner:', JSON.stringify(cleanedPartner, null, 2));
      // console.log('Has changes:', hasChanges);

      return hasChanges;
    }
  }, [existingPartner, name, address, phone, delivery, selfDrive, preorder, freeDeliverySum, photoId, finikId, workStartTime, workEndTime, zones, useYandexDelivery]);

  // Кнопка Telegram
  useEffect(() => {
    WebApp.MainButton.setText(existingPartner ? "Сохранить" : "Создать");

    if (isChanged) {
      // name && address && phone
      WebApp.MainButton.show();
    } else {
      WebApp.MainButton.hide();
    }

    WebApp.onEvent('mainButtonClicked', sendData);

    return () => {
      WebApp.offEvent('mainButtonClicked', sendData);
    };
  }, [isChanged, sendData]);

  // Загрузка фото
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await api.post("/photo/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.id) {
        setPhotoId(response.data.id);
      }

      console.log("Uploaded:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div className="partner-form-container">
      <div className="field-wrapper">
        <label htmlFor="name" className="field-label">Название</label>
        <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <AddressInput address={address} setAddress={setAddress} />

      <PhoneInputComponent
        value={phone}
        onChange={setPhone}
        label="Контактный номер телефона"
        placeholder="+996 555 555 555"
      />

      <div className="field-wrapper switch-buttons">
        <span className="field-label">Варианты заказов</span>

        <label className="switch">
          <input type="checkbox" checked={selfDrive} onChange={(e) => setSelfDrive(e.target.checked)} />
          <span className="slider round" />
          <span>Самовывоз</span>
        </label>

        <label className="switch">
          <input type="checkbox" checked={preorder} onChange={(e) => setPreorder(e.target.checked)} />
          <span className="slider round" />
          <span>Предзаказ</span>
        </label>

        <label className="switch">
          <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} />
          <span className="slider round" />
          <span>Доставка</span>
        </label>
      </div>

      <div className="work-time-wrapper">
        <div className="field-wrapper">
          <label htmlFor="work-start-time" className="field-label">Время открытия</label>
          <input
            type="time"
            id="work-start-time"
            className="text-field"
            value={workStartTime}
            onChange={(e) => setWorkStartTime(e.target.value)}
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="work-end-time" className="field-label">Время закрытия</label>
          <input
            type="time"
            id="work-end-time"
            className="text-field"
            value={workEndTime}
            onChange={(e) => setWorkEndTime(e.target.value)}
          />
        </div>
      </div>


      {delivery && (
        <div className="field-wrapper switch-buttons">
          <span className="field-label">Настройки доставки</span>

          {/* <label className="switch">
            <input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} />
            <span className="slider round" />
            <span>Доставка</span>
          </label> */}

          <label className="switch">
            <input type="checkbox" checked={useYandexDelivery} onChange={(e) => setUseYandexDelivery(e.target.checked)} />
            <span className="slider round" />
            <span>Использовать Яндекс доставку</span>
          </label>
        </div>
      )}

      {delivery && (
        <RadiusZonesForm zones={zones} setZones={setZones} />
      )}

      <div className="field-wrapper">
        <label htmlFor="free-delivery-sum" className="field-label">Сумма для бесплатной доставки</label>
        <input
          type="number"
          id="free-delivery-sum"
          className="text-field"
          value={freeDeliverySum}
          onChange={(e) => setFreeDeliverySum(e.target.value)}
        />
      </div>

      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <button className="secondary-button">
          {photoId ? 'Заменить фотографию' : 'Загрузить изображение'}
        </button>

        {photoId && (
          <div className="company-phot-container">
            <img src={`https://booklink.pro/cf/photo?id=${photoId}`} alt="company" />
          </div>
        )}
      </div>

      {/* <div className="field-wrapper">
        <label htmlFor="finikId" className="field-label">Fink Id (добавляется в случаи когда у партнера есть свой finik счет)</label>
        <input type="text" id="finikId" className="text-field" value={finikId} onChange={(e) => setFinikId(e.target.value)} />
      </div> */}

      {/* {isChanged && <button onClick={sendData}>btn</button>} */}
    </div>
  );
};
