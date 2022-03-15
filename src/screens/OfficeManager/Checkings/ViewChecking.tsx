import { message, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	Breadcrumb,
	Content,
	DetailsHalf,
	DetailsRow,
	RequestErrors,
} from '../../../components';
import { Box } from '../../../components/elements';
import BadgePill from '../../../components/elements/BadgePill/BadgePill';
import { selectors as branchesSelectors } from '../../../ducks/OfficeManager/branches';
import { EMPTY_CELL } from '../../../global/constants';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import {
	convertIntoArray,
	formatDateTime,
	getUrlPrefix,
} from '../../../utils/function';
import { useProductChecks } from '../../BranchManager/hooks/useProductChecks';

const columns: ColumnsType = [
	{
		title: 'Product',
		children: [
			{
				title: 'Barcode',
				dataIndex: 'barcode',
				key: 'barcode',
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
			},
		],
	},
	{
		title: 'Quantity',
		children: [
			{
				title: 'Current',
				dataIndex: 'current',
				key: 'current',
				align: 'center',
			},
			{
				title: 'Fulfilled',
				dataIndex: 'fulfilled',
				key: 'fulfilled',
				align: 'center',
			},
			{
				title: 'Status',
				dataIndex: 'match_status',
				key: 'match_status',
				align: 'center',
			},
		],
	},
	{ title: 'Adjustment', dataIndex: 'adjustment' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	match: any;
}

export const ViewChecking = ({ match }: Props) => {
	// VARIABLES
	const { id: productCheckId, branchId } = match?.params || {};
	const branch = useSelector(
		branchesSelectors.selectBranchById(Number(branchId)),
	);

	// STATES
	const [productCheck, setProductCheck] = useState(null);
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		getProductCheck,
		status: productChecksStatus,
		errors: productChecksErrors,
	} = useProductChecks();

	// METHODS
	useEffect(() => {
		if (branch && !branch?.online_url) {
			history.replace(`${getUrlPrefix(user.user_type)}/branches`);
			message.error('Branch has no online url.');
		}
	}, [branchId, branch]);

	useEffect(() => {
		getProductCheck(
			{
				id: productCheckId,
				branchId,
			},
			({ status, response }) => {
				if (status === request.SUCCESS) {
					setProductCheck(response);
				}
			},
		);
	}, [branchId, productCheckId]);

	useEffect(() => {
		if (productCheck) {
			setData(
				productCheck.products.map((item) => {
					const {
						id,
						product,
						current_quantity_piece,
						fulfilled_quantity_piece,
						is_match,
					} = item;
					const { barcode, textcode, name } = product;

					return {
						key: id,
						name,
						barcode: barcode || textcode,
						current: current_quantity_piece,
						fulfilled: fulfilled_quantity_piece,
						match_status: is_match ? (
							<BadgePill label="Matched" variant="primary" />
						) : (
							<BadgePill label="Not Matched" variant="error" />
						),
						adjustment: EMPTY_CELL,
						actions: EMPTY_CELL,
					};
				}),
			);
		}
	}, [productCheck]);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Checkings', link: '/office-manager/checkings' },
			{ name: productCheckId },
		],
		[branch, user],
	);

	return (
		<Content
			title="[VIEW] Check"
			rightTitle={branch?.name}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<Box>
				<Spin spinning={productChecksStatus === request.REQUESTING}>
					<RequestErrors
						errors={convertIntoArray(productChecksErrors)}
						withSpaceBottom
					/>

					{productCheck && (
						<DetailsRow className="PaddingHorizontal PaddingVertical">
							<DetailsHalf label="ID" value={productCheck.id} />
							<DetailsHalf label="Type" value={upperFirst(productCheck.type)} />
							<DetailsHalf
								label="Date & Time Requested"
								value={formatDateTime(productCheck.datetime_created)}
							/>
							<DetailsHalf
								label="Date & Time Fulfilled"
								value={
									productCheck.datetime_fulfilled
										? formatDateTime(productCheck.datetime_fulfilled)
										: EMPTY_CELL
								}
							/>
						</DetailsRow>
					)}

					<Table
						columns={columns}
						dataSource={data}
						scroll={{ x: 800 }}
						pagination={false}
						bordered
					/>
				</Spin>
			</Box>
		</Content>
	);
};
