import { Col, Divider, Modal, Row } from 'antd';
import React from 'react';
import { Button, Label } from '../../../../components/elements';

interface Props {
	visible: boolean;
	orderSlip: any;
	onClose: any;
}

export const ViewOrderSlipModal = ({ orderSlip, visible, onClose }: Props) => {
	const renderDetail = (label, value) => (
		<Col sm={12} xs={24}>
			<Row gutter={{ sm: 15, xs: 0 }}>
				<Col sm={16} xs={24}>
					<Label label={label} />
				</Col>
				<Col sm={8} xs={24}>
					<span>{value}</span>
				</Col>
			</Row>
		</Col>
	);

	return (
		<Modal
			title="View Order Slip"
			visible={visible}
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			centered
			closable
		>
			<Row gutter={[15, 15]}>
				{renderDetail('Date & Time Requested', 'a')}
				{renderDetail('F-RS1', 'a')}
				{renderDetail('Requesting Branch', 'a')}
				{renderDetail('F-OS1', 'a')}
				{renderDetail('Created By', 'a')}
				{renderDetail('Status', 'a')}
				<Divider dashed />
			</Row>
		</Modal>
	);
};
