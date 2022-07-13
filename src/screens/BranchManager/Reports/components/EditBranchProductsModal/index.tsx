import { Col, Divider, message, Modal } from 'antd';
import { DetailsRow, RequestErrors } from 'components';
import { Button, FieldError, FormInputLabel } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { SHOW_HIDE_SHORTCUT, unitOfMeasurementTypes } from 'global';
import { useBranchProductEdit } from 'hooks/useBranchProducts';
import { isInteger } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	confirmPassword,
	convertIntoArray,
	getKeyDownCombination,
} from 'utils';
import * as Yup from 'yup';

interface Props {
	branchProduct: any;
	onClose: any;
}

export const EditBranchProductsModal = ({ branchProduct, onClose }: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>[Edit] Branch Product</span>
			<span className="ModalTitleMainInfo">{branchProduct?.product?.name}</span>
		</>
	);

	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		mutateAsync: editBranchProduct,
		isLoading: isEditing,
		error: editError,
	} = useBranchProductEdit();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleSubmit = async (formData) => {
		await editBranchProduct({
			...formData,
			id: branchProduct.id,
		});
		message.success('Branch product was edited successfully');
		handleClose();
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
			event.preventDefault();
			if (isCurrentBalanceVisible) {
				setIsCurrentBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsCurrentBalanceVisible(true),
				});
			}
		}
	};

	const handleClose = () => {
		setIsCurrentBalanceVisible(false);
		onClose();
	};

	return (
		<Modal
			title={title}
			footer={null}
			onCancel={handleClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={convertIntoArray(editError?.errors)}
				withSpaceBottom
			/>

			<EditBranchProductsForm
				branchProduct={branchProduct}
				onSubmit={handleSubmit}
				onClose={handleClose}
				isLoading={isEditing}
				isCurrentBalanceVisible={isCurrentBalanceVisible}
			/>
		</Modal>
	);
};

interface FormProps {
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
}: FormProps) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				maxBalance: branchProduct.max_balance,
				currentBalance: branchProduct.current_balance,
			},
			Schema: Yup.object().shape({
				maxBalance: Yup.number()
					.required()
					.moreThan(0)
					.test(
						'is-whole-number',
						'Non-weighing items require whole number quantity.',
						(value) =>
							branchProduct.product.unit_of_measurement ===
							unitOfMeasurementTypes.NON_WEIGHING
								? isInteger(Number(value))
								: true,
					)
					.label('Max Balance'),
				currentBalance: isCurrentBalanceVisible
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
			onSubmit={(formData) => {
				onSubmit({
					...formData,
					// NOTE: Hidden fields must be visible in order to be saved.
					currentBalance: isCurrentBalanceVisible
						? formData.currentBalance
						: undefined,
				});
			}}
			enableReinitialize
		>
			<Form>
				<DetailsRow>
					<Col span={24}>
						<FormInputLabel type="number" id="maxBalance" label="Max Balance" />
						<ErrorMessage
							name="maxBalance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					{isCurrentBalanceVisible && (
						<>
							<Divider dashed>HIDDEN FIELDS</Divider>

							<Col span={24}>
								<FormInputLabel
									type="number"
									id="currentBalance"
									label="Current Balance"
									isWholeNumber={
										branchProduct?.product?.unit_of_measurement ===
										unitOfMeasurementTypes.NON_WEIGHING
									}
								/>
								<ErrorMessage
									name="currentBalance"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						</>
					)}
				</DetailsRow>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						disabled={isLoading}
					/>
					<Button
						type="submit"
						text="Edit"
						variant="primary"
						loading={isLoading}
					/>
				</div>
			</Form>
		</Formik>
	);
};
