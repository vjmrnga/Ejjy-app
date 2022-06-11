/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
import { HomeOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FieldWarning,
	FormSelect,
	Label,
} from '../../../../components/elements';
import { Option } from '../../../../components/elements/Select/Select';
import { NO_BRANCH_ID } from '../../../../global/constants';
import { userTypeOptions } from '../../../../global/options';
import { sleep } from 'utils';

const tabs = {
	BRANCH: 'branch',
	USER_TYPE: 'userType',
};

interface Props {
	user: any;
	branchOptions: Option[];
	onEditUserBranch: any;
	onEditUserType: any;
	onClose: any;
	loading: boolean;
}

export const EditUserForm = ({
	user,
	branchOptions,
	onEditUserBranch,
	onEditUserType,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);
	const [currentActiveKey, setCurrentActiveKey] = useState(tabs.BRANCH);

	// METHODS
	useEffect(() => {
		setCurrentActiveKey(tabs.BRANCH);
	}, [user]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId: user?.branch?.id || branchOptions?.[0]?.value,
				newUserType: user.user_type,
			},
			Schema: Yup.object().shape({
				branchId: Yup.number().test(
					'Unchanged branch',
					"The branch selected is still user's current branch. Please select a new one.",
					(value: number) => {
						if (currentActiveKey === tabs.BRANCH) {
							return value !== user?.branch?.id;
						}

						return true;
					},
				),
				newUserType: Yup.string().test(
					'Unchanged user type',
					"The user type selected is still user's current user type. Please select a new one.",
					(value: string) => {
						if (currentActiveKey === tabs.USER_TYPE) {
							return value !== user.user_type;
						}

						return true;
					},
				),
			}),
		}),
		[user, branchOptions, currentActiveKey],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				if (currentActiveKey === tabs.BRANCH) {
					onEditUserBranch(
						{ id: user?.id, branchId: formData.branchId },
						resetForm,
					);
				} else if (currentActiveKey === tabs.USER_TYPE) {
					onEditUserType(
						{ id: user?.id, newUserType: formData.newUserType },
						resetForm,
					);
				}
			}}
			enableReinitialize
		>
			<Form>
				<FieldWarning
					message={
						<span>
							You can only edit the user type if selected user&apos;s current
							branch is <b>&quot;No Branch&quot;</b>
						</span>
					}
					withSpaceBottom
				/>
				<Tabs
					activeKey={currentActiveKey}
					type="card"
					onTabClick={(key) => {
						setCurrentActiveKey(key);
					}}
				>
					<Tabs.TabPane
						key={tabs.BRANCH}
						tab={
							<span>
								<HomeOutlined />
								Branch
							</span>
						}
					>
						<Label label="Branch" spacing />
						<FormSelect id="branchId" options={branchOptions} />
						<ErrorMessage
							name="branchId"
							render={(error) => <FieldError error={error} />}
						/>
					</Tabs.TabPane>

					{user?.branch?.id === NO_BRANCH_ID && (
						<Tabs.TabPane
							key={tabs.USER_TYPE}
							tab={
								<span>
									<UserSwitchOutlined />
									User Type
								</span>
							}
						>
							<Label label="Type" spacing />
							<FormSelect id="newUserType" options={userTypeOptions} />
							<ErrorMessage
								name="newUserType"
								render={(error) => <FieldError error={error} />}
							/>
						</Tabs.TabPane>
					)}
				</Tabs>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
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
