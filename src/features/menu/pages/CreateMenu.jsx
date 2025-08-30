import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import WebApp from "@twa-dev/sdk";
import { useDishes } from "@menu/hooks/useDishes";
import { DishForm, DishList, EditDishModal } from "@menu/components";

const CreateMenu = () => {
  const [searchParams] = useSearchParams();

  const partnerId = searchParams.get('chat_id');
  const { dishes, setDishes, categories, setCategories, isChanged, getChangedDishes, refresh } = useDishes({ partnerId });

  const [editingDish, setEditingDish] = useState(null);
  const [operation, setOperationType] = useState('create');

  const sendData = useCallback(() => {
    const changedDishes = getChangedDishes();
    WebApp.sendData(JSON.stringify(changedDishes));
  }, [getChangedDishes]);

  useEffect(() => {
    WebApp.MainButton.setText("Обновить меню");
    if (isChanged) WebApp.MainButton.show();
    else WebApp.MainButton.hide();

    WebApp.onEvent("mainButtonClicked", sendData);
    return () => WebApp.offEvent("mainButtonClicked", sendData);
  }, [isChanged, sendData]);

  return (
    <div className="create-menu-container">
      <div className="field-wrapper">
        <span className="field-label">Добавить блюдо или редактировать меню:</span>

        <div className="operation-type-switchers">
          <label className="radio-input-label">
            <input type="radio" name="operation" value="create" className="radio-input" checked={operation === 'create'} onChange={(e) => setOperationType(e.target.value)} />
            <span className="radio-input-text">Добавить</span>
          </label>
          <label className="radio-input-label">
            <input type="radio" name="operation" value="edit" className="radio-input" checked={operation === 'edit'} onChange={(e) => setOperationType(e.target.value)} />
            <span className="radio-input-text">Меню</span>
          </label>
        </div>
      </div>

      {editingDish !== null ? (
        <div>
          <button className="back-button" onClick={() => setEditingDish(null)}>« Назад</button>
          <EditDishModal
            dish={editingDish}
            categories={categories}
            setCategories={setCategories}
            onSave={(updatedDish) => {
              setDishes((prev) =>
                prev.map((d) => {
                  const matchById = d._id && editingDish._id && d._id === editingDish._id;
                  const matchByTempId = d.temp_id && editingDish.temp_id && d.temp_id === editingDish.temp_id;

                  return matchById || matchByTempId ? updatedDish : d;
                })
              );
              setEditingDish(null);
            }}
            onCancel={() => setEditingDish(null)}
          />
        </div>
      ) : (
        <>
          {operation === 'create' ? (
            <DishForm dishes={dishes} setDishes={setDishes} categories={categories} setCategories={setCategories} setEditingDish={setEditingDish} />

          ) : (
            <DishList dishes={dishes} onEdit={setEditingDish} />
          )}

          {/* <button onClick={sendData}>btn</button> */}
        </>
      )}
    </div>
  );
};

export default CreateMenu;
