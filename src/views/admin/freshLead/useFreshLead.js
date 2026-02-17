import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import socketService from 'services/socketService';

export const useFreshLead = () => {
	const buyFreshLead = useCallback((userId, leadId) => {
		if (!userId || !leadId) return;
		socketService.buyFreshLead({ userId, leadId });
	}, []);

	return {
		buyFreshLead,
	};
};
