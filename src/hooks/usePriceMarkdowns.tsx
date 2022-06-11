import { IS_APP_LIVE } from 'global';
import { useMutation } from 'react-query';
import { PriceMarkdownsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const usePriceMarkdownsCreate = () =>
	useMutation<any, any, any>(({ branchProductId, type }: any) =>
		PriceMarkdownsService.create(
			{
				branch_product_id: branchProductId,
				type,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		),
	);
