import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

import { PartnerForm } from "./PartnerForm"

export const CreatePartner = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [existingPartner, setExistingPartner] = useState(null);


    useEffect(() => {
        const loadPartner = async () => {
            try {
                const res = await api.get(`/partner?chat_id=${searchParams.get('chat_id')}`);
                setExistingPartner(res.data);
            } catch (error) {
                const status = error.response?.status;

                if (status === 404 || status === 500) {
                    // Нет партнёра или ошибка — переходим в режим создания
                    setExistingPartner(null);
                } else {
                    console.error("Неизвестная ошибка при загрузке партнёра", error);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPartner();
    }, []);

    if (loading) return <p>Загрузка...</p>;

    return (
        <PartnerForm existingPartner={existingPartner} />
    )
}