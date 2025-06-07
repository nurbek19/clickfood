import { useState, useCallback } from "react";

import { useDropzone } from 'react-dropzone'

import '../App.css';

export const CreatePartner = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');


    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("photo", file);
    
        try {
          const response = await axios.post("/photo/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
    
          console.log("Uploaded:", response.data);
          alert("Файл успешно загружен!");
        } catch (error) {
          console.error("Upload error:", error);
          alert("Ошибка загрузки файла.");
        }
      }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop,
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className=""
            >
                <input {...getInputProps()} />
                <p>Загрузить изображение</p>
            </div>


            <div className="field-wrapper">
                <label htmlFor="name" className="field-label">Название</label>

                <input type="text" id="name" className="text-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="field-wrapper">
                <label htmlFor="address" className="field-label">Адрес</label>

                <input type="text" id="address" className="text-field" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="field-wrapper">
                <label htmlFor="phone" className="field-label">Контактный номер телефона</label>

                <input
                    type="tel"
                    pattern="[0-9]*"
                    noValidate
                    id="phone"
                    className="text-field"
                    placeholder="0555 555 555"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10} />
            </div>
        </div>
    )
}