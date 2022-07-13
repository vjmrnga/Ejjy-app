import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	ConnectionAlert,
	Content,
	ModifyDiscountOptionModal,
	RequestErrors,
	TableActions,
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
	useAuth,
	useDiscountOptionDelete,
	useDiscountOptions,
	usePingOnlineServer,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray, isCUDShown } from 'utils';

export const DiscountOptions = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedDiscountOption, setSelectedDiscountOption] = useState(null);
	const [
		modifyDiscountOptionModalVisible,
		setModifyDiscountOptionModalVisible,
	] = useState(false);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { isConnected } = usePingOnlineServer();
	const { user } = useAuth();
	const {
		data: { discountOptions, total },
		isFetching,
		error: listError,
	} = useDiscountOptions({ params });
	const {
		mutate: deleteDiscountOption,
		isLoading,
		error: deleteError,
	} = useDiscountOptionDelete();

	// METHODS
	useEffect(() => {
		const formattedDiscountOptions = discountOptions.map((discountOption) => ({
			key: discountOption.id,
			name: discountOption.name,
			code: discountOption.code,
			type: _.upperFirst(discountOption.type),
			percentage: discountOption.percentage || EMPTY_CELL,
			isVatInclusive: discountOption.is_vat_inclusive ? 'Yes' : 'No',
			fields: discountOption.additional_fields,
			actions: (
				<TableActions
					areButtonsDisabled={isConnected === false}
					onEdit={() => {
						setSelectedDiscountOption(discountOption);
						setModifyDiscountOptionModalVisible(true);
					}}
					onRemove={() => {
						message.success('Discount option was deleted successfully');
						deleteDiscountOption(discountOption.id);
					}}
				/>
			),
		}));

		setDataSource(formattedDiscountOptions);
	}, [discountOptions, isConnected]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Code', dataIndex: 'code' },
			{ title: 'Type', dataIndex: 'type' },
			{ title: 'Percentage', dataIndex: 'percentage' },
			{ title: 'VAT Inclusive', dataIndex: 'isVatInclusive' },
			{ title: 'Fields', dataIndex: 'fields' },
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
						onCreateDisabled={isConnected === false}
						onCreate={() => setModifyDiscountOptionModalVisible(true)}
					/>
				)}

				<RequestErrors
					className="px-4"
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					loading={isFetching || isLoading}
					bordered
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