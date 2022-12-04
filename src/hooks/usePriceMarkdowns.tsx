import { getBaseUrl } from 'hooks/helper';
import { useMutation } from 'react-query';
import { PriceMarkdownsService } from 'services';

export const usePriceMarkdownCreate = () =>
	useMutation<any, any, any>(({ productId, data }: any) =>
		PriceMarkdownsService.create(
			{
				product_id: productId,
				data:
					data?.map((d) => ({
						branch_id: d?.branchId || undefined,
						type: d?.type || undefined,
					})) || undefined,
			},
			getBaseUrl(),
		),
	);
