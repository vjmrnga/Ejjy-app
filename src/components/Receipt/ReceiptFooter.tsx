import { Space, Typography } from 'antd';
import { useSiteSettingsRetrieve } from 'hooks';
import React from 'react';

const { Text } = Typography;

export const ReceiptFooter = () => {
	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve();

	const {
		software_developer: softwareDeveloper,
		software_developer_address: softwareDeveloperAddress,
		software_developer_tin: softwareDeveloperTin,
		pos_accreditation_number: posAccreditationNumber,
		pos_accreditation_valid_until_date: posAccreditationValidUntilDate,
	} = siteSettings;

	return (
		<Space
			align="center"
			className="mt-8 w-100 text-center"
			direction="vertical"
			size={0}
		>
			<Text>{softwareDeveloper}</Text>
			<Text style={{ whiteSpace: 'pre-line' }}>{softwareDeveloperAddress}</Text>
			<Text>{softwareDeveloperTin}</Text>
			<Text>{posAccreditationNumber}</Text>
			<Text>{posAccreditationValidUntilDate}</Text>
		</Space>
	);
};
