import { useEffect, useState, useCallback } from "react";

import WebApp from '@twa-dev/sdk';
import { useDropzone } from 'react-dropzone';
import { api } from "../api";

import '../App.css';

export const CreatePartner = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const [delivery, setDelivery] = useState(true);
    const [selfDrive, setSelfDrive] = useState(true);
    const [preorder, setPreorder] = useState(false);
    const [deliveryCost, setDeliveryCost] = useState(0);

    const [photoId, setPhotoId] = useState('');


    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await api.post("/photo/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data?.id) {
                setPhotoId(response.data.id);
            }

            console.log("Uploaded:", response.data);
        } catch (error) {
            console.error("Upload error:", error);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop,
    });



    return (
        <div>
            
        </div>
    )
}