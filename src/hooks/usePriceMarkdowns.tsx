import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { ONLINE_API_URL, PriceMarkdownsService } from 'services';
import { getLocalIpAddress } from 'utils/function';

export const usePriceMarkdownsCreate = () =>
	useMutation<any, any, any>(({ branchProductId, type }: any) =>
		PriceMarkdownsService.create(
			{
				branch_product_id: branchProductId,
				type,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		),
	);
