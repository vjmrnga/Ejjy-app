/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Divider, Row } from 'antd';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Container, Table } from '../../../components';
import { Box, Button, Label, Select } from '../../../components/elements';
import { selectors } from '../../../ducks/purchase-requests';
import { quantityTypeOptions, quantityTypes } from '../../../global/variables';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import {
	calculateTableHeight,
	formatDateTime,
	getPurchaseRequestStatus,
	sleep,
} from '../../../utils/function';
import './style.scss';

interface Props {
	match: any;
}

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity' },
];

const ViewPurchaseRequest = ({ match }: Props) => {
	const purchaseRequestId = match?.params?.id;
	const { branchProducts } = useBranchProducts();
	const purchaseRequest = useSelector(
		selectors.selectPurchaseRequestById(Number(purchaseRequestId)),
	);

	const [data, setData] = useState([]);

	// Effect: Format requested products to be rendered in Table
	useEffect(() => {
		const formattedRequestedProducts = purchaseRequest?.products.map((requestedProduct) => {
			const { product_id, quantity_bulk, quantity_piece } = requestedProduct;
			const branchProduct = branchProducts.find((product) => product?.product_id === product_id);
			const { barcode = '', name = '' } = branchProduct?.product;

			return {
				_quantity_bulk: quantity_bulk,
				_quantity_piece: quantity_piece,
				barcode,
				name,
				quantity: quantity_piece,
			};
		});

		sleep(500).then(() => setData(formattedRequestedProducts));
	}, [purchaseRequest]);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Purchase Requests', link: '/purchase-requests' },
			{ name: `#${purchaseRequest?.id}` },
		],
		[purchaseRequest],
	);

	const onQuantityTypeChange = (quantityType) => {
		const requestProducts = data.map((requestProduct) => ({
			...requestProduct,
			quantity:
				quantityType === quantityTypes.PIECE
					? requestProduct._quantity_piece
					: requestProduct._quantity_bulk,
		}));
		setData(requestProducts);
	};

	return (
		<Container
			title="[VIEW] F-RS01"
			rightTitle={`#${purchaseRequest?.id}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<section className="ViewPurchaseRequest">
				<Box>
					<Row className="details">
						<Col span={24} lg={12}>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Date &amp; Time Created" />
								</Col>
								<Col span={12}>
									<span>{formatDateTime(purchaseRequest?.datetime_created)}</span>
								</Col>
							</Row>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Request Type" />
								</Col>
								<Col span={12}>
									<span>{upperFirst(purchaseRequest?.type)}</span>
								</Col>
							</Row>
							<Row gutter={[15, 15]}>
								<Col span={12}>
									<Label label="Status" />
								</Col>
								<Col span={12}>{getPurchaseRequestStatus(purchaseRequest?.action?.action)}</Col>
							</Row>
						</Col>

						<Col span={24} lg={12} style={{ textAlign: 'right' }}>
							<Button text="Print Purchase Request" variant="primary" />
						</Col>
					</Row>

					<div className="requested-products">
						<Divider dashed />
						<Row gutter={[15, 15]} align="middle">
							<Col span={24} lg={12}>
								<Label label="Requested Products" />
							</Col>
							<Col span={24} lg={12}>
								<Select
									classNames="status-select"
									options={quantityTypeOptions}
									placeholder="quantity"
									defaultValue={quantityTypes.PIECE}
									onChange={(event) => onQuantityTypeChange(event.target.value)}
								/>
							</Col>
						</Row>
					</div>

					<Table
						columns={columns}
						dataSource={data}
						scroll={{ y: calculateTableHeight(data.length), x: '100vw' }}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default ViewPurchaseRequest;
