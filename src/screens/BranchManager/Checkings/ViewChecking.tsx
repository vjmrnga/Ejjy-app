import { Descriptions, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { Breadcrumb, Content, RequestErrors } from 'components';
import { BadgePill, Box } from 'components/elements';
import { EMPTY_CELL } from 'global';
import { useProductCheckRetrieve } from 'hooks';
import { upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime } from 'utils';

const columns: ColumnsType = [
	{
		title: 'Product',
		children: [
			{
				title: 'Barcode',
				dataIndex: 'barcode',
			},
			{
				title: 'Name',
				dataIndex: 'name',
			},
		],
	},
	{
		title: 'Quantity',
		children: [
			{
				title: 'Current',
				dataIndex: 'current',
				align: 'center',
			},
			{
				title: 'Fulfilled',
				dataIndex: 'fulfilled',
				align: 'center',
			},
			{
				title: 'Status',
				dataIndex: 'status',
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
	const productCheckId = match?.params?.id;

	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: productCheck,
		isFetching: isFetchingProductCheck,
		error: productCheckErrors,
	} = useProductCheckRetrieve({
		id: productCheckId,
		options: {
			enabled: !!productCheckId,
		},
	});

	// METHODS
	useEffect(() => {
		if (productCheck) {
			const formattedProducts = productCheck.products.map((item) => {
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
					status: is_match ? (
						<BadgePill label="Matched" variant="primary" />
					) : (
						<BadgePill label="Not Matched" variant="error" />
					),
					adjustment: EMPTY_CELL,
					actions: EMPTY_CELL,
				};
			});

			setDataSource(formattedProducts);
		}
	}, [productCheck]);

	return (
		<Content
			title="[VIEW] Check"
			breadcrumb={
				<Breadcrumb
					items={[
						{ name: 'Checkings', link: '/branch-manager/checkings' },
						{ name: productCheckId },
					]}
				/>
			}
		>
			<Box>
				<Spin spinning={isFetchingProductCheck}>
					<RequestErrors
						className="px-6"
						errors={convertIntoArray(productCheckErrors)}
						withSpaceBottom
					/>

					{productCheck && (
						<Descriptions bordered className="ma-6" column={2} size="small">
							<Descriptions.Item label="ID">
								{productCheck.id}
							</Descriptions.Item>
							<Descriptions.Item label="Type">
								{upperFirst(productCheck.type)}
							</Descriptions.Item>
							<Descriptions.Item label="Date & Time Requested">
								{formatDateTime(productCheck.datetime_created)}
							</Descriptions.Item>
							<Descriptions.Item label="Date & Time Fulfilled">
								{productCheck.datetime_fulfilled
									? formatDateTime(productCheck.datetime_fulfilled)
									: EMPTY_CELL}
							</Descriptions.Item>
						</Descriptions>
					)}

					<Table
						columns={columns}
						dataSource={dataSource}
						scroll={{ x: 800 }}
						pagination={false}
						bordered
					/>
				</Spin>
			</Box>
		</Content>
	);
};
