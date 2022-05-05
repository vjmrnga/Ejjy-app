import { Descriptions, Tag } from 'antd';
import { accountTypes } from 'global';
import React from 'react';
import { formatDate } from 'utils/function';

interface Props {
	account: any;
}

export const AccountDetails = ({ account }: Props) => {
	const employers = [accountTypes.CORPORATE, accountTypes.GOVERNMENT];

	const getTypeName = (type) => {
		let typeName = '';
		switch (type) {
			case accountTypes.PERSONAL:
				typeName = 'Personal';
				break;
			case accountTypes.CORPORATE:
				typeName = 'Corporate';
				break;
			case accountTypes.EMPLOYEE:
				typeName = 'Employee';
				break;
			case accountTypes.GOVERNMENT:
				typeName = 'Government';
				break;
		}

		return typeName;
	};

	return (
		<Descriptions column={2} bordered>
			<Descriptions.Item label="First Name">
				{account.first_name}
			</Descriptions.Item>
			<Descriptions.Item label="Last Name">
				{account.last_name}
			</Descriptions.Item>
			<Descriptions.Item label="Middle Name">
				{account.middle_name}
			</Descriptions.Item>
			<Descriptions.Item label="Gender">
				{account.gender === 'm' ? 'Male' : 'Female'}
			</Descriptions.Item>

			<Descriptions.Item label="Type">
				{getTypeName(account.type)}
			</Descriptions.Item>

			<Descriptions.Item label="Date of Registration">
				{formatDate(account.datetime_created)}
			</Descriptions.Item>

			<Descriptions.Item label="Birthday">
				{formatDate(account.birthday)}
			</Descriptions.Item>
			<Descriptions.Item label="TIN">{account.tin}</Descriptions.Item>

			{employers.includes(account.type) && (
				<>
					<Descriptions.Item
						label={
							account.type == accountTypes.CORPORATE
								? 'Business Name'
								: 'Agency Name'
						}
					>
						{account.business_name}
					</Descriptions.Item>
					<Descriptions.Item
						label={
							account.type == accountTypes.CORPORATE
								? 'Address (Business)'
								: 'Address (Agency)'
						}
					>
						{account.business_address}
					</Descriptions.Item>
				</>
			)}

			<Descriptions.Item label="Contact Number">
				{account.contact_number}
			</Descriptions.Item>
			<Descriptions.Item span={2} label="Address (Home)">
				{account.home_address}
			</Descriptions.Item>

			<Descriptions.Item label="Loyalty Membership">
				{account.is_point_system_eligible ? (
					<Tag color="green">Yes</Tag>
				) : (
					<Tag color="red">No</Tag>
				)}
			</Descriptions.Item>
		</Descriptions>
	);
};
