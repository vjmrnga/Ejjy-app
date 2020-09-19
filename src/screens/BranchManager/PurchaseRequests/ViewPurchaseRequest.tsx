/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Divider, Row } from 'antd';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Container, QuantitySelect, Table } from '../../../components';
import { Box, Button, Label } from '../../../components/elements';
import { selectors, types } from '../../../ducks/purchase-requests';
import { quantityTypes, request } from '../../../global/types';
import { usePurchaseRequests } from '../../../hooks/usePurchaseRequests';
import {
	calculateTableHeight,
	formatDateTime,
	getPurchaseRequestProductStatus,
	getPurchaseRequestStatus,
	sleep,
} from '../../../utils/function';
import './style.scss';

interface Props {
	match: any;
}

const ViewPurchaseRequest = ({ match }: Props) => {
	// Routing
	const purchaseRequestId = match?.params?.id;
	const history = useHistory();

	// Custom hooks
	const {
		getPurchaseRequestsById,
		status: purchaseRequestStatus,
		recentRequest: purchaseRequestRecentRequest,
	} = usePurchaseRequests();
	const purchaseRequest = useSelector(selectors.selectPurchaseRequest());

	// States
	const [data, setData] = useState([]);

	useEffect(() => {
		getPurchaseRequestsById(purchaseRequestId);
	}, []);

	useEffect(() => {
		if (
			!purchaseRequest &&
			purchaseRequestRecentRequest === types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH &&
			purchaseRequestStatus === request.ERROR
		) {
			history.replace('/404');
		}
	}, [purchaseRequest, purchaseRequestStatus, purchaseRequestRecentRequest]);

	// Effect: Format requested products to be rendered in Table
	useEffect(() => {
		if (purchaseRequest && purchaseRequestStatus === request.SUCCESS) {
			const formattedRequestedProducts = purchaseRequest?.products.map((requestedProduct) => {
				const { product, status } = requestedProduct;
				const { barcode, name } = product?.product;

				return {
					_quantity_bulk: product?.quantity_bulk,
					_quantity_piece: product?.quantity_piece,
					barcode,
					name,
					quantity: product?.quantity_piece,
					status: getPurchaseRequestProductStatus(status),
				};
			});

			sleep(500).then(() => setData(formattedRequestedProducts));
		}
	}, [purchaseRequest, purchaseRequestStatus]);

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

	const getColums = useCallback(
		() => [
			{ title: 'Barcode', dataIndex: 'barcode' },
			{ title: 'Name', dataIndex: 'name' },
			{
				title: <QuantitySelect onQuantityTypeChange={onQuantityTypeChange} />,
				dataIndex: 'quantity',
			},
			{ title: 'Status', dataIndex: 'status' },
		],
		[onQuantityTypeChange],
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
							<Col span={24}>
								<Label label="Requested Products" />
							</Col>
						</Row>
					</div>

					<Table
						columns={getColums()}
						dataSource={data}
						scroll={{ y: calculateTableHeight(data.length), x: '100%' }}
						loading={purchaseRequestStatus === request.REQUESTING}
						hasCustomHeaderComponent
					/>
				</Box>
			</section>
		</Container>
	);
};

export default ViewPurchaseRequest;
