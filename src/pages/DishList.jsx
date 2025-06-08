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
    <div>
      <h4>Список блюд</h4>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <h5>{category}</h5>
          {items.map(({ name, price, index }) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <strong>{name}</strong> — {price} сом{" "}
              <button onClick={() => onEdit(index)}>Редактировать</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
  