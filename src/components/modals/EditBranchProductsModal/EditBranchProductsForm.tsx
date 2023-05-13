import React, { useCallback, useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Tag } from 'antd';
import { FieldError, FormRadioButton, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import {
	booleanOptions,
	checkingTypesOptions,
	productCheckingTypes,
} from 'global';
import _ from 'lodash';
import { getId } from 'utils';
import * as Yup from 'yup';

interface Props {
	branches: any;
	branchProducts?: any;
	onSubmit: any;
	onClose: any;
	isLoading: boolean;
	isBulkEdit?: boolean;
}

const variableNames = [
	{
		valueKey: 'isSoldInBranch',
		initialValueKey: 'initialIsSoldInBranch',
	},
	{
		valueKey: 'checking',
		initialValueKey: 'initialChecking',
	},
	{
		valueKey: 'isDailyChecked',
		initialValueKey: 'initialIsDailyChecked',
	},
	{
		valueKey: 'isRandomlyChecked',
		initialValueKey: 'initialIsRandomlyChecked',
	},
	{
		valueKey: 'reorderPoint',
		initialValueKey: 'initialReorderPoint',
	},
	{
		valueKey: 'maxBalance',
		initialValueKey: 'initialMaxBalance',
	},
];

export const EditBranchProductsForm = ({
	branches,
	branchProducts,
	onSubmit,
	onClose,
	isLoading,
	isBulkEdit,
}: Props) => {
	// STATES
	const [activeKey, setActiveKey] = useState(null);

	// METHODS
	useEffect(() => {
		if (branchProducts?.length === 1) {
			setActiveKey([branchProducts[0].branch_id]);
		}
	}, [branchProducts]);

	useEffect(() => {
		if (isBulkEdit) {
			setActiveKey(branches.map((branch) => getId(branch)).join(','));
		}
	}, [branches, isBulkEdit]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: isBulkEdit
				? [
						{
							branchId: branches.map((branch) => getId(branch)).join(','),
							branchName: 'All Branches',

							checking: '',
							isDailyChecked: '',
							isRandomlyChecked: '',
							reorderPoint: '',
							maxBalance: '',
							isSoldInBranch: '',

							initialChecking: '',
							initialIsDailyChecked: '',
							initialIsRandomlyChecked: '',
							initialReorderPoint: '',
							initialMaxBalance: '',
							initialIsSoldInBranch: '',
						},
				  ]
				: branchProducts.map((branchProduct) => {
						const branch = getBranch(branchProduct?.branch_id);

						return {
							branchId: getId(branch),
							branchName: branch?.name,

							checking: branchProduct?.is_daily_checked
								? productCheckingTypes.DAILY
								: productCheckingTypes.RANDOM,
							isDailyChecked: branchProduct?.is_daily_checked,
							isRandomlyChecked: !branchProduct?.is_daily_checked,
							reorderPoint: branchProduct?.reorder_point,
							maxBalance: branchProduct?.max_balance,
							isSoldInBranch: branchProduct.is_sold_in_branch,

							initialChecking: branchProduct?.is_daily_checked
								? productCheckingTypes.DAILY
								: productCheckingTypes.RANDOM,
							initialIsDailyChecked: branchProduct?.is_daily_checked,
							initialIsRandomlyChecked: !branchProduct?.is_daily_checked,
							initialReorderPoint: branchProduct?.reorder_point,
							initialMaxBalance: branchProduct?.max_balance,
							initialIsSoldInBranch: branchProduct.is_sold_in_branch,
						};
				  }),
			Schema: Yup.array(
				Yup.object().shape({
					reorderPoint: Yup.number().min(0).label('Reorder Point'),
					maxBalance: Yup.number().min(0).label('Max Balance'),
				}),
			),
		}),
		[branchProducts, branches],
	);

	const isEdited = (branchProduct) =>
		variableNames.some(
			(variable) =>
				branchProduct[variable.initialValueKey] !==
				branchProduct[variable.valueKey],
		);

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

				const formData = values
					.map((value) => {
						const data = { branchIds: _.toString(value.branchId) };

						if (value.isSoldInBranch) {
							variableNames.forEach((variable) => {
								if (
									value[variable.initialValueKey] !== value[variable.valueKey]
								) {
									data[variable.valueKey] = value[variable.valueKey];
								}
							});
						}

						if (value.initialIsSoldInBranch !== value.isSoldInBranch) {
							data['isSoldInBranch'] = value.isSoldInBranch;
						}

						return data;
					})
					.filter((data) => Object.keys(data).length > ALLOWED_LENGTH);

				onSubmit({ formData, isBulkEdit });
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					{values.length > 0 && (
						<Collapse
							activeKey={activeKey}
							collapsible={
								isBulkEdit || values.length === 1 ? 'disabled' : undefined
							}
							expandIconPosition="right"
							onChange={(key) => {
								setActiveKey(key);
							}}
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
										<Col span={24}>
											<Label label="In Stock" spacing />
											<FormRadioButton
												id={`${index}.isSoldInBranch`}
												items={booleanOptions}
											/>
											<ErrorMessage
												name={`${index}.isSoldInBranch`}
												render={(error) => <FieldError error={error} />}
											/>
										</Col>

										<Col span={24}>
											<Label label="Checking" spacing />
											<FormRadioButton
												disabled={values[index].isSoldInBranch === false}
												id={`${index}.checking`}
												items={checkingTypesOptions}
												onChange={(value) => {
													setFieldValue(
														`${index}.isDailyChecked`,
														value === productCheckingTypes.DAILY,
													);
													setFieldValue(
														`${index}.isRandomlyChecked`,
														value === productCheckingTypes.RANDOM,
													);
												}}
											/>
											<ErrorMessage
												name={`${index}.checking`}
												render={(error) => <FieldError error={error} />}
											/>
										</Col>

										<Col lg={12} span={24}>
											<Label label="Reorder Point" spacing />
											<Input
												min={0}
												type="number"
												value={values[index]['reorderPoint']}
												onChange={(e) => {
													setFieldValue(
														`${index}.reorderPoint`,
														e.target.value,
													);
												}}
											/>
											<ErrorMessage
												name={`${index}.reorderPoint`}
												render={(error) => <FieldError error={error} />}
											/>
										</Col>

										<Col lg={12} span={24}>
											<Label label="Max Balance" spacing />
											<Input
												min={0}
												type="number"
												value={values[index]['maxBalance']}
												onChange={(e) => {
													setFieldValue(`${index}.maxBalance`, e.target.value);
												}}
											/>
											<ErrorMessage
												name={`${index}.maxBalance`}
												render={(error) => <FieldError error={error} />}
											/>
										</Col>
									</Row>
								</Collapse.Panel>
							))}
						</Collapse>
					)}

					<div className="ModalCustomFooter">
						<Button disabled={isLoading} htmlType="button" onClick={onClose}>
							Cancel
						</Button>
						<Button htmlType="submit" loading={isLoading} type="primary">
							Submit
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
