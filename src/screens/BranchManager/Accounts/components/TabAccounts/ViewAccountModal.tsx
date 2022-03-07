import { Modal } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../../components';
import { Button } from '../../../../../components/elements';
import { formatDate } from '../../../../../utils/function';

interface Props {
	account: any;
	onClose: any;
}

export const ViewAccountModal = ({ account, onClose }: Props) => (
	<Modal
		className="Modal__hasFooter"
		title="View Product"
		footer={[<Button text="Close" onClick={onClose} />]}
		onCancel={onClose}
		visible
		centered
		closable
	>
		<DetailsRow>
			<DetailsSingle label="First Name" value={account.first_name} />

			<DetailsSingle label="Middle Name" value={account.middle_name} />

			<DetailsSingle label="Last Name" value={account.last_name} />

			<DetailsSingle
				label="Gender"
				value={account.gender === 'm' ? 'Male' : 'Female'}
			/>

			<DetailsSingle label="Birthday" value={formatDate(account.birthday)} />

			<DetailsSingle label="Business Name" value={account.business_name} />

			<DetailsSingle label="Address (Home)" value={account.home_address} />

			<DetailsSingle
				label="Address (Business)"
				value={account.business_address}
			/>

			<DetailsSingle label="Contact Number" value={account.contact_number} />

			<DetailsSingle
				label="Date of Registration"
				value={formatDate(account.datetime_created)}
			/>
		</DetailsRow>
	</Modal>
);
