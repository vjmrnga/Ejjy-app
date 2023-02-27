import { useBranches } from 'hooks';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';

interface Props {
	returnItemSlip: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

// TODO: Requires refactoring once this feature is revisited
export const AssignReturnItemSlipForm = ({
	returnItemSlip,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// CUSTOM HOOKS
	const {
		data: { branches },
	} = useBranches();
	// const {
	// 	users,
	// 	getOnlineUsers,
	// 	status: usersStatus,
	// 	errors: usersErrors,
	// } = useUsers();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branch_id: null,
				receiver_id: null,
			},
			Schema: Yup.object().shape({
				branch_id: Yup.number().nullable().required().label('Branch'),
				receiver_id: Yup.number().nullable().required().label('Receiver'),
			}),
		}),
		[],
	);

	return (
		<>
			{/* <RequestErrors errors={convertIntoArray(usersErrors)} withSpaceBottom /> */}

			{/* <Formik
				initialValues={getFormDetails().DefaultValues}
				validationSchema={getFormDetails().Schema}
				onSubmit={async (formData) => {
					setSubmitting(true);
					await sleep(500);
					setSubmitting(false);

					onSubmit(formData);
				}}
			>
				{({ values, setFieldValue }) => (
					<Form>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<Label label="Branches" spacing />
								<Select
									className="w-100"
									filterOption={filterOption}
									optionFilterProp="children"
									showSearch
									onChange={(value) => {
										// TODO: Requires refactoring once this feature is revisited
										getOnlineUsers(
											{
												branchId: value,
												userType: userTypes.BRANCH_MANAGER,
												page: 1,
												pageSize: MAX_PAGE_SIZE,
											},
											true,
										);
										setFieldValue('branch_id', value);
										setFieldValue('receiver_id', null);
									}}
								>
									{branches
										.filter(({ id }) => returnItemSlip.sender.branch.id !== id)
										.map(({ id, name }) => (
											<Select.Option key={id} value={id}>
												{name}
											</Select.Option>
										))}
								</Select>
								<ErrorMessage
									name="branch_id"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>

							<Col span={24}>
								<Label label="Receiver (User)" spacing />
								<Select
									className="w-100"
									disabled={usersStatus === request.REQUESTING}
									filterOption={filterOption}
									loading={usersStatus === request.REQUESTING}
									optionFilterProp="children"
									value={values.receiver_id}
									showSearch
									onChange={(value) => setFieldValue('receiver_id', value)}
								>
									{users.map(({ id, first_name, last_name }) => (
										<Select.Option key={id} value={id}>
											{`${first_name} ${last_name}`}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="receiver_id"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						</Row>

						<div className="ModalCustomFooter">
							<Button
								disabled={
									loading || isSubmitting || usersStatus === request.REQUESTING
								}
								text="Cancel"
								type="button"
								onClick={onClose}
							/>
							<Button
								disabled={usersStatus === request.REQUESTING}
								loading={loading || isSubmitting}
								text="Assign"
								type="submit"
								variant="primary"
							/>
						</div>
					</Form>
				)}
			</Formik> */}
		</>
	);
};
