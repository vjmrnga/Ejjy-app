import { Col, Divider, Modal, Row } from 'antd';
import React from 'react';
import { FieldError, Label } from '../../../../components/elements';
import { CreateEditOrderSlipForm } from './CreateEditOrderSlipForm';

interface Props {
	// TODO:: FINALIZE
	requestedProducts: any;
	branchesOptions: any;
	assignedPersonnelOptions: any;
	dateTimeRequested: any;
	requestingBranch: any;
	purchaseRequestId: any;

	visible: boolean;
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreateEditOrderSlipModal = ({
	requestedProducts,
	branchesOptions,
	assignedPersonnelOptions,
	dateTimeRequested,
	requestingBranch,
	purchaseRequestId,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => {
	return (
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
							<strong>{dateTimeRequested}</strong>
						</Col>
					</Row>
					<Row gutter={[15, 15]} align="middle">
						<Col span={12}>
							<Label label="Requesting Branch" />
						</Col>
						<Col span={12}>
							<strong>{requestingBranch}</strong>
						</Col>
					</Row>
				</Col>

				<Col span={24} lg={12}>
					<Row gutter={[15, 15]}>
						<Col span={12}>
							<Label label="F-RS1" />
						</Col>
						<Col span={12}>
							<strong>{purchaseRequestId}</strong>
						</Col>
					</Row>
				</Col>
			</Row>

			<Divider dashed />

			<Label label="Requested Products" />

			<CreateEditOrderSlipForm
				requestedProducts={requestedProducts}
				branchesOptions={branchesOptions}
				assignedPersonnelOptions={assignedPersonnelOptions}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={loading}
			/>
		</Modal>
	);
};

CreateEditOrderSlipModal.defaultProps = {
	loading: false,
};
