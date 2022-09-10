import { QuestionOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './style.scss';

interface Props {
	markdown: any;
}

export const BasePageInfo = ({ markdown }: Props) => {
	// STATES
	const [isInfoVisible, setIsInfoVisible] = useState(false);
	const [content, setContent] = useState('');

	// METHODS
	useEffect(() => {
		fetch(markdown)
			.then((res) => res.text())
			.then((text) => setContent(text));
	});

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
					className="Modal__hasFooter Modal__baseInfo"
					footer={[
						<Button key="close" onClick={() => setIsInfoVisible(false)}>
							Close
						</Button>,
					]}
					title="Page Information"
					width={800}
					centered
					closable
					visible
					onCancel={() => setIsInfoVisible(false)}
				>
					<ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
				</Modal>
			)}
		</div>
	);
};
