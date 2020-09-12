/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { floor, lowerCase, upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors as authSelectors } from '../../../ducks/auth';
import { types } from '../../../ducks/BranchManager/purchase-requests';
import {
	purchaseRequestActions,
	purchaseRequestTypes,
	quantityTypes,
	request,
} from '../../../global/variables';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { formatDateTime, getPurchaseRequestStatus } from '../../../utils/function';
import { usePurchaseRequests } from '../hooks/usePurchaseRequests';
import { CreatePurchaseRequestModal } from './components/CreatePurchaseRequestModal';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'datetime_created' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'action' },
];

const purchaseRequestActionsOptions = [
	{
		value: 'all',
		name: 'All',
	},
	{
		value: purchaseRequestActions.NEW,
		name: 'New',
	},
	{
		value: purchaseRequestActions.SEEN,
		name: 'Seen',
	},
	{
		value: purchaseRequestActions.F_OS1_CREATED,
		name: 'F-OS1 Created',
	},
	{
		value: purchaseRequestActions.F_OS1_PREPARED,
		name: 'F-OS1 Prepared',
	},
	{
		value: purchaseRequestActions.F_DS1_CREATED,
		name: 'F-DS1 Created',
	},
	{
		value: purchaseRequestActions.F_DS1_DONE,
		name: 'F-DS1 Done',
	},
	{
		value: purchaseRequestActions.F_DS1_ERROR,
		name: 'F-DS1 Error',
	},
];

const PurchaseRequests = () => {
	const { height } = useWindowDimensions();
	const user = useSelector(authSelectors.selectUser());

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [createModalVisible, setCreateModalVisible] = useState(false);

	const {
		purchaseRequests,
		getPurchaseRequestsExtended,
		createPurchaseRequest,
		status,
		errors,
		recentRequest,
	} = usePurchaseRequests(user?.branch_id);

	const { branchProducts, getBranchProductsByBranch } = useBranchProducts();

	useEffect(() => {
		getPurchaseRequestsExtended();
		getBranchProductsByBranch(user?.branch_id);
	}, []);

	// Effect: Format purchaseRequests to be rendered in Table
	useEffect(() => {
		const formattedProducts = purchaseRequests.map((purchaseRequest) => {
			const { id, type, action: prAction } = purchaseRequest;
			const { datetime_created, action } = prAction;
			const dateTime = formatDateTime(datetime_created);

			return {
				_id: id,
				_datetime_created: dateTime,
				_type: type,
				_status: action,
				id: <Link to={`/purchase-requests/${id}`}>{id}</Link>,
				datetime_created: dateTime,
				type: upperFirst(type),
				status: getPurchaseRequestStatus(action),
				// actions: <TableActions onEdit={() => onEdit(product)} onRemove={() => removeProduct(id)} />,
			};
		});

		setData(formattedProducts);
		setTableData(formattedProducts);
	}, [purchaseRequests]);

	// Effect: Reload the list if recent requests are Create, Edit or Remove
	useEffect(() => {
		if (status === request.SUCCESS && recentRequest === types.CREATE_PURCHASE_REQUEST) {
			setCreateModalVisible(false);
		}
	}, [status, recentRequest]);

	const onCreate = (values) => {
		const products = values.branchProducts
			.filter(({ selected }) => selected)
			.map(({ product_id, pieces_in_bulk, quantity, quantity_type }) => ({
				product_id,
				quantity_piece:
					quantity_type === quantityTypes.PIECE ? quantity : floor(quantity / pieces_in_bulk),
				quantity_bulk: quantity_type === quantityTypes.BULK ? quantity : quantity * pieces_in_bulk,
			}));

		createPurchaseRequest({
			requestor_id: user?.branch_id,
			type: purchaseRequestTypes.MANUAL,
			products,
		});
	};

	const onSearch = (keyword) => {
		const lcKeyword = lowerCase(keyword);
		const filteredData =
			keyword.length > 0
				? data.filter(
						({ _id, _datetime_created, _type }) =>
							_id == keyword || _datetime_created.includes(lcKeyword) || _type.includes(lcKeyword),
				  )
				: data;

		setTableData(filteredData);
	};

	const onStatusSelect = (status) => {
		const filteredData = status !== 'all' ? data.filter(({ _status }) => _status === status) : data;
		setTableData(filteredData);
	};

	return (
		<Container title="Purchase Requests">
			<section className="PurchaseRequests">
				<Box>
					<TableHeader
						buttonName="Create Purchase Request"
						statuses={purchaseRequestActionsOptions}
						onStatusSelect={onStatusSelect}
						onSearch={onSearch}
						onCreate={() => setCreateModalVisible(true)}
					/>

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: height * 0.6, x: '100vw' }}
					/>

					<CreatePurchaseRequestModal
						branchProducts={branchProducts}
						visible={createModalVisible}
						onSubmit={onCreate}
						onClose={() => setCreateModalVisible(false)}
						errors={errors}
						loading={status === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default PurchaseRequests;
