import { useEffect, useState, useCallback } from "react";
import WebApp from "@twa-dev/sdk";
import { useDropzone } from "react-dropzone";
import { api } from "../api";

import "../App.css";

export const PartnerForm = ({ existingPartner = null }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState(true);
  const [selfDrive, setSelfDrive] = useState(true);
  const [preorder, setPreorder] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [photoId, setPhotoId] = useState('');

  // Заполняем данные при редактировании
  useEffect(() => {
    if (existingPartner) {
      setName(existingPartner.name || '');
      setAddress(existingPartner.address || '');
      setPhone(existingPartner.contact || '');

      const opts = existingPartner.delivery_options || [];
      setDelivery(opts.some(o => o.option === "delivery"));
      setSelfDrive(opts.some(o => o.option === "self_drive"));
      setPreorder(opts.some(o => o.option === "preorder"));

      const deliveryOption = opts.find(o => o.option === "delivery");
      setDeliveryCost(deliveryOption?.price || 0);

      setPhotoId(existingPartner.photo || '');
    }
  }, [existingPartner]);

  // Отправка данных
  const sendData = useCallback(() => {
    const delivery_options = [];

    if (delivery) {
      delivery_options.push({ option: "delivery", price: parseInt(deliveryCost) });
    }

    if (selfDrive) delivery_options.push({ option: "self_drive" });
    if (preorder) delivery_options.push({ option: "preorder" });

    WebApp.sendData(JSON.stringify({
      _id: existingPartner?._id,
      name,
      address,
      contact: phone,
      delivery_options,
      photo: photoId,
    }));
  }, [existingPartner, name, address, phone, delivery, selfDrive, preorder, deliveryCost, photoId]);

  // Кнопка Telegram
  useEffect(() => {
    WebApp.MainButton.setText(existingPartner ? "Сохранить" : "Создать");

    if (name && address && phone) {
      WebApp.MainButton.show();
    } else {
      WebApp.MainButton.hide();
    }

    WebApp.onEvent("mainButtonClicked", sendData);
    return () => {
      WebApp.offEvent("mainButtonClicked", sendData);
    };
  }, [name, address, phone, delivery, selfDrive, preorder, deliveryCost, photoId]);

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

      <div className="field-wrapper">
        <label htmlFor="address" className="field-label">Адрес</label>
        <input type="text" id="address" className="text-field" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="field-wrapper">
        <label htmlFor="phone" className="field-label">Контактный номер телефона</label>
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

      {delivery && (
          <div className="field-wrapper">
            <label htmlFor="delivery-price" className="field-label">Стоимость доставки</label>
            <input
              type="number"
              id="delivery-price"
              className="text-field"
              value={deliveryCost}
              onChange={(e) => setDeliveryCost(e.target.value)}
            />
          </div>
        )}

      <div {...getRootProps()} className="upload-box">
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
    </div>
  );
};
