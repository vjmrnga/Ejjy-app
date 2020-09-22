import { Col, Divider, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { FieldError, Label } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { usePreparationSlips } from '../../hooks/usePreparationSlips';
import { FulfillPreparationSlipForm } from './FulfillPreparationSlipForm';
import { PreparationSlipDetails } from './PreparationSlipDetails';

interface Props {
	preparationSlip: any;
	visible: boolean;
	onClose: any;
}

export const FulfillPreparationSlipModal = ({ preparationSlip, visible, onClose }: Props) => {
	const { editPreparationSlip, status, errors } = usePreparationSlips();

	useEffect(() => {}, [preparationSlip]);

	const onFulfill = (data) => {};

	return (
		<Modal
			title="Fulfill Preparation Slip"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<PreparationSlipDetails preparationSlip={preparationSlip} />

			<div className="requested-products">
				<Divider dashed />
				<Row gutter={[15, 15]} align="middle">
					<Col span={24}>
						<Label label="Requested Products" />
					</Col>
				</Row>
			</div>

			<FulfillPreparationSlipForm
				preparationSlip={preparationSlip}
				requestedProducts={[]}
				onSubmit={onFulfill}
				onClose={onClose}
				loading={status === request.REQUESTING}
			/>
		</Modal>
	);
};
