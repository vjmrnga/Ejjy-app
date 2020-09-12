/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Col, Divider, Row } from 'antd';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Container, Table } from '../../../components';
import { Box, Button, Label } from '../../../components/elements';
import { selectors } from '../../../ducks/BranchManager/purchase-requests';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { formatDateTime, getPurchaseRequestStatus, sleep } from '../../../utils/function';
import './style.scss';

interface IBranchesProps {
	match: any;
}

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity (Bulk)', dataIndex: 'quantity_bulk' },
	{ title: 'Quantity (Pieces)', dataIndex: 'quantity_piece' },
];

const Branches = ({ match }: IBranchesProps) => {
	const purchaseRequestId = match?.params?.id;
	const { height } = useWindowDimensions();
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
				barcode,
				name,
				quantity_bulk,
				quantity_piece,
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
									<Label label="Type" />
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
						<Label label="Requested Products" />
					</div>

					<Table columns={columns} dataSource={data} scroll={{ y: height * 0.5, x: '100vw' }} />
				</Box>
			</section>
		</Container>
	);
};

export default Branches;
