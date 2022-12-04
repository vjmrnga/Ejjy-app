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
	loading: boolean;
}

export const PricesForm = ({
	branches,
	branchProducts,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: branchProducts.map((branchProduct) => ({
				branchId: branchProduct?.branch_id,

				markdownType:
					branchProduct?.price_markdown?.type || markdownTypes.REGULAR,
				costPerPiece: branchProduct?.cost_per_piece || '',
				costPerBulk: branchProduct?.cost_per_bulk || '',
				pricePerPiece: branchProduct?.price_per_piece || '',
				pricePerBulk: branchProduct?.price_per_bulk || '',

				initialMarkdownType:
					branchProduct?.price_markdown?.type || markdownTypes.REGULAR,
				initialCostPerPiece: branchProduct?.cost_per_piece || '',
				initialCostPerBulk: branchProduct?.cost_per_bulk || '',
				initialPricePerPiece: branchProduct?.price_per_piece || '',
				initialPricePerBulk: branchProduct?.price_per_bulk || '',
			})),
			Schema: Yup.array(
				Yup.object().shape({
					markdownType: Yup.string().label('Current Sales Price Type'),
					costPerPiece: Yup.number().min(0).label('Cost (Piece)'),
					costPerBulk: Yup.number().min(0).label('Cost (Bulk)'),
					pricePerPiece: Yup.number().min(0).label('Regular Price (Piece)'),
					pricePerBulk: Yup.number().min(0).label('Regular Price (Bulk)'),
				}),
			),
		}),
		[branchProducts],
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
				size="large"
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
		branchProduct.initialPricePerBulk !== branchProduct.pricePerBulk;

	const getBranchName = useCallback(
		(branchId) => {
			let branchName = '';
			const branch = branches.find(({ id }) => id === branchId);
			if (branch) {
				branchName = branch.name;
			}

			return branchName;
		},
		[branches],
	);

	const getBranchId = useCallback(
		(branchId) => {
			const branch = branches.find(({ id }) => id === branchId);
			if (branch) {
				return getId(branch);
			}

			return branchId;
		},
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
						const data = { branchId: getBranchId(value.branchId) };

						if (value.initialMarkdownType !== value.markdownType) {
							data['type'] = value.markdownType;
						}

						return data;
					})
					.filter((data) => Object.keys(data).length > ALLOWED_LENGTH);

				const branchProductFormData = values
					.map((value) => {
						const data = { branchId: getBranchId(value.branchId) };

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
											<Col>{getBranchName(branchProduct.branchId)}</Col>
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
										<Col sm={12} xs={24}>
											{renderInputField({
												name: `${index}.costPerPiece`,
												label: 'Cost (Piece)',
												placeholder: branchProduct.initialCostPerPiece,
												value: branchProduct.costPerPiece,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} xs={24}>
											{renderInputField({
												name: `${index}.costPerBulk`,
												label: 'Cost (Bulk)',
												placeholder: branchProduct.initialCostPerBulk,
												value: branchProduct.costPerBulk,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} xs={24}>
											{renderInputField({
												name: `${index}.pricePerPiece`,
												label: 'Regular Price (Piece)',
												placeholder: branchProduct.initialPricePerPiece,
												value: branchProduct.pricePerPiece,
												setFieldValue,
											})}
										</Col>

										<Col sm={12} xs={24}>
											{renderInputField({
												name: `${index}.pricePerBulk`,
												label: 'Regular Price (Bulk)',
												placeholder: branchProduct.initialPricePerBulk,
												value: branchProduct.pricePerBulk,
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
												size="large"
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
							disabled={loading}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							loading={loading}
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
