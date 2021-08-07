/* eslint-disable no-mixed-spaces-and-tabs */
import { Divider, Pagination, Radio, Space } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { cloneDeep, debounce, isEmpty, toString } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import {
	Content,
	RequestErrors,
	TableHeader,
	TableNormal,
} from '../../../components';
import {
	Box,
	Button,
	FieldError,
	FieldInfo,
	FormCheckbox,
	FormInput,
	FormSelect,
	Label,
} from '../../../components/elements';
import {
	branchProductStatusOptionsWithAll,
	pageSizeOptions,
	quantityTypeOptions,
} from '../../../global/options';
import {
	branchProductStatus,
	quantityTypes,
	request,
	requisitionSlipTypes,
} from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useRequisitionSlips } from '../../../hooks/useRequisitionSlips';
import {
	convertIntoArray,
	convertToPieces,
	getBranchProductStatus,
	sleep,
} from '../../../utils/function';

const columns = [
	{ name: 'Name' },
	{ name: 'Quantity', width: '200px' },
	{ name: 'Status' },
];

export const CreateRequisitionSlip = () => {
	// STATES
	const [searchedKeyword, setSeachedKeyword] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [selectedProducts, setSelectedProducts] = useState({});
	const [isSubmitting, setSubmitting] = useState(false);
	const [onlySelectedVisible, setOnlySelectedVisible] = useState(false);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProducts,
		status: branchProductsStatus,
		errors: branchProductsErrors,
	} = useBranchProducts();
	const {
		createRequisitionSlip,
		status: requisitionSlipsStatus,
		errors: requisitionSlipsErrors,
	} = useRequisitionSlips();

	// VARIABLES
	const branchId = user?.branch?.id;

	// METHODS
	useEffect(() => {
		getBranchProducts({ branchId, page: 1 });
	}, []);

	useEffect(() => {
		// Get existing keys
		const productKeys = Object.keys(selectedProducts);

		// Get new keys
		const newProducts = {};
		branchProducts
			.filter(
				({ product_status, product }) =>
					product_status !== branchProductStatus.AVAILABLE &&
					!productKeys.includes(toString(product.id)),
			)
			.forEach(({ product, product_status }) => {
				newProducts[product.id] = {
					productName: product?.name,
					status: product_status,
					piecesInBulk: product.pieces_in_bulk,
					quantityType: quantityTypes.PIECE,
				};
			});

		setSelectedProducts((prevProducts) => ({
			...prevProducts,
			...newProducts,
		}));
	}, [branchProducts]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchProducts: onlySelectedVisible
					? Object.keys(selectedProducts).map((key) => ({
							selected: true,
							quantity: selectedProducts[key]?.quantity || '',
							quantity_type:
								selectedProducts[key]?.quantityType || quantityTypes.PIECE,
							product_id: key,
							pieces_in_bulk: selectedProducts[key]?.piecesInBulk,
					  }))
					: branchProducts.map((branchProduct) => ({
							selected: !!selectedProducts?.[branchProduct.product.id],
							quantity:
								selectedProducts?.[branchProduct.product.id]?.quantity || '',
							quantity_type:
								selectedProducts?.[branchProduct.product.id]?.quantityType ||
								quantityTypes.PIECE,
							product_id: branchProduct.product.id,
							pieces_in_bulk: branchProduct.product.pieces_in_bulk,
					  })),
			},
			Schema: Yup.object().shape({
				branchProducts: Yup.array().of(
					Yup.object().shape({
						selected: Yup.boolean(),
						quantity: Yup.number()
							.min(1, 'Must greater than zero')
							.when('selected', {
								is: true,
								then: Yup.number().required('Qty required'),
								otherwise: Yup.number().notRequired(),
							}),
					}),
				),
			}),
		}),
		[branchProducts, selectedProducts, onlySelectedVisible],
	);

	const renderQuantity = (index, values) => {
		const { selected = null, product_id: productId = null } =
			values?.branchProducts?.[index] || {};

		return (
			<>
				<div className="quantity-container">
					<FormInput
						type="number"
						id={`branchProducts.${index}.quantity`}
						onChange={(value) => {
							debouncedOnChangeQuantity(productId, value);
						}}
						disabled={!selected}
					/>
					<FormSelect
						id={`branchProducts.${index}.quantity_type`}
						options={quantityTypeOptions}
						onChange={(value) => {
							onChangeQuantityType(productId, value);
						}}
						disabled={!selected}
					/>
				</div>
				<ErrorMessage
					name={`branchProducts.${index}.quantity`}
					render={(error) => <FieldError error={error} />}
				/>
			</>
		);
	};

	const onChangeCheckbox = (productId, data, value) => {
		setSelectedProducts((prevProducts) => {
			const newProducts = cloneDeep(prevProducts);
			if (value) {
				newProducts[productId] = data;
			} else {
				delete newProducts[productId];
			}

			return newProducts;
		});
	};

	const debouncedOnChangeQuantity = useCallback(
		debounce((productId, value) => onChangeQuantity(productId, value), 500),
		[],
	);

	const onChangeQuantity = (productId, value) => {
		setSelectedProducts((prevProducts) => {
			if (productId in prevProducts) {
				const newProducts = cloneDeep(prevProducts);
				newProducts[productId].quantity = value;

				return newProducts;
			}

			return prevProducts;
		});
	};

	const onChangeQuantityType = (productId, value) => {
		setSelectedProducts((prevProducts) => {
			if (productId in prevProducts) {
				const newProducts = cloneDeep(prevProducts);
				newProducts[productId].quantityType = value;

				return newProducts;
			}

			return prevProducts;
		});
	};

	const onCreate = () => {
		const productIds = Object.keys(selectedProducts);
		if (productIds.length > 0) {
			const products = productIds.map((id) => {
				const { piecesInBulk, quantityType, quantity } = selectedProducts[id];

				return {
					product_id: id,
					quantity_piece:
						quantityType === quantityTypes.PIECE
							? quantity
							: convertToPieces(quantity, piecesInBulk),
				};
			});

			createRequisitionSlip(
				{
					requestor_id: user?.branch?.id,
					requesting_user_id: user?.id,
					type: requisitionSlipTypes.MANUAL,
					products,
				},
				({ status }) => {
					if (status === request.SUCCESS) {
						history.push('/branch-manager/requisition-slips');
					}
				},
			);
		}
	};

	const onPageChange = (page, newPageSize) => {
		getBranchProducts(
			{
				branchId,
				search: searchedKeyword,
				productStatus: selectedStatus === 'all' ? null : selectedStatus,
				isSoldInBranch: true,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	const onSearch = (keyword) => {
		const lowerCaseKeyword = keyword?.toLowerCase();

		getBranchProducts(
			{
				branchId,
				search: lowerCaseKeyword,
				productStatus: selectedStatus === 'all' ? null : selectedStatus,
				isSoldInBranch: true,
				page: 1,
			},
			true,
		);

		setSeachedKeyword(lowerCaseKeyword);
	};

	const loading = [requisitionSlipsStatus, branchProductsStatus].includes(
		request.REQUESTING,
	);

	return (
		<Content className="CreateRequisitionSlip" title="Create Requisition Slips">
			<Box>
				<TableHeader
					title="Create Requisition Slip"
					onSearch={onSearch}
					statuses={branchProductStatusOptionsWithAll}
					onStatusSelect={(status) => {
						getBranchProducts(
							{
								branchId: user?.branch?.id,
								search: searchedKeyword,
								productStatus: status === 'all' ? null : status,
								isSoldInBranch: true,
								page: 1,
							},
							true,
						);
						setSelectedStatus(status);
					}}
					statusDisabled={onlySelectedVisible}
					searchDisabled={onlySelectedVisible}
				/>

				<div className="PaddingHorizontal">
					<RequestErrors
						errors={[
							...convertIntoArray(branchProductsErrors, 'Branch Products'),
							...convertIntoArray(requisitionSlipsErrors, 'Requisition Slip'),
						]}
						withSpaceBottom
					/>

					<Space
						className="CreateRequisitionSlip_filter"
						direction="vertical"
						size={15}
					>
						<Label label="Show Sold In Branch" />
						<Radio.Group
							options={[
								{ label: 'Show All Products', value: false },
								{ label: 'Show Selected Products', value: true },
							]}
							onChange={(e) => {
								setOnlySelectedVisible(e.target.value);
							}}
							defaultValue={false}
							optionType="button"
						/>
					</Space>

					{Object.keys(selectedProducts).length > 0 && (
						// eslint-disable-next-line react/jsx-one-expression-per-line
						<FieldInfo
							className="CreateRequisitionSlip_addedProductsCount"
							message={`${
								Object.keys(selectedProducts).length
							} product/s selected`}
						/>
					)}
				</div>

				<Formik
					initialValues={getFormDetails().DefaultValues}
					validationSchema={getFormDetails().Schema}
					onSubmit={async () => {
						setSubmitting(true);
						await sleep(500);
						setSubmitting(false);

						onCreate();
					}}
					enableReinitialize
				>
					{({ values, setFieldValue }) => (
						<Form className="form">
							{onlySelectedVisible ? (
								<TableNormal
									columns={columns}
									data={Object.keys(selectedProducts).map((key, index) => {
										const product = selectedProducts[key];
										const productId =
											values?.branchProducts?.[index]?.product_id;

										return [
											// Select
											<FormCheckbox
												id={`branchProducts.${index}.selected`}
												label={product?.productName}
												onChange={(value) => {
													if (!value) {
														setFieldValue(
															`branchProducts.${index}.quantity`,
															'',
														);
														setFieldValue(
															`branchProducts.${index}.quantity_type`,
															quantityTypes.PIECE,
														);
													}

													onChangeCheckbox(productId, {}, value);
												}}
											/>,
											// Quantity / Bulk | Pieces
											renderQuantity(index, values),
											// Status
											getBranchProductStatus(product?.status),
										];
									})}
									displayInPage
									loading={loading || isSubmitting}
								/>
							) : (
								<TableNormal
									columns={columns}
									data={branchProducts.map((branchProduct, index) => {
										const productId =
											values?.branchProducts?.[index]?.product_id;

										return [
											// Select
											<FormCheckbox
												id={`branchProducts.${index}.selected`}
												label={branchProduct?.product?.name}
												onChange={(value) => {
													if (!value) {
														setFieldValue(
															`branchProducts.${index}.quantity`,
															'',
														);
														setFieldValue(
															`branchProducts.${index}.quantity_type`,
															quantityTypes.PIECE,
														);
													}

													onChangeCheckbox(
														productId,
														{
															productName: branchProduct?.product?.name,
															piecesInBulk:
																branchProduct?.product?.pieces_in_bulk,
															status: branchProduct?.product_status,
														},
														value,
													);
												}}
											/>,
											// Quantity / Bulk | Pieces
											renderQuantity(index, values),
											// Status
											getBranchProductStatus(branchProduct?.product_status),
										];
									})}
									displayInPage
									loading={loading || isSubmitting}
								/>
							)}

							{!onlySelectedVisible && (
								<div className="CreateRequisitionSlip_pagination">
									<Pagination
										current={currentPage}
										total={pageCount}
										pageSize={pageSize}
										onChange={onPageChange}
										pageSizeOptions={pageSizeOptions}
										disabled={loading || isSubmitting}
									/>
								</div>
							)}

							<Divider dashed />

							<div className="CreateRequisitionSlip_createContainer">
								<Button
									classNames="CreateRequisitionSlip_btnCreate"
									type="submit"
									text="Create"
									variant="primary"
									disabled={
										loading || isSubmitting || isEmpty(selectedProducts)
									}
								/>
							</div>
						</Form>
					)}
				</Formik>
			</Box>
		</Content>
	);
};
