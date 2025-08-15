import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';

import { api } from "../api";

export const DishForm = ({ dishes, setDishes, categories, setCategories, setEditingDish }) => {
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
  }

  return (
    <div>
      <div className="field-wrapper">
        <label htmlFor="name" className="field-label">Название</label>
        <input
          type="text"
          id="name"
          className="text-field"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="group-form">
        <div className="field-wrapper">
          <label htmlFor="price" className="field-label">Цена</label>
          <input
            type="number"
            id="price"
            className="text-field"
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          />
        </div>

        <div className="field-wrapper">
          <label htmlFor="weight" className="field-label">Вес / объем</label>
          <input
            type="text"
            id="weight"
            className="text-field"
            value={form.weight}
            onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
      </div>

      {dishes.length > 0 ? (
        <>
          <div className="field-wrapper select-wrapper">
            <label htmlFor="category" className="field-label">Категория</label>

            <select id="category" className="select-field" value={isAddingCategory ? "__new__" : form.category} onChange={handleCategorySelect}>
              <option value="" disabled>Выбрать категорию</option>
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
              <label htmlFor="new-category" className="field-label">Новая категория</label>
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
          <label htmlFor="first-category" className="field-label">Категория</label>
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
        <label htmlFor="description" className="field-label">Описание</label>

        <textarea id="description" rows="3" className="text-field" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}></textarea>
      </div>

      <div className="field-wrapper">
        <label className="switch">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))} />
          <span className="slider round" />
          <span>Скрыть из меню</span>
        </label>
      </div>

      <div {...getRootProps()} className="dish-form-upload">
        <input {...getInputProps()} />
        <button className="dish-upload-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
          </svg>
          {form.photo ? 'Заменить фотографию' : 'Загрузить изображение'}
        </button>

        {form.photo && (
          <img src={`https://booklink.pro/cf/photo?id=${form.photo}`} alt="dish" />
        )}
      </div>

      <button className="secondary-button" onClick={handleAddDish}>Добавить блюдо</button>

      <div className="new-dishes-container">
        {dishes.filter((d) => !d._id).map((d) => (
          <div key={d.temp_id} className="food-badge">
            <p>{d.name}</p>

            <div className="action-buttons">
              <button onClick={() => setEditingDish(d)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                </svg>
              </button>

              <button onClick={() => deleteDish(d.temp_id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
