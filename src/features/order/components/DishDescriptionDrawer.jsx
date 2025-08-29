import { Drawer } from "vaul";
import "../../../app/App.css";
import { Minus, Plus } from "lucide-react";

export const DishDescriptionDrawer = ({
  isOpen,
  onClose,
  dish,
  quantity,
  onQuantityChange,
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
              {quantity === 0 ? (
                <button
                  className="primary-button add-to-cart-button"
                  onClick={() => onQuantityChange(dish, 1)}
                >
                  Добавить блюдо
                </button>
              ) : (
                <div className="drawer-dish-counters">
                  <button
                    className="primary-button"
                    onClick={() => onQuantityChange(dish, quantity - 1)}
                  >
                    <Minus />
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="primary-button"
                    onClick={() => onQuantityChange(dish, quantity + 1)}
                  >
                    <Plus />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
