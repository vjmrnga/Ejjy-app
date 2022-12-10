import React, { useCallback, useEffect, useState } from 'react';
import { TableHeader } from '../../../../../components';
import { Box } from '../../../../../components/elements';
import {
	deliveryReceiptProductStatus,
	request,
} from '../../../../../global/types';
import { useAdjustmentSlips } from '../../../hooks/useAdjustmentSlips';
import { AdjustmentSlipsTable } from './AdjustmentSlipsTable';
import { CreateAdjustmentSlipModal } from './CreateAdjustmentSlipModal';
import { ViewAdjustmentSlipModal } from './ViewAdjustmentSlipModal';

interface Props {
	deliveryReceipt: any;
	fetchDeliveryReceipt: any;
}

export const AdjustmentSlips = ({
	fetchDeliveryReceipt,
	deliveryReceipt,
}: Props) => {
	// State: Selection
	const [selectedAdjustmentSlip, setSelectedAdjustmentSlip] = useState(null);

	// State: Modal
	const [viewAdjustmentSlipVisible, setViewAdjustmentSlipVisible] =
		useState(false);
	const [createAdjustmentSlipVisible, setCreateAdjustmentSlipVisible] =
		useState(false);

	const {
		adjustmentSlips,
		getAdjustmentSlipsByDeliveryReceiptId,
		status: adjustmentSlipStatus,
	} = useAdjustmentSlips();

	// Effect: Fetch adjustment slips
	useEffect(() => {
		if (deliveryReceipt?.id) {
			getAdjustmentSlipsByDeliveryReceiptId(deliveryReceipt?.id);
		}
	}, [deliveryReceipt]);

	const hasProductUnderInvestigation = useCallback(
		() =>
			deliveryReceipt?.delivery_receipt_products?.some(
				({ status }) => status === deliveryReceiptProductStatus.INVESTIGATION,
			),
		[deliveryReceipt],
	);

	const handleCreateAdjustmentSlip = () => {
		setSelectedAdjustmentSlip(null);
		setCreateAdjustmentSlipVisible(true);
	};

	const handleViewAdjustmentSlip = (orderSlip) => {
		setSelectedAdjustmentSlip(orderSlip);
		setViewAdjustmentSlipVisible(true);
	};

	return (
		<Box>
			<TableHeader
				buttonName="Create Adjustment Slip"
				title="Adjustment Slips"
				onCreate={handleCreateAdjustmentSlip}
				onCreateDisabled={!hasProductUnderInvestigation()}
			/>

			<AdjustmentSlipsTable
				adjustmentSlips={adjustmentSlips}
				loading={adjustmentSlipStatus === request.REQUESTING}
				onViewAdjustmentSlip={handleViewAdjustmentSlip}
			/>

			<ViewAdjustmentSlipModal
				adjustmentSlip={selectedAdjustmentSlip}
				visible={viewAdjustmentSlipVisible}
				onClose={() => setViewAdjustmentSlipVisible(false)}
			/>

			<CreateAdjustmentSlipModal
				deliveryReceipt={deliveryReceipt}
				fetchDeliveryReceipt={fetchDeliveryReceipt}
				visible={createAdjustmentSlipVisible}
				onClose={() => setCreateAdjustmentSlipVisible(false)}
			/>
		</Box>
	);
};
