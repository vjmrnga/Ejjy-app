import { Button, Col, Descriptions, Divider, Row, Typography } from 'antd';
import {
	FieldError,
	FormInputLabel,
	FormRadioButton,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	booleanOptions,
	checkingTypesOptions,
	productCheckingTypes,
	unitOfMeasurementTypes,
} from 'global';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import { getProductCode, sleep } from 'utils';
import * as Yup from 'yup';

const { Text } = Typography;

interface Props {
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	isLoading: boolean;
	isCurrentBalanceVisible: boolean;
}

export const EditBranchProductsForm = ({
	branchProduct,
	onSubmit,
	onClose,
	isLoading,
	isCurrentBalanceVisible,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				checking: branchProduct?.is_daily_checked
					? productCheckingTypes.DAILY
					: productCheckingTypes.RANDOM,
				type: branchProduct?.product?.type,
				unit_of_measurement: branchProduct?.product?.unit_of_measurement,
				reorder_point: branchProduct?.reorder_point,
				max_balance: branchProduct?.max_balance,
				price_per_piece: branchProduct?.price_per_piece?.toFixed(2) || '',
				markdown_price_per_piece1:
					branchProduct?.markdown_price_per_piece1?.toFixed(2) || '',
				markdown_price_per_piece2:
					branchProduct?.markdown_price_per_piece2?.toFixed(2) || '',
				price_per_bulk: branchProduct?.price_per_bulk?.toFixed(2) || '',
				markdown_price_per_bulk1:
					branchProduct?.markdown_price_per_bulk1?.toFixed(2) || '',
				markdown_price_per_bulk2:
					branchProduct?.markdown_price_per_bulk2?.toFixed(2) || '',
				current_balance: branchProduct?.current_balance,
				is_sold_in_branch: branchProduct.is_sold_in_branch,
			},
			Schema: Yup.object().shape({
				checking: Yup.string().required().label('Checking'),
				reorder_point: Yup.number()
					.required()
					.min(0)
					.max(65535)
					.label('Reorder Point'),
				max_balance: Yup.number()
					.required()
					.min(0)
					.max(65535)
					.label('Max Balance'),
				price_per_piece: Yup.number()
					.required()
					.min(0)
					.label('Price per Piece'),
				markdown_price_per_piece1: Yup.number()
					.required()
					.min(0)
					.label('Wholesale Price (piece)'),
				markdown_price_per_piece2: Yup.number()
					.required()
					.min(0)
					.label('Special Price (piece)'),
				price_per_bulk: Yup.number().required().min(0).label('Price per Bulk'),
				markdown_price_per_bulk1: Yup.number()
					.required()
					.min(0)
					.label('Wholesale Price (bulk)'),
				markdown_price_per_bulk2: Yup.number()
					.required()
					.min(0)
					.label('Special Price (bulk)'),
				current_balance: isCurrentBalanceVisible
					? Yup.number()
							.required()
							.min(0)
							.test(
								'is-whole-number',
								'Non-weighing items require whole number quantity.',
								(value) =>
									branchProduct?.product?.unit_of_measurement ===
									unitOfMeasurementTypes.NON_WEIGHING
										? isInteger(Number(value))
										: true,
							)
							.label('Current Balance')
					: undefined,
			}),
		}),
		[branchProduct, isCurrentBalanceVisible],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				let data = branchProduct;
				if (formData.is_sold_in_branch) {
					data = {
						...formData,
						id: branchProduct?.id,
						is_daily_checked: formData.checking === productCheckingTypes.DAILY,
						is_randomly_checked:
							formData.checking === productCheckingTypes.RANDOM,
					};
				}

				onSubmit({
					...data,
					id: branchProduct?.id,
					is_sold_in_branch: formData.is_sold_in_branch,

					// NOTE: Hidden fields must be visible in order to be saved.
					current_balance: isCurrentBalanceVisible
						? formData.current_balance
						: undefined,
				});
			}}
		>
			{({ values }) => (
				<Form>
					<Descriptions column={1} bordered>
						<Descriptions.Item label="Code">
							{getProductCode(branchProduct?.product)}
						</Descriptions.Item>
						<Descriptions.Item label="Textcode">
							{branchProduct?.product?.textcode}
						</Descriptions.Item>

						<Descriptions.Item label="Name">
							{branchProduct?.product?.name}
						</Descriptions.Item>
					</Descriptions>

					<Row className="mt-4" gutter={[16, 16]}>
						<Col sm={12} xs={24}>
							<Label label="Checking" spacing />
							<FormRadioButton
								disabled={!values.is_sold_in_branch}
								id="checking"
								items={checkingTypesOptions}
							/>
							<ErrorMessage
								name="checking"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="In Stock" spacing />
							<FormRadioButton id="is_sold_in_branch" items={booleanOptions} />
							<ErrorMessage
								name="is_sold_in_branch"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider dashed>QUANTITY</Divider>

						<Col sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="reorder_point"
								label="Reorder Point"
								min={0}
								type="number"
							/>
							<ErrorMessage
								name="reorder_point"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="max_balance"
								label="Max Balance"
								type="number"
							/>
							<ErrorMessage
								name="max_balance"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="price_per_piece"
								label="Price (Piece)"
								isMoney
							/>
							<ErrorMessage
								name="price_per_piece"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="markdown_price_per_piece1"
								label="Wholesale Price (piece)"
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_piece1"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="markdown_price_per_piece2"
								label="Special Price (piece)"
								step=".01"
								type="number"
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_piece2"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="price_per_bulk"
								label="Price (Bulk)"
								type="number"
								isMoney
							/>
							<ErrorMessage
								name="price_per_bulk"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="markdown_price_per_bulk1"
								label="Wholesale Price (bulk)"
								type="number"
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_bulk1"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								disabled={!values.is_sold_in_branch}
								id="markdown_price_per_bulk2"
								label="Special Price (bulk)"
								step=".01"
								type="number"
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_bulk2"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{isCurrentBalanceVisible && (
							<>
								<Divider dashed>HIDDEN FIELDS</Divider>

								<Col sm={12} xs={24}>
									<FormInputLabel
										disabled={!values.is_sold_in_branch}
										id="current_balance"
										isWholeNumber={
											branchProduct.product.unit_of_measurement ===
											unitOfMeasurementTypes.NON_WEIGHING
										}
										label="Current Balance"
										type="number"
									/>
									<ErrorMessage
										name="current_balance"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
							</>
						)}
					</Row>

					<div className="ModalCustomFooter">
						<Button
							disabled={isLoading || isSubmitting}
							htmlType="button"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							htmlType="submit"
							loading={isLoading || isSubmitting}
							type="primary"
						>
							{branchProduct ? 'Edit' : 'Create'}
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
