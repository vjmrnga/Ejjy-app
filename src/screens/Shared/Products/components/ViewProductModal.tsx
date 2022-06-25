import { Divider, Modal } from 'antd';
import { upperFirst } from 'lodash';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../components';
import { Button, Label } from '../../../../components/elements';
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

export const ViewProductModal = ({ product, onClose }: Props) => (
	<Modal
		className="ViewProductModal Modal__large Modal__hasFooter"
		title="View Product"
		footer={[<Button text="Close" onClick={onClose} />]}
		onCancel={onClose}
		visible
		centered
		closable
	>
		<DetailsRow>
			<DetailsSingle label="Barcode" value={product.barcode} />
			<DetailsSingle label="Textcode" value={product.textcode} />
			<DetailsSingle label="Name" value={product.name} />
			<DetailsSingle
				label="Product Category"
				value={upperFirst(product.product_category) || 'None'}
			/>
			<DetailsSingle label="Print Details" value={product.print_details} />
			<DetailsSingle label="Description" value={product.description} />

			<Divider dashed>
				<Label label="TAGS" />
			</Divider>
			<DetailsSingle label="TT-001" value={getProductType(product.type)} />
			<DetailsSingle
				label="TT-002"
				value={getUnitOfMeasurement(product.unit_of_measurement)}
			/>
			<DetailsSingle
				label="TT-003"
				value={product.is_vat_exempted ? 'VAT-EXEMPTED' : 'VAT'}
			/>
			<DetailsSingle
				label="Qty Allowance"
				value={product.has_quantity_allowance ? 'Yes' : 'No'}
			/>

			<Divider dashed>
				<Label label="QUANTITY" />
			</Divider>
			<DetailsSingle label="Reorder Point" value={product.reorder_point} />
			<DetailsSingle
				label="Max Balance"
				value={formatQuantity({
					unitOfMeasurement: product.unit_of_measurement,
					quantity: product.max_balance,
				})}
			/>
			<DetailsSingle label="Pieces in Bulk" value={product.pieces_in_bulk} />
			<DetailsSingle
				label="Allowable Spoilage (%)"
				value={product.allowable_spoilage * 100}
			/>

			<Divider dashed>
				<Label label="MONEY" />
			</Divider>
			<DetailsSingle
				label="Cost (Piece)"
				value={formatInPeso(product.cost_per_piece)}
			/>
			<DetailsSingle
				label="Cost (Bulk)"
				value={formatInPeso(product.cost_per_bulk)}
			/>

			{/* TOOD: I think this is temporary */}
			<DetailsSingle
				label="Price (Piece)"
				value={formatInPeso(product.price_per_piece)}
			/>
			<DetailsSingle
				label="Wholesale Price (Piece)"
				value={formatInPeso(product.markdown_price_per_piece1)}
			/>
			<DetailsSingle
				label="Special Price (Piece)"
				value={formatInPeso(product.markdown_price_per_piece2)}
			/>

			<DetailsSingle
				label="Price (Bulk)"
				value={formatInPeso(product.price_per_bulk)}
			/>
			<DetailsSingle
				label="Wholesale Price (Bulk)"
				value={formatInPeso(product.markdown_price_per_bulk1)}
			/>
			<DetailsSingle
				label="Special Price (Bulk)"
				value={formatInPeso(product.markdown_price_per_bulk2)}
			/>
		</DetailsRow>
	</Modal>
);
