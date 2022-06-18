import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
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
	useDiscountOptions,
	useDiscountOptionDelete,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { convertIntoArray } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Percentage', dataIndex: 'percentage' },
	{ title: 'VAT Inclusive', dataIndex: 'isVatInclusive' },
	{ title: 'Actions', dataIndex: 'actions' },
];

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
			type: _.upperFirst(discountOption.type),
			percentage: discountOption.percentage || EMPTY_CELL,
			isVatInclusive: discountOption.is_vat_inclusive ? 'Yes' : 'No',
			actions: (
				<TableActions
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
	}, [discountOptions]);

	return (
		<Content title="Discount Options">
			<Box>
				<TableHeader
					buttonName="Create Discount Option"
					onCreate={() => setModifyDiscountOptionModalVisible(true)}
				/>

				<RequestErrors
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
				/>

				<Table
					columns={columns}
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
