import { useState } from "react";

export const DishList = ({ dishes, onEdit }) => {
  const [dishCategory, setDishCategory] = useState(dishes?.[0]?.category ?? '');

  if (dishes.length === 0) return <p>Нет блюд</p>;

  // Группируем блюда по категориям
  const grouped = dishes.reduce((acc, dish, index) => {
    const cat = dish.category || "Без категории";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...dish, index });
    return acc;
  }, {});

  return (
    <div className="dish-list-container">
      <div className="dish-categories-container">
        {Object.keys(grouped).map((category) => (
          <label className="radio-input-label" key={category}>
            <input type="radio" name="houseType" value={category} className="radio-input" checked={dishCategory === category} onChange={(e) => setDishCategory(e.target.value)} />

            <span className="radio-input-text">
              {category}
            </span>
          </label>
        ))}
      </div>

      <div className="dish-list">
        {grouped[dishCategory] && grouped[dishCategory].map((dish) => {
          return (
            <div className="dish-card" key={dish._id}>
              <div className="dish-card-image">
                <img src={`https://booklink.pro/cf/photo?id=${dish.photo}`} alt="" />
              </div>
              <div className="dish-details">
                <span className="dish-price">{dish.price} сом</span>
                <span className="dish-weight">{dish.weight} г / мл</span>
              </div>

              <p className="dish-title">{dish.name}</p>

              <button className="secondary-button" onClick={() => onEdit(dish.index)}>Редактировать</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
