export const Summary = ({ total, deliveryType, freeDeliverySum, deliveryPrice }) => {
  return (
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
  );
};


