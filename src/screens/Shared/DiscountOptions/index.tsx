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
	DiscountOptionsInfo,
	ModifyDiscountOptionModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
} from 'global';
import {
	useDiscountOptionDelete,
	useDiscountOptions,
	usePingOnlineServer,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray, getId, isCUDShown } from 'utils';

interface DataType {
	key: React.Key;
	name: string;
	code: string;
	type: string;
	percentage: string;
	isSpecialDiscount: string | React.ReactNode;
	isVatInclusive: string | React.ReactNode;
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
		data: { discountOptions, total },
		isFetching: isFetchingDiscountOptions,
		error: discountOptionsError,
	} = useDiscountOptions({ params });
	const {
		mutate: deleteDiscountOption,
		isLoading: isDeletingDiscountOption,
		error: deleteDiscountOptionError,
	} = useDiscountOptionDelete();

	// METHODS
	useEffect(() => {
		const data = discountOptions.map((discountOption) => ({
			key: discountOption.id,
			name: discountOption.name,
			code: discountOption.code,
			type: _.upperFirst(discountOption.type),
			percentage: discountOption.percentage || EMPTY_CELL,
			isSpecialDiscount: discountOption.is_special_discount ? (
				<Tag color="green">Yes</Tag>
			) : (
				<Tag color="blue">No</Tag>
			),
			isVatInclusive: discountOption.is_vat_inclusive ? (
				<Tag color="green">Yes</Tag>
			) : (
				<Tag color="blue">No</Tag>
			),
			fields: discountOption.additional_fields,
			actions: (
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
								<Button icon={<DeleteOutlined />} type="primary" danger ghost />
							</Tooltip>
						</Popconfirm>
					)}
				</Space>
			),
		}));

		setDataSource(data);
	}, [discountOptions, isConnected]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType<DataType> = [
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Code', dataIndex: 'code' },
			{ title: 'Type', dataIndex: 'type' },
			{ title: 'Percentage', dataIndex: 'percentage' },
			{
				title: 'Special Discount',
				dataIndex: 'isSpecialDiscount',
				align: 'center',
			},
			{ title: 'VAT Inclusive', dataIndex: 'isVatInclusive', align: 'center' },
		];

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	return (
		<Content title="Discount Options">
			<ConnectionAlert />

			<DiscountOptionsInfo />

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
								header={<Typography.Title level={5}>FIELDS:</Typography.Title>}
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
						total,
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
