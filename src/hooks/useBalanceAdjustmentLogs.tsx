import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { BalanceAdjustmentLogService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const useBalanceAdjustmentLogCreate = () =>
	useMutation<any, any, any>(
		({ branchProductId, creatingUserId, newBalance }: any) =>
			BalanceAdjustmentLogService.create(
				{
					branch_product_id: branchProductId,
					creating_user_id: creatingUserId,
					new_balance: newBalance,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
	);
