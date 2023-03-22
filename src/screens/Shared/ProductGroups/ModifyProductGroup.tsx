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
	Spin,
	Table,
	Tabs,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	ModifyProductGroupModal,
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
	useProductGroupEdit,
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

export const ModifyProductGroup = ({ match }: Props) => {
	// VARIABLES
	const productGroupId = match?.params?.id;

	// STATES
	const [activeTab, setActiveTab] = useState(tabs.ALL);
	const [count, setCount] = useState(0);
	const [modifyProductGroupModalVisible, setModifyProductGroupModalVisible] =
		useState(false);

	// REFS
	const productsRef = useRef({});

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const history = useHistory();
	const {
		data: productGroup,
		isFetching: isFetchingGroupProduct,
		isFetched: isGroupProductFetched,
		error: productGroupErrors,
	} = useProductGroupRetrieve({
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
	const {
		mutateAsync: editProductGroup,
		isLoading: isEditingProductGroup,
		error: editProductGroupError,
	} = useProductGroupEdit();

	// METHODS: Retrieve product groups
	useEffect(() => {
		if (productGroupId && isGroupProductFetched && productGroup) {
			productsRef.current = {};

			productGroup.items.forEach((item) => {
				const { product } = item;

				productsRef.current[product.id] = {
					selected: true,
					productId: product.id,
					name: product.name,
					isVatExempted: product.is_vat_exempted,
				};
			});

			setCount(productGroup.items.length);
		}
	}, [productGroup, productGroupId, isGroupProductFetched]);

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
									productId: key,
									productName: p.name,
									isVatExempted: p.is_vat_exempted,
								};
						  })
						: Object.keys(productsRef.current).map((key) => {
								const product = productsRef.current[key];

								return {
									selected: true,
									productId: key,
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
		[products, productsRef.current, activeTab],
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
	const handleSubmit = async (formData) => {
		const productIds = Object.keys(productsRef.current);

		if (productIds.length > 0) {
			const items = productIds.map((id) => ({ product_id: id }));

			if (productGroupId && productGroup) {
				await editProductGroup({
					id: productGroup.id,
					name: formData.name,
					items,
				});

				message.success('Product group was edited successfully');
			} else {
				await createProductGroup({
					name: formData.name,
					items,
				});

				message.success('Product group was created successfully');
			}

			history.push('/office-manager/product-groups');
		}
	};

	const isLoading =
		isFetchingProducts || isFetchingGroupProduct || isCreatingProductGroup;

	return (
		<Content title={`[${productGroupId ? 'Edit' : 'Create'}] Product Group`}>
			<Box>
				<Spin spinning={productGroupId && isFetchingGroupProduct}>
					<TableHeader
						searchDisabled={activeTab === tabs.SELECTED}
						title="Product Group"
					/>

					<Filter isLoading={isLoading} />

					<RequestErrors
						className="px-6"
						errors={[
							...convertIntoArray(productsErrors, 'Products'),
							...convertIntoArray(productGroupErrors, 'Product Group'),
							...convertIntoArray(
								createProductGroupError?.errors,
								'Create Product Group',
							),
							...convertIntoArray(
								editProductGroupError?.errors,
								'Edit Product Group',
							),
						]}
						withSpaceBottom
					/>

					<Formik
						initialValues={getFormDetails().DefaultValues}
						validationSchema={getFormDetails().Schema}
						enableReinitialize
						onSubmit={() => {
							setModifyProductGroupModalVisible(true);
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
										Proceed
									</Button>
								</div>
							</Form>
						)}
					</Formik>

					{modifyProductGroupModalVisible && (
						<ModifyProductGroupModal
							isLoading={isCreatingProductGroup || isEditingProductGroup}
							productGroup={productGroup}
							onClose={() => {
								setModifyProductGroupModalVisible(false);
							}}
							onSubmit={(formData) => {
								handleSubmit(formData);
								setModifyProductGroupModalVisible(false);
							}}
						/>
					)}
				</Spin>
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
									({ product_id }) => product_id !== product.productId,
								);

								setFieldValue('products', newValues);
							}

							onChangeCheckbox(product.productId, value, {
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
