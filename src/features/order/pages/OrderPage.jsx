import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Order } from "@order/components/Order";
import { Checkout } from "@order/components/Checkout";
import { api } from "@shared/api/api";
import { isPartnerWorking } from "@shared/utils/workTimeCheck";
import { WorkTimeOverlay } from "@order/components/WorkTimeOverlay";
import { Footer } from "@shared/ui/Footer";

export const OrderPage = () => {
  const [searchParams] = useSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState("order");

  const [dishes, setDishes] = useState([]);
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await api.get(
          `/foods?partner_id=${searchParams.get("partner_id")}`
        );
        setDishes(res.data);
        // setDishCategory(res.data?.[0]?.category ?? '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchDishes();
  }, []);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await api.get(
          `/partner?chat_id=${searchParams.get("partner_id")}`
        );
        setPartner(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartner();
  }, []);

  const isWorking = partner ? isPartnerWorking(partner) : true;

  console.log(isWorking);

  return (
    <div className="order-page-wrapper">
      <div className="order-page-container">
        {currentPage === "order" && (
          <Order
            cartItems={cartItems}
            setCartItems={setCartItems}
            dishes={dishes}
            partner={partner}
            onCheckout={() => setCurrentPage("checkout")}
          />
        )}

        {currentPage === "checkout" && (
          <Checkout
            cartItems={cartItems}
            setCartItems={setCartItems}
            partner={partner}
            onBack={() => setCurrentPage("order")}
          />
        )}

        {partner && !isWorking && <WorkTimeOverlay partner={partner} />}
      </div>
      <Footer />
    </div>
  );
};
