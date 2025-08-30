import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import httpClient from "@shared/api/httpClient";

export const EditDishModal = ({ dish, categories, setCategories, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...dish });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await httpClient.post("/photo/upload", formData, {
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

  const handleSave = () => {
    const categoryToUse = isAddingCategory ? newCategory.trim() : form.category;

    if (!form.name || !form.price || !form.weight || !categoryToUse || !form.photo) {
      alert("Заполните все поля");
      return;
    }

    const updatedDish = {
      ...form,
      price: parseInt(form.price),
      weight: parseInt(form.weight),
      category: categoryToUse
    };

    if (!categories.includes(categoryToUse)) {
      setCategories((prev) => [...prev, categoryToUse]);
    }

    onSave(updatedDish);
  };

  return (
    <div>
      <div
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Редактировать блюдо</h3>

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

        <div className="edit-buttons">
          <button onClick={handleSave} className="primary-button">Применить изменения</button>
          <button onClick={onCancel} className="secondary-button">Отмена</button>
        </div>
      </div>
    </div>
  );
};
