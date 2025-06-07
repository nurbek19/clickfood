import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "../api";

export const CreateMenu = ({ partnerId }) => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    weight: '',
    category: '',
    photo: '',
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddDish = async () => {
    const newDish = {
      ...form,
      price: parseFloat(form.price),
      weight: parseFloat(form.weight),
      partner_id: partnerId,
    };

    try {
      await api.post("/dishes", newDish);
      setDishes([...dishes, newDish]);

      // добавляем категорию в список, если она новая
      if (form.category && !categories.includes(form.category)) {
        setCategories([...categories, form.category]);
      }

      // сброс формы
      setForm({
        name: '',
        price: '',
        weight: '',
        category: '',
        photo: '',
        active: true,
      });
    } catch (err) {
      console.error("Ошибка при добавлении блюда:", err);
    }
  };

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
    } catch (err) {
      console.error("Ошибка загрузки фото:", err);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Добавить блюдо</h2>

      <div className="field-wrapper">
        <label>Название</label>
        <input name="name" value={form.name} onChange={handleChange} className="text-field" />
      </div>

      <div className="field-wrapper">
        <label>Цена</label>
        <input name="price" value={form.price} onChange={handleChange} className="text-field" type="number" />
      </div>

      <div className="field-wrapper">
        <label>Вес (г)</label>
        <input name="weight" value={form.weight} onChange={handleChange} className="text-field" type="number" />
      </div>

      <div className="field-wrapper">
        <label>Категория</label>
        {categories.length > 0 ? (
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Выбрать категорию</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
            <option value="_new">Добавить новую...</option>
          </select>
        ) : (
          <input name="category" value={form.category} onChange={handleChange} className="text-field" />
        )}
        {/* если выбрали "добавить новую" — показываем input */}
        {form.category === "_new" && (
          <input
            placeholder="Введите новую категорию"
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
        )}
      </div>

      <div className="field-wrapper">
        <label>Активно</label>
        <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
      </div>

      <div {...getRootProps()} style={{ border: "1px dashed gray", padding: "10px", marginBottom: "10px" }}>
        <input {...getInputProps()} />
        <p>{form.photo ? "Фото загружено" : "Загрузить фото"}</p>
      </div>

      <button onClick={handleAddDish}>Добавить блюдо</button>

      {dishes.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Добавленные блюда:</h3>
          <ul>
            {dishes.map((dish, i) => (
              <li key={i}>{dish.name} — {dish.category} — {dish.price}₽</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
