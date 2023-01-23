import { EditOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Select, Tag } from 'antd';
import {
	Button,
	FieldError,
	FormattedInputNumber,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { markdownTypes } from 'global';
import React, { useCallback } from 'react';
import { filterOption, getId } from 'utils';
import * as Yup from 'yup';

interface Props {
	branches: any;
	branchProducts: any;
	onSubmit: any;
	onClose: any;
	isLoading: boolean;
}

export const PricesForm = ({
	branches,
	branchProducts,
	onSubmit,
	onClose,
	isLoading,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: branchProducts.map((branchProduct) => {
				const branch = getBranch(branchProduct?.branch_id);

				return {
					branchId: getId(branch),
					branchName: branch?.name,

					markdownType:
						branchProduct?.price_markdown?.type || markdownTypes.REGULAR,
					costPerPiece: branchProduct?.cost_per_piece || '',
					costPerBulk: branchProduct?.cost_per_bulk || '',
					pricePerPiece: branchProduct?.price_per_piece || '',
					pricePerBulk: branchProduct?.price_per_bulk || '',
					markdownPricePerPiece1:
						branchProduct?.markdown_price_per_piece1 || '',
					markdownPricePerPiece2:
						branchProduct?.markdown_price_per_piece2 || '',
					markdownPricePerBulk1: branchProduct?.markdown_price_per_bulk1 || '',
					markdownPricePerBulk2: branchProduct?.markdown_price_per_bulk2 || '',

					initialMarkdownType:
						branchProduct?.price_markdown?.type || markdownTypes.REGULAR,
					initialCostPerPiece: branchProduct?.cost_per_piece || '',
					initialCostPerBulk: branchProduct?.cost_per_bulk || '',
					initialPricePerPiece: branchProduct?.price_per_piece || '',
					initialPricePerBulk: branchProduct?.price_per_bulk || '',
					initialMarkdownPricePerPiece1:
						branchProduct?.markdown_price_per_piece1 || '',
					initialMarkdownPricePerPiece2:
						branchProduct?.markdown_price_per_piece2 || '',
					initialMarkdownPricePerBulk1:
						branchProduct?.markdown_price_per_bulk1 || '',
					initialMarkdownPricePerBulk2:
						branchProduct?.markdown_price_per_bulk2 || '',
				};
			}),
			Schema: Yup.array(
				Yup.object().shape({
					markdownType: Yup.string().label('Current Sales Price Type'),
					costPerPiece: Yup.number().min(0).label('Cost (Piece)'),
					costPerBulk: Yup.number().min(0).label('Cost (Bulk)'),
					pricePerPiece: Yup.number().min(0).label('Regular Price (Piece)'),
					pricePerBulk: Yup.number().min(0).label('Regular Price (Bulk)'),
					markdownPricePerPiece1: Yup.number()
						.min(0)
						.label('Wholesale Price (Piece)'),
					markdownPricePerPiece2: Yup.number()
						.min(0)
						.label('Special Price (Piece)'),
					markdownPricePerBulk1: Yup.number()
						.min(0)
						.label('Wholesale Price (Bulk)'),
					markdownPricePerBulk2: Yup.number()
						.min(0)
						.label('Special Price (Bulk)'),
				}),
			),
		}),
		[branchProducts, branches],
	);

	const renderInputField = ({
		name,
		label,
		value,
		placeholder,
		setFieldValue,
	}) => (
		<>
			<Label id={name} label={label} spacing />
			<FormattedInputNumber
				className="w-100"
				controls={false}
				placeholder={placeholder ? placeholder.toFixed(2) : undefined}
				value={value}
				onChange={(newValue) => {
					setFieldValue(name, newValue);
				}}
			/>
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	const isEdited = (branchProduct) =>
		branchProduct.initialMarkdownType !== branchProduct.markdownType ||
		branchProduct.initialCostPerPiece !== branchProduct.costPerPiece ||
		branchProduct.initialCostPerBulk !== branchProduct.costPerBulk ||
		branchProduct.initialPricePerPiece !== branchProduct.pricePerPiece ||
		branchProduct.initialPricePerBulk !== branchProduct.pricePerBulk ||
		branchProduct.initialMarkdownPricePerPiece1 !==
			branchProduct.markdownPricePerPiece1 ||
		branchProduct.initialMarkdownPricePerPiece2 !==
			branchProduct.markdownPricePerPiece2 ||
		branchProduct.initialMarkdownPricePerBulk1 !==
			branchProduct.markdownPricePerBulk1 ||
		branchProduct.initialMarkdownPricePerBulk2 !==
			branchProduct.markdownPricePerBulk2;

	const getBranch = useCallback(
		(branchId) => branches.find(({ id }) => id === branchId),
		[branches],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={(values) => {
				const ALLOWED_LENGTH = 1;

				const priceMarkdownFormData = values
					.map((value) => {
						const data = { branchId: value.branchId };

						if (value.initialMarkdownType !== value.markdownType) {
							data['type'] = value.markdownType;
						}

						return data;
					})
					.filter((data) => Object.keys(data).length > ALLOWED_LENGTH);

				const branchProductFormData = values
					.map((value) => {
						const data = { branchId: value.branchId };

						if (value.initialCostPerPiece !== value.costPerPiece) {
							data['costPerPiece'] = value.costPerPiece;
						}

						if (value.initialCostPerBulk !== value.costPerBulk) {
							data['costPerBulk'] = value.costPerBulk;
						}

						if (value.initialPricePerPiece !== value.pricePerPiece) {
							data['pricePerPiece'] = value.pricePerPiece;
						}

						if (value.initialPricePerBulk !== value.pricePerBulk) {
							data['pricePerBulk'] = value.pricePerBulk;
						}

						if (
							value.initialMarkdownPricePerPiece1 !==
							value.markdownPricePerPiece1
						) {
							data['markdownPricePerPiece1'] = value.markdownPricePerPiece1;
						}

						if (
							value.initialMarkdownPricePerPiece2 !==
							value.markdownPricePerPiece2
						) {
							data['markdownPricePerPiece2'] = value.markdownPricePerPiece2;
						}

						if (
							value.initialMarkdownPricePerBulk1 !== value.markdownPricePerBulk1
						) {
							data['markdownPricePerBulk1'] = value.markdownPricePerBulk1;
						}

						if (
							value.initialMarkdownPricePerBulk2 !== value.markdownPricePerBulk2
						) {
							data['markdownPricePerBulk2'] = value.markdownPricePerBulk2;
						}

						return data;
					})
					.filter((data) => Object.keys(data).length > ALLOWED_LENGTH);

				onSubmit({
					branchProductFormData,
					priceMarkdownFormData,
				});
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					{values.length > 0 && (
						<Collapse
							defaultActiveKey={values.length === 1 ? values[0].branchId : null}
							expandIconPosition="right"
						>
							{values.map((branchProduct, index) => (
								<Collapse.Panel
									key={branchProduct.branchId}
									header={
										<Row className="w-100" justify="space-between">
											<Col>{branchProduct.branchName}</Col>
											{isEdited(branchProduct) && (
												<Col>
													<Tag color="blue" icon={<EditOutlined />}>
														Edited
													</Tag>
												</Col>
											)}
										</Row>
									}
								>
									<Row gutter={[16, 16]}>
										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.costPerPiece`,
												label: 'Cost (Piece)',
												placeholder: branchProduct.initialCostPerPiece,
												value: branchProduct.costPerPiece,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.costPerBulk`,
												label: 'Cost (Bulk)',
												placeholder: branchProduct.initialCostPerBulk,
												value: branchProduct.costPerBulk,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.pricePerPiece`,
												label: 'Regular Price (Piece)',
												placeholder: branchProduct.initialPricePerPiece,
												value: branchProduct.pricePerPiece,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.pricePerBulk`,
												label: 'Regular Price (Bulk)',
												placeholder: branchProduct.initialPricePerBulk,
												value: branchProduct.pricePerBulk,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.markdownPricePerPiece1`,
												label: 'Wholesale Price (Piece)',
												placeholder:
													branchProduct.initialMarkdownPricePerPiece1,
												value: branchProduct.markdownPricePerPiece1,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.markdownPricePerBulk1`,
												label: 'Wholesale Price (Bulk)',
												placeholder: branchProduct.initialMarkdownPricePerBulk1,
												value: branchProduct.markdownPricePerBulk1,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.markdownPricePerPiece2`,
												label: 'Special Price (Piece)',
												placeholder:
													branchProduct.initialMarkdownPricePerPiece2,
												value: branchProduct.markdownPricePerPiece2,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} span={24}>
											{renderInputField({
												name: `${index}.markdownPricePerBulk2`,
												label: 'Special Price (Bulk)',
												placeholder: branchProduct.initialMarkdownPricePerBulk2,
												value: branchProduct.markdownPricePerBulk2,
												setFieldValue,
											})}
										</Col>

										<Col span={24}>
											<Label
												id="markdownType"
												label="Current Sales Price Type"
												spacing
											/>
											<Select
												className="w-100"
												filterOption={filterOption}
												optionFilterProp="children"
												value={branchProduct.markdownType}
												showSearch
												onChange={(value) => {
													setFieldValue(`${index}.markdownType`, value);
												}}
											>
												<Select.Option
													key={markdownTypes.REGULAR}
													value={markdownTypes.REGULAR}
												>
													Regular
												</Select.Option>
												<Select.Option
													key={markdownTypes.WHOLESALE}
													value={markdownTypes.WHOLESALE}
												>
													Wholesale
												</Select.Option>
												<Select.Option
													key={markdownTypes.SPECIAL}
													value={markdownTypes.SPECIAL}
												>
													Special
												</Select.Option>
											</Select>

											<ErrorMessage
												name="markdownType"
												render={(error) => <FieldError error={error} />}
											/>
										</Col>
									</Row>
								</Collapse.Panel>
							))}
						</Collapse>
					)}

					<div className="ModalCustomFooter">
						<Button
							disabled={isLoading}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							loading={isLoading}
							text="Submit"
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
