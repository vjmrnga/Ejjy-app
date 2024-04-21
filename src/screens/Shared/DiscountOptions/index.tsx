import { DeleteOutlined, EditFilled } from '@ant-design/icons';
import {
	Button,
	List,
	message,
	Popconfirm,
	Space,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import cn from 'classnames';
import {
	ConnectionAlert,
	Content,
	ModifyDiscountOptionModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { ServiceType, useDiscountOptions } from 'ejjy-global';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import {
	useDiscountOptionDelete,
	usePingOnlineServer,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	getId,
	getLocalApiUrl,
	isCUDShown,
	isStandAlone,
} from 'utils';

interface DataType {
	key: React.Key;
	name: string;
	code: string;
	type: string;
	percentage: string;
	isSpecialDiscount: string | React.ReactNode;
	fields?: string;
}

export const DiscountOptions = () => {
	// STATES
	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [selectedDiscountOption, setSelectedDiscountOption] = useState(null);
	const [
		modifyDiscountOptionModalVisible,
		setModifyDiscountOptionModalVisible,
	] = useState(false);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { isConnected } = usePingOnlineServer();
	const user = useUserStore((state) => state.user);
	const {
		data: discountOptionsData,
		isFetching: isFetchingDiscountOptions,
		error: discountOptionsError,
	} = useDiscountOptions({
		params,
		serviceOptions: {
			baseURL: getLocalApiUrl(),
			type: isStandAlone() ? ServiceType.ONLINE : ServiceType.OFFLINE,
		},
	});
	const {
		mutate: deleteDiscountOption,
		isLoading: isDeletingDiscountOption,
		error: deleteDiscountOptionError,
	} = useDiscountOptionDelete();

	// METHODS
	useEffect(() => {
		if (discountOptionsData?.list) {
			const data = discountOptionsData.list.map((discountOption) => ({
				key: discountOption.id,
				name: discountOption.name,
				code: discountOption.code,
				type: _.upperFirst(discountOption.type),
				percentage: discountOption.percentage
					? `${Number(discountOption.percentage)}%`
					: EMPTY_CELL,
				isSpecialDiscount: discountOption.is_special_discount ? (
					<Tag color="green">Yes</Tag>
				) : (
					<Tag color="blue">No</Tag>
				),
				fields: discountOption.additional_fields,
				actions: !discountOption.is_special_discount && (
					<Space>
						{isCUDShown(user.user_type) && (
							<Tooltip title="Edit">
								<Button
									disabled={isConnected === false}
									icon={<EditFilled />}
									type="primary"
									ghost
									onClick={() => {
										setSelectedDiscountOption(discountOption);
										setModifyDiscountOptionModalVisible(true);
									}}
								/>
							</Tooltip>
						)}
						{isCUDShown(user.user_type) && (
							<Popconfirm
								cancelText="No"
								disabled={isConnected === false}
								okText="Yes"
								placement="left"
								title="Are you sure to remove this?"
								onConfirm={() => {
									deleteDiscountOption(getId(discountOption));
									message.success('Discount option was deleted successfully');
								}}
							>
								<Tooltip title="Remove">
									<Button
										icon={<DeleteOutlined />}
										type="primary"
										danger
										ghost
									/>
								</Tooltip>
							</Popconfirm>
						)}
					</Space>
				),
			}));

			setDataSource(data);
		}
	}, [discountOptionsData?.list, isConnected]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType<DataType> = [
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Code', dataIndex: 'code' },
			{ title: 'Type', dataIndex: 'type' },
			{ title: 'Percentage', dataIndex: 'percentage', align: 'center' },
			{
				title: 'Special',
				dataIndex: 'isSpecialDiscount',
				align: 'center',
			},
		];

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	return (
		<Content title="Discount Options">
			<ConnectionAlert />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create Discount Option"
						onCreate={() => setModifyDiscountOptionModalVisible(true)}
						onCreateDisabled={isConnected === false}
					/>
				)}

				<RequestErrors
					className={cn('px-6', {
						'mt-6': !isCUDShown(user.user_type),
					})}
					errors={[
						...convertIntoArray(discountOptionsError),
						...convertIntoArray(deleteDiscountOptionError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					expandable={{
						expandedRowRender: (item) => (
							<List
								dataSource={item.fields.split(',')}
								header={<Typography.Text strong>FIELDS:</Typography.Text>}
								renderItem={(field) => <List.Item>{field}</List.Item>}
								size="small"
								bordered
							/>
						),
						rowExpandable: (item) => !_.isEmpty(item.fields),
					}}
					loading={isFetchingDiscountOptions || isDeletingDiscountOption}
					pagination={{
						current: Number(params.page) || DEFAULT_PAGE,
						total: discountOptionsData?.total,
						pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
						onChange: (page, newPageSize) => {
							setQueryParams({
								page,
								pageSize: newPageSize,
							});
						},
						disabled: !dataSource,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					scroll={{ x: 800 }}
					bordered
				/>

				{modifyDiscountOptionModalVisible && (
					<ModifyDiscountOptionModal
						discountOption={selectedDiscountOption}
						onClose={() => {
							setSelectedDiscountOption(null);
							setModifyDiscountOptionModalVisible(false);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};
