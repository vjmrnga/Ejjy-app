import { Modal } from 'antd';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../../components';
import { Button } from '../../../../../components/elements';

interface Props {
	account: any;
	onClose: any;
}

export const ViewClientAccountModal = ({ account, onClose }: Props) => (
	<Modal
		className="ViewClientAccountModal Modal__hasFooter"
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

			<DetailsSingle label="Birthday" value={account.birthday} />

			<DetailsSingle label="Business Name" value={account.business_name} />

			<DetailsSingle label="Address (Home)" value={account.address_home} />

			<DetailsSingle
				label="Address (Business)"
				value={account.address_business}
			/>

			<DetailsSingle label="Contact Number" value={account.contact_number} />

			<DetailsSingle
				label="Date of Registration"
				value={account.date_of_registration}
			/>
		</DetailsRow>
	</Modal>
);
