export const Notices = ({ isNotAvailableZone, isLoadingDeliveryPrice, partner, deliveryType }) => (
  <>
    {deliveryType === 'delivery' && Boolean(partner?.free_delivery_sum) && (
      <div className="delivery-information">Бесплатная доставка - для заказа от {partner.free_delivery_sum} сом</div>
    )}
    {isNotAvailableZone && !isLoadingDeliveryPrice && (
      <div className="delivery-not-available">Извините не можем доставить в ваш адрес</div>
    )}
    {isLoadingDeliveryPrice && (
      <div className="delivery-loading">Загрузка цены доставки...</div>
    )}
  </>
);


