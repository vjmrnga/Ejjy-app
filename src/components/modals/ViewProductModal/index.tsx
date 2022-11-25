import { Button, Descriptions, Divider, Modal } from 'antd';
import { useBranchProductRetrieve } from 'hooks';
import { upperFirst } from 'lodash';
import React from 'react';
import {
	formatInPeso,
	formatQuantity,
	getProductType,
	getUnitOfMeasurement,
} from 'utils';

interface Props {
	product: any;
	onClose: any;
}

export const ViewProductModal = ({ product, onClose }: Props) => {
	// CUSTOM HOOKS
	const { data: branchProduct } = useBranchProductRetrieve({
		id: product?.id,
		options: {
			enabled: product !== null,
		},
	});

	return (
		<Modal
			className="ViewProductModal Modal__large Modal__hasFooter"
			footer={<Button onClick={onClose}>Close</Button>}
			title="View Product"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions
				labelStyle={{ width: 200 }}
				className="w-100"
				column={2}
				size="small"
				bordered
			>
				<Descriptions.Item label="Name" span={2}>
					{product.name}
				</Descriptions.Item>
				<Descriptions.Item label="Barcode">{product.barcode}</Descriptions.Item>
				<Descriptions.Item label="Scale Barcode">
					{product.selling_barcode}
				</Descriptions.Item>
				<Descriptions.Item label="Packing Barcode">
					{product.packing_barcode}
				</Descriptions.Item>
				<Descriptions.Item label="Textcode">
					{product.textcode}
				</Descriptions.Item>
				<Descriptions.Item label="Product Category" span={2}>
					{upperFirst(product.product_category) || 'None'}
				</Descriptions.Item>
				<Descriptions.Item label="Print Details (Receipt)" span={2}>
					{product.print_details}
				</Descriptions.Item>
				<Descriptions.Item
					label="Print Details (Price Tag)"
					span={2}
					style={{ whiteSpace: 'pre-line' }}
				>
					{product.price_tag_print_details}
				</Descriptions.Item>
				<Descriptions.Item label="Description" span={2}>
					{product.description}
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation="left">Tags</Divider>

			<Descriptions
				labelStyle={{ width: 200 }}
				className="w-100"
				column={1}
				size="small"
				bordered
			>
				<Descriptions.Item label="TT-001">
					{getProductType(product.type)}
				</Descriptions.Item>
				<Descriptions.Item label="TT-002">
					{getUnitOfMeasurement(product.unit_of_measurement)}
				</Descriptions.Item>
				<Descriptions.Item label="TT-002 (Scale Barcode)">
					{getUnitOfMeasurement(product.selling_barcode_unit_of_measurement)}
				</Descriptions.Item>
				<Descriptions.Item label="TT-002 (Packing Barcode)">
					{getUnitOfMeasurement(product.packing_barcode_unit_of_measurement)}
				</Descriptions.Item>
				<Descriptions.Item label="TT-003">
					{product.is_vat_exempted ? 'VAT-EXEMPTED' : 'VAT'}
				</Descriptions.Item>

				{product.point_system_tag && (
					<Descriptions.Item label="Point System Tag">
						{product.point_system_tag.name}
					</Descriptions.Item>
				)}

				<Descriptions.Item label="Qty Allowance">
					{product.has_quantity_allowance ? 'Yes' : 'No'}
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation="left">Quantity</Divider>

			<Descriptions
				labelStyle={{ width: 200 }}
				className="w-100"
				column={2}
				size="small"
				bordered
			>
				<Descriptions.Item label="Reorder Point">
					{product.reorder_point}
				</Descriptions.Item>
				<Descriptions.Item label="Max Balance">
					{formatQuantity({
						unitOfMeasurement: product.unit_of_measurement,
						quantity: product.max_balance,
					})}
				</Descriptions.Item>
				<Descriptions.Item label="Pieces in Bulk">
					{product.pieces_in_bulk}
				</Descriptions.Item>
				<Descriptions.Item label="Allowable Spoilage (%)">
					{product.allowable_spoilage * 100}
				</Descriptions.Item>
			</Descriptions>

			<Divider orientation="left">Money</Divider>

			<Descriptions
				labelStyle={{ width: 200 }}
				className="w-100"
				column={1}
				size="small"
				bordered
			>
				<Descriptions.Item label="Cost (Piece)">
					{formatInPeso(product.cost_per_piece)}
				</Descriptions.Item>
				<Descriptions.Item label="Cost (Bulk)">
					{formatInPeso(product.cost_per_bulk)}
				</Descriptions.Item>
				<Descriptions.Item label="Price (Piece)">
					{formatInPeso(product.price_per_piece)}
				</Descriptions.Item>
				<Descriptions.Item label="Wholesale Price (Piece)">
					{formatInPeso(branchProduct?.markdown_price_per_piece1)}
				</Descriptions.Item>
				<Descriptions.Item label="Special Price (Piece)">
					{formatInPeso(branchProduct?.markdown_price_per_piece2)}
				</Descriptions.Item>
				<Descriptions.Item label="Price (Bulk)">
					{formatInPeso(product.price_per_bulk)}
				</Descriptions.Item>
				<Descriptions.Item label="Wholesale Price (Bulk)">
					{formatInPeso(branchProduct?.markdown_price_per_bulk1)}
				</Descriptions.Item>
				<Descriptions.Item label="Special Price (Bulk)">
					{formatInPeso(branchProduct?.markdown_price_per_bulk2)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};
