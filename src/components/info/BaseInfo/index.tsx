import { QuestionOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import './style.scss';

interface Props {
	children: any;
}

export const BaseInfo = ({ children }: Props) => {
	// STATES
	const [isInfoVisible, setIsInfoVisible] = useState(false);

	return (
		<div className="BaseInfo">
			<Tooltip placement="left" title="Page Information">
				<Button
					className="BaseInfo__button"
					icon={<QuestionOutlined />}
					shape="circle"
					size="large"
					onClick={() => setIsInfoVisible(true)}
				/>
			</Tooltip>

			{isInfoVisible && (
				<Modal
					className="Modal__large Modal__hasFooter Modal__baseInfo"
					footer={[<Button key="close">Close</Button>]}
					title="Page Information"
					centered
					closable
					visible
					onCancel={() => setIsInfoVisible(false)}
				>
					{children}
				</Modal>
			)}
		</div>
	);
};
