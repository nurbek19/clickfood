import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPartner } from '@partner/services/partnerService';
import { isPartnerWorking } from '@shared/utils/workTimeCheck';

export function usePartner({ chatId }) {
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!chatId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPartner(chatId);
      setPartner(data);
    } catch (e) {
      setPartner(null);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const working = useMemo(() => (partner ? isPartnerWorking(partner) : true), [partner]);

  return { partner, isLoading, error, isWorking: working, refresh, setPartner };
}