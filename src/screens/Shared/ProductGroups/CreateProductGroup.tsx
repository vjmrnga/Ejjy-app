/* eslint-disable react/no-this-in-sfc */
import { SearchOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	Divider,
	Input,
	message,
	Row,
	Select,
	Table,
	Tabs,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	CreateProductGroupModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Box, FormCheckbox, Label } from 'components/elements';
import { Form, Formik } from 'formik';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
	vatTypes,
} from 'global';
import {
	useProductCategories,
	useProductGroupCreate,
	useProductGroupRetrieve,
	useProducts,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { convertIntoArray, filterOption } from 'utils';
import * as Yup from 'yup';

const tabs = {
	ALL: 'ALL',
	SELECTED: 'SELECTED',
};

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type', align: 'center' },
];

interface Props {
	match: any;
}

export const CreateProductGroup = ({ match }: Props) => {
	// VARIABLES
	const productGroupId = match?.params?.id;

	// STATES
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [createProductGroupModalVisible, setCreateProductGroupModalVisible] =
		useState(false);

	// REFS
	const productsRef = useRef({});

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const history = useHistory();
	const { data: productGroup, isFetching: isFetchingGroupProduct } =
		useProductGroupRetrieve({
			id: productGroupId,
			shouldFetchOfflineFirst: true,
			options: {
				enabled: !!productGroupId,
			},
		});
	const {
		data: { products, total },
		isFetching: isFetchingProducts,
		error: productsErrors,
	} = useProducts({ params });
	const {
		mutateAsync: createProductGroup,
		isLoading: isCreatingProductGroup,
		error: createProductGroupError,
	} = useProductGroupCreate();

	// METHODS: Retrieve product groups
	useEffect(() => {
		console.log('productGroup', productGroup);
	}, [productGroup]);

	// METHODS: Form methods
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				products:
					activeTab === tabs.ALL
						? products.map((p) => {
								const key = p.id;

								return {
									selected: key in productsRef.current,
									product_id: key,
									productName: p.name,
									isVatExempted: p.is_vat_exempted,
								};
						  })
						: Object.keys(productsRef.current).map((key) => {
								const product = productsRef.current[key];

								return {
									selected: true,
									product_id: key,
									productName: product.name,
									isVatExempted: product.isVatExempted,
								};
						  }),
			},
			Schema: Yup.object().shape({
				products: Yup.array().of(
					Yup.object().shape({ selected: Yup.boolean() }),
				),
			}),
		}),
		[products, activeTab],
	);

	// METHODS: Change listeners
	const handleChangeCheckbox = (productId, value, data = {}) => {
		if (value) {
			productsRef.current[productId] = data;
		} else {
			delete productsRef.current[productId];
		}

		setCount(Object.keys(productsRef.current).length);
	};

	// METHODS: Filters
	const handleCreate = async (formData) => {
		const productIds = Object.keys(productsRef.current);

		if (productIds.length > 0) {
			await createProductGroup({
				name: formData.name,
				items: productIds.map((id) => ({ product_id: id })),
			});

			message.success('Product group was created successfully');
			history.push('/office-manager/product-groups');
		}
	};

	const isLoading =
		isFetchingProducts || isFetchingGroupProduct || isCreatingProductGroup;

	return (
		<Content title="[Create] Product Group">
			<Box>
				<TableHeader
					searchDisabled={activeTab === tabs.SELECTED}
					title="Product Group"
				/>

				<Filter isLoading={isLoading} />

				<RequestErrors
					className="px-6"
					errors={[
						...convertIntoArray(productsErrors, 'Products'),
						...convertIntoArray(
							createProductGroupError?.errors,
							'Product Group',
						),
					]}
					withSpaceBottom
				/>

				<Formik
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					enableReinitialize
					onSubmit={() => {
						setCreateProductGroupModalVisible(true);
					}}
				>
					{({ values, setFieldValue }) => (
						<Form>
							<div className="px-6">
								<Tabs
									activeKey={activeTab}
									type="card"
									onTabClick={setActiveTab}
								>
									<Tabs.TabPane key={tabs.ALL} tab="All Products" />
									<Tabs.TabPane
										key={tabs.SELECTED}
										tab={`Selected Products (${count})`}
									/>
								</Tabs>

								<ProductsTable
									activeTab={activeTab}
									formProps={{
										values,
										setFieldValue,
										onChangeCheckbox: handleChangeCheckbox,
									}}
									isLoading={isLoading}
									paginationProps={{
										current: Number(params.page) || DEFAULT_PAGE,
										total,
										pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
										onChange: (page, newPageSize) => {
											setQueryParams({
												page,
												pageSize: newPageSize,
											});
										},
										disabled: !isLoading,
										position: ['bottomCenter'],
										pageSizeOptions,
									}}
								/>
							</div>

							<Divider dashed />

							<div className="d-flex justify-end px-6 pb-6">
								<Button
									disabled={isLoading || _.isEmpty(productsRef.current)}
									htmlType="submit"
									type="primary"
								>
									Create
								</Button>
							</div>
						</Form>
					)}
				</Formik>

				{createProductGroupModalVisible && (
					<CreateProductGroupModal
						isLoading={isCreatingProductGroup}
						onClose={() => {
							setCreateProductGroupModalVisible(false);
						}}
						onSubmit={(formData) => {
							handleCreate(formData);
							setCreateProductGroupModalVisible(false);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};

const ProductsTable = ({
	activeTab,
	formProps,
	paginationProps,
	isLoading,
}: any) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// VARIABLES
	const { values, setFieldValue, onChangeCheckbox } = formProps;
	const { currentPage, pageCount, pageSize, onPageChange } = paginationProps;

	useEffect(() => {
		const data = values.products.map((product, index) => {
			const fieldKey = `products.${index}`;
			const { isVatExempted } = product;

			return {
				key: fieldKey,
				name: (
					<FormCheckbox
						id={`${fieldKey}.selected`}
						label={product.productName}
						onChange={(value) => {
							if (!value && activeTab === tabs.SELECTED) {
								const newValues = values.products.filter(
									({ product_id }) => product_id !== product.product_id,
								);

								setFieldValue('products', newValues);
							}

							onChangeCheckbox(product.product_id, value, {
								name: product.productName,
								isVatExempted: product.isVatExempted,
							});
						}}
					/>
				),
				type: isVatExempted ? vatTypes.VAT_EMPTY : vatTypes.VATABLE,
			};
		});

		setDataSource(data);
	}, [values]);

	return (
		<>
			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isLoading}
				pagination={
					activeTab === tabs.ALL
						? {
								current: currentPage,
								total: pageCount,
								pageSize,
								onChange: onPageChange,
								disabled: isLoading,
								position: ['bottomCenter'],
								pageSizeOptions,
						  }
						: false
				}
				scroll={{ x: 800 }}
				bordered
			/>
		</>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// METHODS
	const handleSearchDebounced = useCallback(
		_.debounce((keyword) => {
			setQueryParams(
				{ search: keyword?.toLowerCase() },
				{ shouldResetPage: true },
			);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="pa-6 pt-0" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					defaultValue={params.search}
					disabled={isLoading}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => handleSearchDebounced(event.target.value.trim())}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Product Category" spacing />
				<Select
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					loading={isLoading || isFetchingProductCategories}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ productCategory: value },
							{ shouldResetPage: true },
						);
					}}
				>
					{productCategories.map(({ name }) => (
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
