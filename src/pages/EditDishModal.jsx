import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../api";

export const EditDishModal = ({ dish, categories, setCategories, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...dish });
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
      category: categoryToUse,
    };

    if (!categories.includes(categoryToUse)) {
      setCategories((prev) => [...prev, categoryToUse]);
    }

    onSave(updatedDish);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      <div
        style={{ background: "white", padding: 20, borderRadius: 8, minWidth: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Редактировать блюдо</h3>
        <div className="field-wrapper">
            <label htmlFor="" className="field-label">Название</label>
            <input
          type="text"
          placeholder=""
          className="text-field"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        </div>


        <div className="field-wrapper">
            <label htmlFor="" className="field-label">Цена</label>
            <input
          type="number"
          placeholder=""
          className="text-field"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
        />
        </div>
        
        <div className="field-wrapper">
            <label htmlFor="" className="field-label">Вес / объем</label>
            <input
          type="text"
          placeholder=""
          className="text-field"
          value={form.weight}
          onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
        />
        </div>

        <select className="select-field" value={isAddingCategory ? "__new__" : form.category} onChange={handleCategorySelect}>
          <option value="">Выбрать категорию</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__new__">Добавить новую категорию</option>
        </select>
        {isAddingCategory && (
          <input
            type="text"
            placeholder="Новая категория"
            className="text-field"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        )}

        <label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
          />
          Активное блюдо
        </label>

        <div {...getRootProps()} style={{ border: "1px dashed gray", padding: 10, cursor: "pointer" }}>
          <input {...getInputProps()} />
          <p>{form.photo ? "Фото загружено" : "Загрузить фото блюда"}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};
