import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../components';
import { request } from '../../../../global/types';
import { useBranchMachines } from '../../../../hooks/useBranchMachines';
import { convertIntoArray } from '../../../../utils/function';
import { ModifyBranchMachineForm } from './ModifyBranchMachineForm';

interface Props {
	branchMachine: any;
	onClose: any;
}

export const ModifyBranchMachineModal = ({ branchMachine, onClose }: Props) => {
	const {
		createBranchMachine,
		editBranchMachine,
		status: branchMachineStatus,
		errors,
	} = useBranchMachines();

	const onSubmit = (formData) => {
		const modifyBranchMachine = branchMachine
			? editBranchMachine
			: createBranchMachine;

		modifyBranchMachine(formData, ({ status }) => {
			if (status === request.SUCCESS) {
				onClose();
			}
		});
	};

	return (
		<Modal
			title={`${branchMachine ? '[Edit]' : '[Create]'} Branch Machine`}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<ModifyBranchMachineForm
				branchMachine={branchMachine}
				loading={branchMachineStatus === request.REQUESTING}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};
