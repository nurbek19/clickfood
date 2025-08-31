import "@app/App.css";
import { useCheckoutForm } from "@order/hooks/useCheckoutForm";
import { DeliveryTypeSelector } from "./checkout/DeliveryTypeSelector";
import { AddressSection } from "./checkout/AddressSection";
import { ContactSection } from "./checkout/ContactSection";
import { CommentField } from "./checkout/CommentField";
import { CartList } from "./checkout/CartList";
import { Summary } from "./checkout/Summary";
import { Notices } from "./checkout/Notices";
import { useCartStore } from "@order/store/useCartStore";

export const Checkout = ({ partner, onBack }) => {
  const {
    address, setAddress,
    phone, setPhone,
    username, setUsername,
    comment, setComment,
    deliveryType, setDeliveryType,
    cutleryCount, setCutleryCount,
    total,
    deliveryPrice,
    isLoadingDeliveryPrice,
    isNotAvailableZone,
    updateQuantity,
  } = useCheckoutForm({ partner });

  const items = useCartStore((s) => s.items);

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={onBack}>« Назад</button>

      <CartList items={items} updateQuantity={updateQuantity} />

      <Summary
        total={total}
        deliveryType={deliveryType}
        freeDeliverySum={partner?.free_delivery_sum || 0}
        deliveryPrice={deliveryPrice}
      />

      <Notices
        isNotAvailableZone={isNotAvailableZone}
        isLoadingDeliveryPrice={isLoadingDeliveryPrice}
        partner={partner}
        deliveryType={deliveryType}
      />

      <div className="form-wrapper">
        <DeliveryTypeSelector
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
          options={partner?.delivery_options || []}
        />

        <AddressSection
          visible={deliveryType === 'delivery'}
          address={address}
          setAddress={setAddress}
          cutleryCount={cutleryCount}
          setCutleryCount={setCutleryCount}
        />

        <ContactSection
          username={username}
          setUsername={setUsername}
          phone={phone}
          setPhone={setPhone}
        />

        <CommentField comment={comment} setComment={setComment} />
      </div>
    </div>
  );
};
