/* eslint-disable react-hooks/exhaustive-deps */
import { lowerCase, upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { purchaseRequestActionsOptions, request } from '../../../global/variables';
import { usePurchaseRequests } from '../../../hooks/usePurchaseRequests';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { formatDateTime, getPurchaseRequestStatus } from '../../../utils/function';

import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'datetime_created' },
	{ title: 'Requestor', dataIndex: 'requestor' },
	{ title: 'Request Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'action' },
];

const PurchaseRequests = () => {
	const { height } = useWindowDimensions();

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const { purchaseRequests, getPurchaseRequestsExtended, status } = usePurchaseRequests();

	useEffect(() => {
		getPurchaseRequestsExtended();
	}, []);

	// Effect: Format purchaseRequests to be rendered in Table
	useEffect(() => {
		const formattedProducts = purchaseRequests.map((purchaseRequest) => {
			const { id, type, requestor_id, action: prAction } = purchaseRequest;
			const { datetime_created, action } = prAction;
			const dateTime = formatDateTime(datetime_created);

			return {
				_id: id,
				_datetime_created: dateTime,
				_type: type,
				_status: action,
				id: <Link to={`/purchase-requests/${id}`}>{id}</Link>,
				datetime_created: dateTime,
				requestor: requestor_id,
				type: upperFirst(type),
				action: getPurchaseRequestStatus(action),
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

	const onStatusSelect = (status) => {
		const filteredData = status !== 'all' ? data.filter(({ _status }) => _status === status) : data;
		setTableData(filteredData);
	};

	return (
		<Container title="F-RS1" description="Requests from branches">
			<section className="PurchaseRequests">
				<Box>
					<TableHeader
						buttonName="Create Purchase Request"
						statuses={purchaseRequestActionsOptions}
						onStatusSelect={onStatusSelect}
						onSearch={onSearch}
					/>

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: height * 0.6, x: '100vw' }}
						loading={status === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default PurchaseRequests;
