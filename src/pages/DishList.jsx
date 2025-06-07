export const DishList = ({ dishes, onEdit }) => {
    if (dishes.length === 0) return <p>Нет блюд</p>;
  
    return (
      <div>
        <h4>Список блюд</h4>
        {dishes.map((dish, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{dish.name}</strong> — {dish.price} сом — {dish.category}{" "}
            <button onClick={() => onEdit(i)}>Редактировать</button>{" "}
            {/* <button onClick={() => onDelete(i)}>Удалить</button> */}
          </div>
        ))}
      </div>
    );
  };
  