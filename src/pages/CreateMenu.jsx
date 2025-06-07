import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { DishForm } from "./DishForm";
import { DishList } from "./DishList";
import { EditDishModal } from "./EditDishModal";
import WebApp from "@twa-dev/sdk";

export const CreateMenu = ({ partnerId }) => {
    const [searchParams] = useSearchParams();

  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);

  // Загрузка блюд с сервера
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await api.get(`/foods?partner_id=${searchParams.get('chat_id')}`);
        if (Array.isArray(res.data)) {
          setDishes(res.data);

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
    WebApp.sendData(JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    WebApp.MainButton.setText("Сохранить блюда");
    if (dishes.length > 0) WebApp.MainButton.show();
    else WebApp.MainButton.hide();

    WebApp.onEvent("mainButtonClicked", sendData);
    return () => WebApp.offEvent("mainButtonClicked", sendData);
  }, [dishes, sendData]);

  return (
    <div>
      <DishForm dishes={dishes} setDishes={setDishes} categories={categories} setCategories={setCategories} />
      <DishList dishes={dishes} onEdit={setEditingIndex} />
      {editingIndex !== null && (
        <EditDishModal
          dish={dishes[editingIndex]}
          categories={categories}
          setCategories={setCategories}
          onSave={(updatedDish) => {
            setDishes((prev) =>
              prev.map((d, i) => (i === editingIndex ? updatedDish : d))
            );
            setEditingIndex(null);
          }}
          onCancel={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
};
