import { useMutation } from 'react-query';
import { InvoiceService } from 'services';
import { getLocalApiUrl } from 'utils';

export const useCheckInvoiceValidity = () =>
	useMutation<any, any, any>(({ orNumber }: any) =>
		InvoiceService.checkValidity(
			{
				or_number: orNumber,
			},
			getLocalApiUrl(),
		),
	);

export default useCheckInvoiceValidity;
