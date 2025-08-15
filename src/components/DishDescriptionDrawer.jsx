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
        <Drawer.Overlay />
        <Drawer.Content>
          <div className="drawer-content-wrapper">
            {/* Handle */}
            <div className="drawer-handle" />
            
            {/* Dish Image */}
            <div className="dish-drawer-image">
              <img 
                src={`https://booklink.pro/cf/photo?id=${dish.photo}`} 
                alt={dish.name}
              />
            </div>

            {/* Dish Info */}
            <div className="dish-info">
              <h2 className="dish-title">{dish.name}</h2>
              <div className="dish-price-weight">
                <span className="dish-price">{dish.price} сом</span>
                <span className="dish-weight">{dish.weight} г / мл</span>
              </div>
              
              {/* Description */}
              {dish.description && (
                <div className="dish-description">
                  <h3 className="description-title">Описание</h3>
                  <p className="description-text">{dish.description}</p>
                </div>
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
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="primary-button" 
                  onClick={() => onQuantityChange(dish, quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            {quantity === 0 && (
              <button 
                className="primary-button add-to-cart-button"
                onClick={() => onQuantityChange(dish, 1)}
              >
                Добавить в корзину
              </button>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
