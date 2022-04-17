import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ONLINE_API_URL, SiteSettingsService } from 'services';
import { getLocalIpAddress } from 'utils/function';

export const useSiteSettingsRetrieve = ({ params, options }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params?.branchId),
	);

	return useQuery<any>(
		['useSiteSettingsRetrieve', params?.branchId],
		() => {
			if (!baseURL && params?.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
			}

			return SiteSettingsService.retrieve(baseURL).catch((e) =>
				Promise.reject(e.errors),
			);
		},
		{
			select: (query) => query.data,
			...options,
		},
	);
};

export const useSiteSettingsEdit = () =>
	useMutation<any, any, any>(
		({
			id,
			closeSessionDeadline,
			closeDayDeadline,
			storeName,
			addressOfTaxPayer,
			proprietor,
			taxType,
			tin,
			permitNumber,
			softwareDeveloper,
			softwareDeveloperTin,
			posAccreditationNumber,
			posAccreditationDate,
			posAccreditationValidUntilDate,
			ptuNumber,
			ptuDate,
			ptuValidUntilDate,
			productVersion,
			thankYouMessage,
			reportingPeriodDayOfMonth,
			resetCounterNotificationThresholdAmount,
			resetCounterNotificationThresholdInvoiceNumber,
		}: any) =>
			SiteSettingsService.edit(
				id,
				{
					close_session_deadline: closeSessionDeadline,
					close_day_deadline: closeDayDeadline,
					store_name: storeName,
					address_of_tax_payer: addressOfTaxPayer,
					proprietor: proprietor,
					tax_type: taxType,
					tin: tin,
					permit_number: permitNumber,
					software_developer: softwareDeveloper,
					software_developer_tin: softwareDeveloperTin,
					pos_accreditation_number: posAccreditationNumber,
					pos_accreditation_date: posAccreditationDate,
					pos_accreditation_valid_until_date: posAccreditationValidUntilDate,
					ptu_number: ptuNumber,
					ptu_date: ptuDate,
					ptu_valid_until_date: ptuValidUntilDate,
					product_version: productVersion,
					thank_you_message: thankYouMessage,
					reporting_period_day_of_month: reportingPeriodDayOfMonth,
					reset_counter_notification_threshold_amount:
						resetCounterNotificationThresholdAmount,
					reset_counter_notification_threshold_invoice_number:
						resetCounterNotificationThresholdInvoiceNumber,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
	);
