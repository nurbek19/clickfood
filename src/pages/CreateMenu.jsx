import { useCallback, useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { api } from "../api";
import { useDropzone } from "react-dropzone";

export const CreateMenu = () => {
    const [form, setForm] = useState({
        name: "",
        price: "",
        weight: "",
        category: "",
        active: true,
        photo: "",
    });

    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

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

        if (!form.name || !form.price || !form.weight || !categoryToUse || !form.photo) {
            alert("Заполните все поля");
            return;
        }

        const newDish = {
            name: form.name,
            price: parseInt(form.price),
            weight: parseInt(form.weight),
            category: categoryToUse,
            active: form.active,
            photo: form.photo,
        };

        setDishes((prev) => [...prev, newDish]);

        if (!categories.includes(categoryToUse)) {
            setCategories((prev) => [...prev, categoryToUse]);
        }

        // Очистить форму
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

    const handleDeleteDish = (index) => {
        setDishes((prev) => prev.filter((_, i) => i !== index));
    };

    const onDrop = useCallback(
        async (acceptedFiles) => {
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
        },
        []
    );

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop,
    });

    const sendData = useCallback(() => {
        WebApp.sendData(JSON.stringify(dishes));
    }, [dishes]);

    useEffect(() => {
        WebApp.MainButton.setText("Сохранить блюда");

        if (dishes.length > 0) {
            WebApp.MainButton.show();
        } else {
            WebApp.MainButton.hide();
        }

        WebApp.onEvent("mainButtonClicked", sendData);
        return () => {
            WebApp.offEvent("mainButtonClicked", sendData);
        };
    }, [dishes]);

    return (
        <div>
            <h3>Добавить блюдо</h3>

            <div className="field-wrapper">
                <label className="field-label">Название</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="text-field"
                />
            </div>

            <div className="field-wrapper">
                <label className="field-label">Цена</label>
                <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="text-field"
                />
            </div>

            <div className="field-wrapper">
                <label className="field-label">Вес / объем (например, 250 г)</label>
                <input
                    type="text"
                    value={form.weight}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, weight: e.target.value }))
                    }
                    className="text-field"
                />
            </div>

            <div className="field-wrapper">
                {dishes.length > 0 ? (
                    <>
                        <select
                            value={isAddingCategory ? "__new__" : form.category}
                            onChange={handleCategorySelect}
                            className="text-field"
                            style={{ width: "100%", marginBottom: isAddingCategory ? "8px" : "0" }}
                        >
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
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="text-field"
                                style={{ width: "100%" }}
                            />
                        )}
                    </>
                ) : (
                    <input
                        type="text"
                        placeholder="Категория"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="text-field"
                        style={{ width: "100%" }}
                    />
                )}
            </div>

            <div className="field-wrapper">
                <label>
                    <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, active: e.target.checked }))
                        }
                    />
                    Активное блюдо
                </label>
            </div>

            <div className="field-wrapper" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Загрузить фото блюда</p>
            </div>

            <button onClick={handleAddDish} className="button">
                Добавить блюдо
            </button>

            <div className="dishes-list">
                <h4>Список блюд</h4>
                {dishes.map((dish, index) => (
                    <div key={index} className="dish-item">
                        <strong>{dish.name}</strong> – {dish.price} сом – {dish.category}
                        <button onClick={() => handleDeleteDish(index)}>Удалить</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
