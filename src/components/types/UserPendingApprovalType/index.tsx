import { Tag } from 'antd';
import { EMPTY_CELL, userPendingApprovalTypes } from 'global';
import React from 'react';

export const UserPendingApprovalType = ({ type }) => {
	let text = null;

	switch (type) {
		case userPendingApprovalTypes.CREATE: {
			text = 'Pending: User Creation';
			break;
		}
		case userPendingApprovalTypes.UPDATE_USER_TYPE: {
			text = 'Pending: User Type Update';
			break;
		}
		case userPendingApprovalTypes.DELETE: {
			text = 'Pending: User Deletion';
			break;
		}
		default: {
			text = null;
		}
	}

	return text === null ? (
		<span>{EMPTY_CELL}</span>
	) : (
		<Tag color="orange">{text}</Tag>
	);
};
