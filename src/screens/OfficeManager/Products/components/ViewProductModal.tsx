import { Col, Divider, Modal, Row } from 'antd';
import React from 'react';
import { Button, Label } from '../../../../components/elements';

interface Props {
	visible: boolean;
	product: any;
	onClose: any;
}

export const ViewProductModal = ({ product, visible, onClose }: Props) => {
	const renderProductDetails = (label, value) => (
		<Col span={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={8} xs={24}>
					<Label label={label} />
				</Col>
				<Col sm={16} xs={24}>
					<span>{value}</span>
				</Col>
			</Row>
		</Col>
	);

	const renderProductNumbers = (label, value) => (
		<Col sm={12} xs={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={16} xs={24}>
					<Label label={label} />
				</Col>
				<Col sm={8} xs={24}>
					<span>{value}</span>
				</Col>
			</Row>
		</Col>
	);

	return (
		<Modal
			className="ViewProductModal"
			title="View Product"
			visible={visible}
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<Row gutter={[15, 15]}>
				{renderProductDetails('Barcode', product?.barcode)}
				{renderProductDetails('Name', product?.name)}
				{renderProductDetails('Type', product?.type)}
				{renderProductDetails('Unit of Measurement', product?.unit_of_measurement)}
				{renderProductDetails('Print Details', product?.print_details)}
				{renderProductDetails('Description', product?.description)}
				<Divider dashed />
				{renderProductNumbers('Reorder Point', product?.reorder_point)}
				{renderProductNumbers('Max Balance', product?.max_balance)}
				{renderProductNumbers('Pieces in Bulk', product?.pieces_in_bulk)}
				{renderProductNumbers('Allowable Spoilage (%)', product?.allowable_spoilage * 100)}
				{renderProductNumbers('Cost (Piece)', product?.cost_per_piece)}
				{renderProductNumbers('Cost (Bulk)', product?.cost_per_bulk)}
				{renderProductNumbers('Price (Piece)', product?.price_per_piece)}
				{renderProductNumbers('Price (Bulk)', product?.price_per_bulk)}
			</Row>
		</Modal>
	);
};
