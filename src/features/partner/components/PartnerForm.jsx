import "@app/App.css";
import { AddressInput, PhoneInput as PhoneInputComponent } from "@shared/ui";
import { RadiusZonesForm } from "./RadiusZonesForm";
import { usePartnerForm } from "@partner/hooks/usePartnerForm";

export const PartnerForm = ({ existingPartner = null }) => {
  const {
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
    isChanged,
    submit,
  } = usePartnerForm({ existingPartner });

  return (
    <div className="partner-form-container">
      <h3>Настройки партнера</h3>

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
          <input type="time" id="work-start-time" className="text-field" value={workStartTime} onChange={(e) => setWorkStartTime(e.target.value)} />
        </div>
        <div className="field-wrapper">
          <label htmlFor="work-end-time" className="field-label">Время закрытия</label>
          <input type="time" id="work-end-time" className="text-field" value={workEndTime} onChange={(e) => setWorkEndTime(e.target.value)} />
        </div>
      </div>

      {delivery && (
        <div className="field-wrapper switch-buttons">
          <span className="field-label">Настройки доставки</span>
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
        <input type="number" id="free-delivery-sum" className="text-field" value={freeDeliverySum} onChange={(e) => setFreeDeliverySum(e.target.value)} />
      </div>

      {/* Photo upload remains same as before (uses setPhotoId via hook) */}
      <div className="company-phot-container">
        {photoId && (
          <img src={`https://booklink.pro/cf/photo?id=${photoId}`} alt="company" />
        )}
      </div>
    {/* {isChanged && <button onClick={submit}>btn</button>} */}
    </div>
  );
};
