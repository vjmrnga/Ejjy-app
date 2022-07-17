import { Spin } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Content } from '../../../components';
import { request } from '../../../global/types';
import { useDeliveryReceipt } from '../hooks/useDeliveryReceipt';
import { AdjustmentSlips } from './components/AdjustmentSlips/AdjustmentSlips';
import { DeliveryReceipt } from './components/DeliveryReceipt/DeliveryReceipt';
import './style.scss';

interface Props {
	match: any;
}

export const ViewDeliveryReceipt = ({ match }: Props) => {
	// Routing
	const deliveryReceiptId = match?.params?.id;
	const history = useHistory();

	const {
		deliveryReceipt,
		getDeliveryReceiptById,
		status: deliveryReceiptStatus,
	} = useDeliveryReceipt();

	// Effect: Fetch delivery receipt of order slip
	useEffect(() => {
		if (deliveryReceiptId) {
			fetchDeliveryReceipt();
		}
	}, [deliveryReceiptId]);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Requisition Slips', link: '/office-manager/requisition-slips' },
			{
				name: `#${deliveryReceipt?.order_slip?.requisition_slip?.id}`,
				link: `/office-manager/requisition-slips/${deliveryReceipt?.order_slip?.requisition_slip?.id}`,
			},
			{ name: `#${deliveryReceipt?.id}` },
		],
		[deliveryReceipt],
	);

	const fetchDeliveryReceipt = () => {
		getDeliveryReceiptById(deliveryReceiptId, ({ status }) => {
			if (status === request.ERROR) {
				history.replace('/404');
			}
		});
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			className="ViewDeliveryReceipt"
			rightTitle={`#${deliveryReceipt?.id}`}
			title="[VIEW] F-DS1"
		>
			<Spin
				size="large"
				spinning={deliveryReceiptStatus === request.REQUESTING}
				tip="Fetching delivery receipt..."
			>
				<DeliveryReceipt deliveryReceipt={deliveryReceipt} />
				<AdjustmentSlips
					deliveryReceipt={deliveryReceipt}
					fetchDeliveryReceipt={fetchDeliveryReceipt}
				/>
			</Spin>
		</Content>
	);
};
