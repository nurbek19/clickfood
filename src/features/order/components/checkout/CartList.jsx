export const CartList = ({ items, updateQuantity }) => (
  <div className="checkout-list">
    {items.map((item) => (
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
  </div>
);


