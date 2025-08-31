import { useSearchParams } from "react-router";
import { usePartner } from "@partner/hooks/usePartner";

import { PartnerForm } from "@partner/components/PartnerForm";

const CreatePartner = () => {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get('chat_id');
    const { partner, isLoading } = usePartner({ chatId });

    if (isLoading) return <div className="loading">Загрузка...</div>;

    return (
        <PartnerForm existingPartner={partner ?? null} />
    )
}

export default CreatePartner;