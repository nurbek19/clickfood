import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import WebApp from "@twa-dev/sdk";

export const useTelegramBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const canGoBack = window.history.length > 1;
    const { BackButton } = WebApp;

    const onBack = () => {
      if (canGoBack) navigate(-1);
      else BackButton.hide();
    };

    BackButton.offClick(onBack);

    if (canGoBack) {
      BackButton.onClick(onBack);
      BackButton.show();
    } else {
      BackButton.hide();
    }

    return () => {
      BackButton.offClick(onBack);
      BackButton.hide();
    };
  }, [location, navigate]);
};
