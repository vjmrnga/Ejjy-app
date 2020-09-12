import { Col, Divider, Modal, Row } from 'antd';
import React from 'react';
import { Button, Label } from '../../../../../components/elements';

interface Props {
	visible: boolean;
	branchName: string;
	branchProduct: any;
	onClose: any;
}

export const ViewBranchProductModal = ({ branchProduct, branchName, visible, onClose }: Props) => {
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
			className="ViewBranchProductModal"
			title={`[VIEW] Product Details (${branchName})`}
			visible={visible}
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<Row gutter={[15, 15]}>
				{renderProductDetails('Barcode', branchProduct?.barcode)}
				{renderProductDetails('Name', branchProduct?.name)}
				<Divider dashed />
				{renderProductNumbers('Reorder Point', branchProduct?.reorder_point)}
				{renderProductNumbers('Max Balance', branchProduct?.max_balance)}
				{renderProductNumbers('Price (Piece)', branchProduct?.price_per_piece)}
				{renderProductNumbers('Price (Bulk)', branchProduct?.price_per_bulk)}
				{renderProductNumbers('Allowable Spoilage (%)', branchProduct?.allowable_spoilage * 100)}
				{renderProductNumbers('Current Balance', branchProduct?.current_balance)}
			</Row>
		</Modal>
	);
};
