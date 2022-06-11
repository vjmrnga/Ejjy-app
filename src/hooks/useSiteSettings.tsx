import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { SiteSettingsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const useSiteSettingsRetrieve = ({ params, options }: Query = {}) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params?.branchId),
	);

	return useQuery<any>(
		['useSiteSettingsRetrieve', params?.branchId],
		() => {
			if (!baseURL && params?.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
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
			addressOfTaxPayer,
			closeDayDeadline,
			closeSessionDeadline,
			contactNumber,
			id,
			isDiscountAllowedIfCredit,
			isMarkdownAllowedIfCredit,
			isTimeCheckerFeatureEnabled,
			permitNumber,
			posAccreditationDate,
			posAccreditationNumber,
			posAccreditationValidUntilDate,
			productVersion,
			proprietor,
			ptuDate,
			ptuNumber,
			ptuValidUntilDate,
			reportingPeriodDayOfMonth,
			resetCounterNotificationThresholdAmount,
			resetCounterNotificationThresholdInvoiceNumber,
			softwareDeveloper,
			softwareDeveloperAddress,
			softwareDeveloperTin,
			storeName,
			taxType,
			thankYouMessage,
			tin,
		}: any) =>
			SiteSettingsService.edit(
				id,
				{
					address_of_tax_payer: addressOfTaxPayer,
					close_day_deadline: closeDayDeadline,
					close_session_deadline: closeSessionDeadline,
					contact_number: contactNumber,
					is_discount_allowed_if_credit: isDiscountAllowedIfCredit,
					is_markdown_allowed_if_credit: isMarkdownAllowedIfCredit,
					is_time_checker_feature_enabled: isTimeCheckerFeatureEnabled,
					permit_number: permitNumber,
					pos_accreditation_date: posAccreditationDate,
					pos_accreditation_number: posAccreditationNumber,
					pos_accreditation_valid_until_date: posAccreditationValidUntilDate,
					product_version: productVersion,
					proprietor: proprietor,
					ptu_date: ptuDate,
					ptu_number: ptuNumber,
					ptu_valid_until_date: ptuValidUntilDate,
					reporting_period_day_of_month: reportingPeriodDayOfMonth,
					reset_counter_notification_threshold_amount:
						resetCounterNotificationThresholdAmount,
					reset_counter_notification_threshold_invoice_number:
						resetCounterNotificationThresholdInvoiceNumber,
					software_developer_address: softwareDeveloperAddress,
					software_developer_tin: softwareDeveloperTin,
					software_developer: softwareDeveloper,
					store_name: storeName,
					tax_type: taxType,
					thank_you_message: thankYouMessage,
					tin: tin,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
	);
