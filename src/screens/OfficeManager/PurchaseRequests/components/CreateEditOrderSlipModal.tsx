import { Col, Divider, Modal, Row } from 'antd';
import React from 'react';
import { FieldError, Label, Select } from '../../../../components/elements';
import { formatDateTime } from '../../../../utils/function';
import { CreateEditOrderSlipForm } from './CreateEditOrderSlipForm';

interface Props {
	// TODO:: FINALIZE
	requestedProducts: any;
	branchOptions: any;
	onChangePreparingBranch: any;
	assignedPersonnelOptions: any;
	purchaseRequest: any;

	visible: boolean;
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreateEditOrderSlipModal = ({
	requestedProducts,
	branchOptions,
	onChangePreparingBranch,
	assignedPersonnelOptions,
	purchaseRequest,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => (
	<Modal
		title="[CREATE] F-OS1"
		visible={visible}
		footer={null}
		onCancel={onClose}
		centered
		closable
	>
		{errors.map((error, index) => (
			<FieldError key={index} error={error} />
		))}

		<Row>
			<Col span={24} lg={12}>
				<Row gutter={[15, 15]} align="middle">
					<Col span={12}>
						<Label label="Date &amp; Time Created" />
					</Col>
					<Col span={12}>
						<strong>{formatDateTime(purchaseRequest?.datetime_created)}</strong>
					</Col>
				</Row>
				<Row gutter={[15, 15]} align="middle">
					<Col span={12}>
						<Label label="Requesting Branch" />
					</Col>
					<Col span={12}>
						<strong>{purchaseRequest?.requesting_user?.branch.name}</strong>
					</Col>
				</Row>
			</Col>

			<Col span={24} lg={12}>
				<Row gutter={[15, 15]}>
					<Col span={12}>
						<Label label="F-RS1" />
					</Col>
					<Col span={12}>
						<strong>{purchaseRequest?.id}</strong>
					</Col>
				</Row>
			</Col>
		</Row>

		<Divider dashed />

		<Row gutter={[15, 15]} align="middle">
			<Col span={12}>
				<Label label="Requested Products" />
			</Col>
			<Col span={12}>
				<Select
					placeholder="Select Branch"
					options={branchOptions}
					onChange={onChangePreparingBranch}
				/>
			</Col>
		</Row>

		<CreateEditOrderSlipForm
			requestedProducts={requestedProducts}
			assignedPersonnelOptions={assignedPersonnelOptions}
			onSubmit={onSubmit}
			onClose={onClose}
			loading={loading}
		/>
	</Modal>
);

CreateEditOrderSlipModal.defaultProps = {
	loading: false,
};
