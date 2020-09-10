import { Col, Divider, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, InputLabel, SelectLabel } from '../../../../../components/elements';
import { Option } from '../../../../../components/elements/Select/Select';
import { sleep } from '../../../../../utils/function';
// import { Button, FieldError, InputLabel } from '../../../../components/elements';
// import { sleep } from '../../../../utils/function';

interface ICreateBranch {
	id?: number;
	branch_id?: number;
	product_id?: number;
	reorder_point?: number;
	max_balance?: number;
	price_per_piece?: number;
	price_per_bulk?: number;
	current_balance?: number;
}

interface Props {
	branchId: number;
	branchProduct: any;
	productOptions: Option[];
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditBranchProductsForm = ({
	branchId,
	branchProduct,
	productOptions,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				product_id: branchProduct?.product_id || '',
				reorder_point: branchProduct?.reorder_point || '',
				max_balance: branchProduct?.max_balance || '',
				price_per_piece: branchProduct?.price_per_piece || '',
				price_per_bulk: branchProduct?.price_per_bulk || '',
				current_balance: branchProduct?.current_balance || '',
			},
			Schema: Yup.object().shape({
				product_id: Yup.number().required().label('Product'),
				reorder_point: Yup.number().required().min(0).max(65535).label('Reorder Point'),
				max_balance: Yup.number().required().min(0).max(65535).label('Max Balance'),
				price_per_piece: Yup.number().required().min(0).label('Price per Piece'),
				price_per_bulk: Yup.number().required().min(0).label('Price per Bulk'),
				current_balance: Yup.number().nullable().min(0).max(65535),
			}),
		}),
		[branchProduct],
	);
	console.log('branchProduct', branchProduct);
	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values: ICreateBranch) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				values.id = branchProduct?.id;
				values.branch_id = branchId;
				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form">
					<Row gutter={[15, 15]}>
						<Col span={24}>
							<SelectLabel
								label="Product"
								id="product_id"
								placeholder="Select a product"
								options={productOptions}
								disabled={!!branchProduct}
							/>
							{errors.product_id && touched.product_id ? (
								<FieldError error={errors.product_id} />
							) : null}
						</Col>

						<Divider dashed />

						<Col sm={12} xs={24}>
							<InputLabel min={0} type="number" id="reorder_point" label="Reorder Point" />
							{errors.reorder_point && touched.reorder_point ? (
								<FieldError error={errors.reorder_point} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<InputLabel min={0} type="number" id="max_balance" label="Max Balance" />
							{errors.max_balance && touched.max_balance ? (
								<FieldError error={errors.max_balance} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<InputLabel min={0} type="number" id="price_per_piece" label="Price (Piece)" />
							{errors.price_per_piece && touched.price_per_piece ? (
								<FieldError error={errors.price_per_piece} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<InputLabel min={0} type="number" id="price_per_bulk" label="Price (Bulk)" />
							{errors.price_per_bulk && touched.price_per_bulk ? (
								<FieldError error={errors.price_per_bulk} />
							) : null}
						</Col>

						<Col span={24}>
							<InputLabel min={0} type="number" id="current_balance" label="Current Balance" />
							{errors.current_balance && touched.current_balance ? (
								<FieldError error={errors.current_balance} />
							) : null}
						</Col>
					</Row>

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							classNames="mr-10"
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text={branchProduct ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
