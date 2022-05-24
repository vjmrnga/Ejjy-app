import { Space, Typography } from 'antd';
import { useSiteSettingsRetrieve } from 'hooks';
import React from 'react';

const { Text } = Typography;

interface Props {
	title?: string;
}

export const ReceiptHeader = ({ title }: Props) => {
	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve();

	const {
		contact_number: contactNumber,
		address_of_tax_payer: location,
		proprietor,
		ptu_number: ptuNumber,
		store_name: storeName,
		tax_type: taxType,
		tin,
	} = siteSettings;

	return (
		<Space
			align="center"
			className="w-100 text-center"
			direction="vertical"
			size={0}
		>
			<Text style={{ whiteSpace: 'pre-line' }}>{storeName}</Text>
			<Text style={{ whiteSpace: 'pre-line' }}>{location}</Text>
			<Text>{contactNumber}</Text>
			<Text>{proprietor}</Text>
			<Text>
				{taxType} | {tin}
			</Text>
			<Text>Back Office</Text>
			<Text>{ptuNumber}</Text>
			{title && (
				<>
					<br />
					<Text>[{title}]</Text>
				</>
			)}
		</Space>
	);
};
