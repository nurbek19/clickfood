import { useState } from "react";
import { useSearchParams } from "react-router";
import { Order, Checkout } from "@order/components";
import { WorkTimeOverlay } from "@order/components/WorkTimeOverlay";
import { Footer } from "@shared/ui";
import { usePartner } from "@partner/hooks/usePartner";
import { useDishes } from "@menu/hooks/useDishes";

const OrderPage = () => {
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState("order");
  const partnerId = searchParams.get("partner_id");
  const { partner, isWorking } = usePartner({ chatId: partnerId });
  const { dishes } = useDishes({ partnerId });

  return (
    <div className="order-page-wrapper">
      <div className="order-page-container">
        {currentPage === "order" && (
          <Order dishes={dishes} partner={partner} onCheckout={() => setCurrentPage("checkout")} />
        )}

        {currentPage === "checkout" && (
          <Checkout partner={partner} onBack={() => setCurrentPage("order")} />
        )}

        {partner && !isWorking && <WorkTimeOverlay partner={partner} />}
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;
