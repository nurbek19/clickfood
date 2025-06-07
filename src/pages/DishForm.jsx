import { useState, useCallback } from "react";
import { api } from "../api";
import { useDropzone } from "react-dropzone";

export const DishForm = ({ dishes, setDishes, categories, setCategories }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    weight: "",
    category: "",
    active: true,
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
      active: true,
      photo: "",
    });
    setNewCategory("");
    setIsAddingCategory(false);
  };

  return (
    <div>
      <h3>Добавить блюдо</h3>
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
        placeholder="Вес / объем"
        className="text-field"
        value={form.weight}
        onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
      />
        </div>
      
      {dishes.length > 0 ? (
        <>
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
        </>
      ) : (
        <input
          type="text"
          placeholder="Категория"
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

      <button onClick={handleAddDish}>Добавить блюдо</button>
    </div>
  );
};
