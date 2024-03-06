import { Descriptions, Divider } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { formatDateTime, getDeliveryReceiptStatus, getFullName } from 'utils';
import {
	CheckIcon,
	ColoredText,
	ColoredTextVariant,
	ErrorIcon,
	TableNormal,
	ViewButtonIcon,
} from '../../../../../components';
import { Box } from '../../../../../components/elements';
import { ViewProductAdjustmentSlipsModal } from './ViewProductAdjustmentSlipsModal';

const columns = [
	{ name: 'Name', width: '30%' },
	{ name: 'Delivered' },
	{ name: 'Received' },
	{ name: 'Status', width: '20%' },
	{ name: 'Action' },
];

interface Props {
	deliveryReceipt: any;
}

export const DeliveryReceipt = ({ deliveryReceipt }: Props) => {
	const [receivedProducts, setReceivedProducts] = useState([]);
	const [
		selectedDeliveryReceiptProduct,
		setSelectedDeliveryReceiptProduct,
	] = useState(null);
	const [
		viewProductAdjustmentsSlipVisible,
		setViewProductAdjustmentsSlipVisible,
	] = useState(false);

	// Effect: Format received products
	useEffect(() => {
		if (deliveryReceipt) {
			const formattedProducts = deliveryReceipt?.delivery_receipt_products?.map(
				(drProduct) => {
					const {
						id,
						status,
						is_match,
						delivered_quantity_piece,
						received_quantity_piece,
						extra_message,
						order_slip_product,
						is_adjusted,
					} = drProduct;
					const { product } = order_slip_product;

					const action = is_adjusted ? (
						<ViewButtonIcon
							tooltip="View Adjustment Slips"
							onClick={() => {
								handleViewAdjustmentSlips({
									id,
									barcode: product?.barcode,
									name: product?.name,
								});
							}}
						/>
					) : null;

					return [
						<>
							<span>{product.name}</span>
							{getMessage(
								is_match,
								extra_message?.is_under,
								extra_message?.message,
							)}
						</>,
						delivered_quantity_piece,
						received_quantity_piece,
						getDeliveryReceiptStatus(
							`${status}-${is_adjusted}`,
							status,
							is_adjusted,
						),
						action,
					];
				},
			);

			setReceivedProducts(formattedProducts);
		}
	}, [deliveryReceipt]);

	const getReceivedBy = useCallback(
		() =>
			`${getFullName(deliveryReceipt?.receiving_user)} - ${
				deliveryReceipt?.receiving_user?.branch?.name
			}`,
		[deliveryReceipt],
	);

	const getMessage = (isMatch, isUnder, message) => {
		let mainMessage = 'Match';
		let colorVariant: ColoredTextVariant = 'default';
		let extraMessage = '';

		if (!isMatch) {
			mainMessage = isUnder ? 'Under' : 'Over';
			extraMessage = `: ${message}` || '';
			colorVariant = 'error';
		} else {
			colorVariant = 'primary';
		}

		return (
			<div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
				<span style={{ marginRight: '5px' }}>
					{isMatch ? <CheckIcon size="small" /> : <ErrorIcon size="small" />}
				</span>
				<ColoredText
					size="small"
					text={`${mainMessage} ${extraMessage}`}
					variant={colorVariant}
				/>
			</div>
		);
	};

	const handleViewAdjustmentSlips = (deliveryReceiptProduct) => {
		setSelectedDeliveryReceiptProduct(deliveryReceiptProduct);
		setViewProductAdjustmentsSlipVisible(true);
	};

	return (
		<Box>
			<Descriptions className="mx-6 mt-6" column={2} bordered>
				<Descriptions.Item label="Date & Time Received">
					{formatDateTime(deliveryReceipt?.datetime_received)}
				</Descriptions.Item>

				<Descriptions.Item label="F-OS1">{0}</Descriptions.Item>

				<Descriptions.Item label="Received By">
					{getReceivedBy()}
				</Descriptions.Item>

				<Descriptions.Item label="F-DS1">
					{deliveryReceipt?.id}
				</Descriptions.Item>
			</Descriptions>

			<Divider className="mx-6 mb-2">Received Products</Divider>

			<TableNormal columns={columns} data={receivedProducts} displayInPage />

			<ViewProductAdjustmentSlipsModal
				barcode={selectedDeliveryReceiptProduct?.barcode}
				deliveryReceiptProductId={selectedDeliveryReceiptProduct?.id}
				name={selectedDeliveryReceiptProduct?.name}
				visible={viewProductAdjustmentsSlipVisible}
				onClose={() => setViewProductAdjustmentsSlipVisible(false)}
			/>
		</Box>
	);
};
