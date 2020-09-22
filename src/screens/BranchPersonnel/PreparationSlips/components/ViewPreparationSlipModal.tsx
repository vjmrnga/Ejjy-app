import { Col, Divider, Modal, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { QuantitySelect, TableNormal } from '../../../../components';
import { Button, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
import { PreparationSlipDetails } from './PreparationSlipDetails';

interface Props {
	visible: boolean;
	preparationSlip: any;
	onClose: any;
}

export const ViewPreparationSlipModal = ({ preparationSlip, visible, onClose }: Props) => {
	const [requestedProducts, setRequestedProducts] = useState([]);
	const [requestedProductsQuantity, setRequestedProductsQuantity] = useState([]);

	useEffect(() => {
		if (preparationSlip) {
			const formattedQuantities = [];
			const formattedPreparationSlip = [];

			preparationSlip?.products?.forEach((requestedProduct) => {
				const { product } = requestedProduct;
				const { barcode, name } = product;

				const quantity = {
					barcode: 'asdf',
					piecesInputted: 0,
					piecesOrdered: 0,
					bulkInputted: 0,
					bulkOrdered: 0,
				};

				formattedPreparationSlip.push([
					barcode,
					name,
					`${quantity?.piecesInputted} / ${quantity?.piecesOrdered}`,
				]);
				formattedQuantities.push(quantity);

				return;
			});

			setRequestedProducts(formattedPreparationSlip);
			setRequestedProductsQuantity(formattedQuantities);
		}
	}, [preparationSlip]);

	const onQuantityTypeChange = useCallback(
		(quantityType) => {
			const QUANTITY_INDEX = 2;
			const formattedRequestedProducts = requestedProducts.map((requestedProduct, index) => {
				const quantity = requestedProductsQuantity[index];
				const inputted =
					quantityType === quantityTypes.PIECE ? quantity.piecesInputted : quantity.bulkInputted;
				const ordered =
					quantityType === quantityTypes.PIECE ? quantity.piecesOrdered : quantity.bulkOrdered;

				requestedProduct[QUANTITY_INDEX] = `${inputted} / ${ordered}`;
				return requestedProduct;
			});
			setRequestedProducts(formattedRequestedProducts);
		},
		[requestedProducts, requestedProductsQuantity],
	);

	const getColumns = useCallback(
		() => [
			{ name: 'Barcode' },
			{ name: 'Name' },
			{ name: <QuantitySelect onQuantityTypeChange={onQuantityTypeChange} /> },
		],
		[onQuantityTypeChange],
	);

	return (
		<Modal
			className="ViewPreparationSlipModal"
			title="View Preparation Slip"
			visible={visible}
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<PreparationSlipDetails preparationSlip={preparationSlip} />

			<div className="requested-products">
				<Divider dashed />
				<Row gutter={[15, 15]} align="middle">
					<Col span={24}>
						<Label label="Requested Products" />
					</Col>
				</Row>
			</div>

			<TableNormal columns={getColumns()} data={requestedProducts} />
		</Modal>
	);
};
