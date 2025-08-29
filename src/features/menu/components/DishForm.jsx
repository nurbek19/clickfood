import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";

import { api } from "@shared/api/api";
import { Pencil, Trash, Upload } from "lucide-react";

export const DishForm = ({
  dishes,
  setDishes,
  categories,
  setCategories,
  setEditingDish,
}) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    weight: "",
    category: "",
    description: "",
    active: false,
    photo: "",
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await api.post("/photo/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.id) {
        setForm((prev) => ({ ...prev, photo: response.data.id }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop,
  });

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === "__new__") {
      setIsAddingCategory(true);
      setForm((prev) => ({ ...prev, category: "" }));
    } else {
      setIsAddingCategory(false);
      setForm((prev) => ({ ...prev, category: value }));
    }
  };

  const handleAddDish = () => {
    const categoryToUse =
      dishes.length === 0
        ? newCategory.trim()
        : isAddingCategory
        ? newCategory.trim()
        : form.category;

    if (
      !form.name ||
      !form.price ||
      !form.weight ||
      !categoryToUse ||
      !form.photo
    ) {
      alert("Заполните все поля");
      return;
    }

    const newDish = {
      ...form,
      price: parseInt(form.price),
      weight: parseInt(form.weight),
      category: categoryToUse,
      temp_id: uuidv4(),
    };

    setDishes((prev) => [...prev, newDish]);

    if (!categories.includes(categoryToUse)) {
      setCategories((prev) => [...prev, categoryToUse]);
    }

    setForm({
      name: "",
      price: "",
      weight: "",
      category: "",
      description: "",
      active: false,
      photo: "",
    });
    setNewCategory("");
    setIsAddingCategory(false);
  };

  const deleteDish = (id) => {
    setDishes((prev) => prev.filter((d) => d?.temp_id !== id));
  };

  return (
    <div>
      <div className="field-wrapper">
        <label htmlFor="name" className="field-label">
          Название
        </label>
        <input
          type="text"
          id="name"
          className="text-field"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div className="group-form">
        <div className="field-wrapper">
          <label htmlFor="price" className="field-label">
            Цена
          </label>
          <input
            type="number"
            id="price"
            className="text-field"
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, price: e.target.value }))
            }
          />
        </div>

        <div className="field-wrapper">
          <label htmlFor="weight" className="field-label">
            Вес / объем
          </label>
          <input
            type="text"
            id="weight"
            className="text-field"
            value={form.weight}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
      </div>

      {dishes.length > 0 ? (
        <>
          <div className="field-wrapper select-wrapper">
            <label htmlFor="category" className="field-label">
              Категория
            </label>

            <select
              id="category"
              className="select-field"
              value={isAddingCategory ? "__new__" : form.category}
              onChange={handleCategorySelect}
            >
              <option value="" disabled>
                Выбрать категорию
              </option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__new__">Добавить новую категорию</option>
            </select>
          </div>
          {isAddingCategory && (
            <div className="field-wrapper">
              <label htmlFor="new-category" className="field-label">
                Новая категория
              </label>
              <input
                id="new-category"
                type="text"
                className="text-field"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="field-wrapper">
          <label htmlFor="first-category" className="field-label">
            Категория
          </label>
          <input
            id="first"
            type="text"
            className="text-field"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
      )}

      <div className="field-wrapper">
        <label htmlFor="description" className="field-label">
          Описание
        </label>

        <textarea
          id="description"
          rows="3"
          className="text-field"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
        ></textarea>
      </div>

      <div className="field-wrapper">
        <label className="switch">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, active: e.target.checked }))
            }
          />
          <span className="slider round" />
          <span>Скрыть из меню</span>
        </label>
      </div>

      <div {...getRootProps()} className="dish-form-upload">
        <input {...getInputProps()} />
        <button className="dish-upload-button">
          <Upload />
          {form.photo ? "Заменить фотографию" : "Загрузить изображение"}
        </button>

        {form.photo && (
          <img
            src={`https://booklink.pro/cf/photo?id=${form.photo}`}
            alt="dish"
          />
        )}
      </div>

      <button className="secondary-button" onClick={handleAddDish}>
        Добавить блюдо
      </button>

      <div className="new-dishes-container">
        {dishes
          .filter((d) => !d._id)
          .map((d) => (
            <div key={d.temp_id} className="food-badge">
              <p>{d.name}</p>

              <div className="action-buttons">
                <button onClick={() => setEditingDish(d)}>
                  <Pencil />
                </button>

                <button onClick={() => deleteDish(d.temp_id)}>
                  <Trash />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
