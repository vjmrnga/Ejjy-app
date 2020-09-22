/* eslint-disable react-hooks/exhaustive-deps */
import { lowerCase, upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { selectors as authSelectors } from '../../../ducks/auth';
import { purchaseRequestActionsOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { usePurchaseRequests } from '../../../hooks/usePurchaseRequests';
import {
	calculateTableHeight,
	formatDateTime,
	getPurchaseRequestStatus,
} from '../../../utils/function';
import { CreatePurchaseRequestModal } from './components/CreatePurchaseRequestModal';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'datetime_created' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'action' },
];

const PurchaseRequests = () => {
	const user = useSelector(authSelectors.selectUser());

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [createModalVisible, setCreateModalVisible] = useState(false);

	const { purchaseRequests, getPurchaseRequestsExtended, status } = usePurchaseRequests();

	const {
		branchProducts,
		getBranchProductsByBranch,
		status: branchProductsStatus,
	} = useBranchProducts();

	useEffect(() => {
		getPurchaseRequestsExtended(user?.branch?.id);
		getBranchProductsByBranch(user?.branch?.id);
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

	const onSearch = (keyword) => {
		keyword = lowerCase(keyword);
		const filteredData =
			keyword.length > 0
				? data.filter(
						({ _id, _datetime_created, _type }) =>
							_id.toString() === keyword ||
							_datetime_created.includes(keyword) ||
							_type.includes(keyword),
				  )
				: data;

		setTableData(filteredData);
	};

	const onStatusSelect = (selectedStatus) => {
		const filteredData =
			selectedStatus !== 'all' ? data.filter(({ _status }) => _status === selectedStatus) : data;
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
						scroll={{ y: calculateTableHeight(tableData.length), x: '100%' }}
						loading={status === request.REQUESTING || branchProductsStatus === request.REQUESTING}
					/>

					<CreatePurchaseRequestModal
						branchProducts={branchProducts}
						visible={createModalVisible}
						onClose={() => setCreateModalVisible(false)}
						loading={branchProductsStatus === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default PurchaseRequests;
