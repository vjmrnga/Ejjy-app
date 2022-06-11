import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { RequestErrors } from '../../../../../components';
import { FieldError } from '../../../../../components/elements';
import { types } from '../../../../../ducks/OfficeManager/branches';
import { request } from '../../../../../global/types';
import { useBranches } from '../../../../../hooks/useBranches';
import { convertIntoArray } from 'utils';
import { CreateEditBranchForm } from './CreateEditBranchForm';

interface Props {
	visible: boolean;
	branch: any;
	onClose: any;
}

export const CreateEditBranchModal = ({ branch, visible, onClose }: Props) => {
	const { createBranch, editBranch, status, errors, recentRequest, reset } =
		useBranches();

	// Effect: Close modal if recent requests are Create or Edit
	useEffect(() => {
		const reloadListTypes = [types.CREATE_BRANCH, types.EDIT_BRANCH];
		if (status === request.SUCCESS && reloadListTypes.includes(recentRequest)) {
			reset();
			onClose();
		}
	}, [status, recentRequest, reset, onClose]);

	return (
		<Modal
			title={branch ? '[Edit] Branch' : '[Create] Branch'}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<CreateEditBranchForm
				branch={branch}
				onSubmit={branch ? editBranch : createBranch}
				onClose={onClose}
				loading={status === request.REQUESTING}
			/>
		</Modal>
	);
};
