import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { sleep } from 'utils';
import { TableNormal } from '../../../../../components';
import { Button, FormCheckbox } from '../../../../../components/elements';

const columns = [
	{ name: '', width: '80px' },
	{ name: 'Barcode' },
	{ name: 'Name' },
];

interface Props {
	products: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const SetOutOfStockForm = ({
	products,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				products: products.map(({ requisition_slip_product_id }) => ({
					selected: false,
					requisition_slip_product_id,
				})),
			},
		}),
		[products],
	);

	const getSelectRadioButton = (index) => (
		<FormCheckbox id={`products.${index}.selected`} />
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			enableReinitialize
			onSubmit={async (formData: any) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit(formData);
			}}
		>
			<Form>
				<TableNormal
					columns={columns}
					data={products.map((product, index) => [
						// Select
						getSelectRadioButton(index),
						// Barcode
						product?.product_barcode || product?.product_textcode,
						// Name
						product?.product_name,
					])}
					loading={loading}
				/>

				<div className="ModalCustomFooter">
					<Button
						disabled={loading || isSubmitting}
						text="Cancel"
						type="button"
						onClick={onClose}
					/>
					<Button
						disabled={!products.length}
						loading={loading || isSubmitting}
						text="Submit"
						type="submit"
						variant="primary"
					/>
				</div>
			</Form>
		</Formik>
	);
};
