import { Modal } from 'antd';
import { upperFirst } from 'lodash';
import React from 'react';
import { accountTypes } from '../../../global/types';
import { formatDate } from '../../../utils/function';
import { DetailsRow } from '../../Details/DetailsRow';
import { DetailsSingle } from '../../Details/DetailsSingle';
import { Button } from '../../elements';

interface Props {
	account: any;
	onClose: any;
}

export const ViewAccountModal = ({ account, onClose }: Props) => (
	<Modal
		className="Modal__hasFooter"
		title="View Account"
		footer={[<Button text="Close" onClick={onClose} />]}
		onCancel={onClose}
		visible
		centered
		closable
	>
		<DetailsRow>
			<DetailsSingle label="Type" value={upperFirst(account.type)} />
			<DetailsSingle label="First Name" value={account.first_name} />
			<DetailsSingle label="Middle Name" value={account.middle_name} />
			<DetailsSingle label="Last Name" value={account.last_name} />
			<DetailsSingle
				label="Gender"
				value={account.gender === 'm' ? 'Male' : 'Female'}
			/>
			<DetailsSingle label="Birthday" value={formatDate(account.birthday)} />

			{[accountTypes.CORPORATE, accountTypes.GOVERNMENT].includes(
				account.type,
			) && (
				<>
					<DetailsSingle
						label={
							account.type == accountTypes.CORPORATE
								? 'Business Name'
								: 'Agency Name'
						}
						value={account.business_name}
					/>
					<DetailsSingle
						label={
							account.type == accountTypes.CORPORATE
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
		</DetailsRow>
	</Modal>
);