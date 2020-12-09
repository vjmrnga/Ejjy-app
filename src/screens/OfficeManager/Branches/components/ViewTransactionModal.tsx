import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { DetailsRow, DetailsSingle, TableNormal } from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';
import { numberWithCommas } from '../../../../utils/function';

interface Props {
	transaction: any;
	visible: boolean;
	onClose: any;
}

const columns = [{ name: 'Item' }, { name: 'Qty' }, { name: 'Rate' }, { name: 'Amount' }];

export const ViewTransactionModal = ({ transaction, visible, onClose }: Props) => {
	const [data, setData] = useState([]);

	// Effect: Format product data
	useEffect(() => {
		const formattedProducts = transaction?.products.map(
			({ product, quantity, price_per_piece }) => [
				product.name,
				quantity.toFixed(3),
				`₱${numberWithCommas(Number(price_per_piece).toFixed(2))}`,
				`₱${numberWithCommas((quantity * Number(price_per_piece)).toFixed(2))}`,
			],
		);

		setData(formattedProducts);
	}, [transaction]);

	return (
		<Modal
			title="View Transaction"
			className="modal-large"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<DetailsRow>
				<DetailsSingle label="Invoice No." value={transaction?.invoice?.or_number || EMPTY_CELL} />
				<DetailsSingle label="Transaction No." value={transaction?.id} />
			</DetailsRow>

			<TableNormal columns={columns} data={data} />
		</Modal>
	);
};
