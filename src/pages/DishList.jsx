export const DishList = ({ dishes, onEdit }) => {
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
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="partner-dish-card">
          <h4>{category}</h4>
          <div className="badges-container">
          {items.map(({ name, index }) => (
            <div key={index} className="food-badge">
              <p>{name}</p>
              <button onClick={() => onEdit(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
              </button>
            </div>
          ))}
          </div>
        </div>
      ))}
    </div>
  );
};
