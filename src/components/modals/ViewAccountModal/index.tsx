import { Modal, Tag } from 'antd';
import React from 'react';
import { formatDate } from 'utils';
import { accountTypes } from '../../../global/types';
import { DetailsRow } from '../../Details/DetailsRow';
import { DetailsSingle } from '../../Details/DetailsSingle';
import { Button } from '../../elements';

const employers = [accountTypes.CORPORATE, accountTypes.GOVERNMENT];

interface Props {
	account: any;
	onClose: any;
}

export const ViewAccountModal = ({ account, onClose }: Props) => {
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
			default:
				typeName = '';
		}

		return typeName;
	};
	return (
		<Modal
			className="Modal__hasFooter"
			footer={[<Button key="button" text="Close" onClick={onClose} />]}
			title="View Account"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<DetailsRow>
				<DetailsSingle label="Type" value={getTypeName(account.type)} />
				<DetailsSingle label="First Name" value={account.first_name} />
				<DetailsSingle label="Middle Name" value={account.middle_name} />
				<DetailsSingle label="Last Name" value={account.last_name} />
				<DetailsSingle
					label="Gender"
					value={account.gender === 'm' ? 'Male' : 'Female'}
				/>
				<DetailsSingle label="Birthday" value={formatDate(account.birthday)} />
				<DetailsSingle label="TIN" value={account.tin} />

				{employers.includes(account.type) && (
					<>
						<DetailsSingle
							label={
								account.type === accountTypes.CORPORATE
									? 'Business Name'
									: 'Agency Name'
							}
							value={account.business_name}
						/>
						<DetailsSingle
							label={
								account.type === accountTypes.CORPORATE
									? 'Address (Business)'
									: 'Address (Agency)'
							}
							value={account.business_address}
						/>
					</>
				)}

				<DetailsSingle label="Address (Home)" value={account.home_address} />
				<DetailsSingle label="Contact Number" value={account.contact_number} />
				<DetailsSingle
					label="Date of Registration"
					value={formatDate(account.datetime_created)}
				/>
				<DetailsSingle
					label="Loyalty Membership"
					value={
						account.is_point_system_eligible ? (
							<Tag color="green">Yes</Tag>
						) : (
							<Tag color="red">No</Tag>
						)
					}
				/>
			</DetailsRow>
		</Modal>
	);
};
