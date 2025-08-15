import { Drawer } from 'vaul';
import '../App.css';

export const DishDescriptionDrawer = ({
  isOpen,
  onClose,
  dish,
  quantity,
  onQuantityChange
}) => {
  if (!dish) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="drawer-overlay" />
        <Drawer.Content className="drawer-content">
          <div className="drawer-content-wrapper">
            <Drawer.Title className="drawer-title" />
            <Drawer.Description className="drawer-description" />
            <div className="dish-drawer-image">
              <img
                src={`https://booklink.pro/cf/photo?id=${dish.photo}`}
                alt={dish.name}
              />
            </div>

            {/* Dish Info */}
            <div className="dish-info">
              <h4 className="dish-title">{dish.name}</h4>
              <div className="dish-price-weight">
                <span className="dish-price">{dish.price} сом</span>
                <span className="dish-weight">{dish.weight} г / мл</span>
              </div>

              {/* Description */}
              {dish.description && (
                <div className="dish-description">{dish.description}</div>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="quantity-section">
              <span className="quantity-label">Количество</span>
              <div className="dish-counters">
                <button
                  className="primary-button"
                  onClick={() => onQuantityChange(dish, quantity - 1)}
                  disabled={quantity <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                  </svg>
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="primary-button"
                  onClick={() => onQuantityChange(dish, quantity + 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
