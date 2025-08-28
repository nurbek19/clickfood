import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import WebApp from "@twa-dev/sdk";
import deepEqual from 'deep-equal';
import { api } from "@shared/api/api";
import { DishForm } from "@menu/components/DishForm";
import { DishList } from "@menu/components/DishList";
import { EditDishModal } from "@menu/components/EditDishModal";

export const CreateMenu = () => {
  const [searchParams] = useSearchParams();

  const [dishes, setDishes] = useState([]);
  const [originalDishes, setOriginalDishes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingDish, setEditingDish] = useState(null);
  const [operation, setOperationType] = useState('create');

  // Загрузка блюд с сервера
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await api.get(`/foods?partner_id=${searchParams.get('chat_id')}`);
        if (Array.isArray(res.data)) {
          setDishes(res.data);
          setOriginalDishes(res.data);

          const cats = Array.from(
            new Set(res.data.map((d) => d.category).filter(Boolean))
          );
          setCategories(cats);
        }
      } catch (err) {
        console.error("Ошибка загрузки блюд", err);
      }
    };
    fetchDishes();
  }, [searchParams]);

  const sendData = useCallback(() => {
    const changedDishes = dishes.filter(dish => {
      const initial = originalDishes.find(d => d._id === dish._id);
      return !initial || !deepEqual(initial, dish);
    });

    console.log('Changed Dishes:', changedDishes);
    WebApp.sendData(JSON.stringify(changedDishes));
  }, [dishes, originalDishes]);

  const isChanged = useMemo(() => {
    const hasChanges = dishes.some((dish) => {
      const initial = originalDishes.find(d => d._id === dish._id);
      return !initial || !deepEqual(initial, dish);
    });

    return hasChanges;
  }, [dishes, originalDishes]);

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
