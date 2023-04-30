import { useMutation } from 'react-query';
import { BalanceAdjustmentLogService } from 'services';
import { getOnlineApiUrl } from 'utils';

export const useBalanceAdjustmentLogCreate = () =>
	useMutation<any, any, any>(
		({ branchProductId, creatingUserId, newBalance }: any) =>
			BalanceAdjustmentLogService.create(
				{
					branch_product_id: branchProductId,
					creating_user_id: creatingUserId,
					new_balance: newBalance,
				},
				getOnlineApiUrl(),
			),
	);
