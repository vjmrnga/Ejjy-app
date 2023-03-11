import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { SiteSettingsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const SITE_SETTINGS_STALE_TIME = 10000;

export const useSiteSettings = ({ params, options }: Query = {}) =>
	useQuery<any>(
		['useSiteSettings', params?.branchId],
		() => {
			const service = isStandAlone()
				? SiteSettingsService.retrieve
				: SiteSettingsService.retrieveOffline;

			return wrapServiceWithCatch(service(getLocalApiUrl()));
		},
		{
			select: (query) => query.data,
			refetchOnMount: 'always',
			staleTime: SITE_SETTINGS_STALE_TIME,
			...options,
		},
	);

export const useSiteSettingsEdit = () =>
	useMutation<any, any, any>(
		({
			addressOfTaxPayer,
			closeDayDeadline,
			closeSessionDeadline,
			contactNumber,
			id,
			isDiscountAllowedIfCredit,
			isManualInputAllowed,
			isMarkdownAllowedIfCredit,
			isTimeCheckerFeatureEnabled,
			logoBase64,
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
					is_manual_input_allowed: isManualInputAllowed,
					is_markdown_allowed_if_credit: isMarkdownAllowedIfCredit,
					is_time_checker_feature_enabled: isTimeCheckerFeatureEnabled,
					logo_base64: logoBase64,
					permit_number: permitNumber,
					pos_accreditation_date: posAccreditationDate,
					pos_accreditation_number: posAccreditationNumber,
					pos_accreditation_valid_until_date: posAccreditationValidUntilDate,
					product_version: productVersion,
					proprietor,
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
					tin,
				},
				getOnlineApiUrl(),
			),
	);
