import { Col } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { DetailsRow } from '../../../../../components';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../../components/elements';
import { sleep } from '../../../../../utils/function';

interface Props {
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const EditBranchProductsForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: branchProduct?.id,
				current_balance: branchProduct?.current_balance,
				is_daily_checked: branchProduct?.is_daily_checked,
				is_randomly_checked: branchProduct?.is_randomly_checked,
				is_sold_in_branch: branchProduct?.is_sold_in_branch,
			},
			Schema: Yup.object().shape({
				current_balance: Yup.number()
					.required()
					.min(0)
					.max(65535)
					.label('Max Balance'),
			}),
		}),
		[branchProduct],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(formData, resetForm);
			}}
			enableReinitialize
		>
			<Form className="form">
				<DetailsRow>
					<Col span={24}>
						<FormInputLabel
							type="number"
							id="current_balance"
							label="Current Balance"
						/>
						<ErrorMessage
							name="current_balance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</DetailsRow>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						classNames="mr-10"
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text="Edit"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
