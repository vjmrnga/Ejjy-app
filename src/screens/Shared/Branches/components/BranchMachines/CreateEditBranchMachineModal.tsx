import { Modal } from 'antd';
import React from 'react';

interface Props {
	branchId: any;
	branchMachine: any;
	visible: boolean;
	onClose: any;
}

// TODO: Refactor this once we start doing the online version of the app
export const CreateEditBranchMachineModal = ({
	branchId,
	branchMachine,
	visible,
	onClose,
}: Props) => {
	// const {
	// 	createBranchMachine,
	// 	editBranchMachine,
	// 	status,
	// 	errors,
	// 	recentRequest,
	// 	reset,
	// } = useBranchMachines();

	// // Effect: Close modal if recent requests are Create, Edit or Remove
	// useEffect(() => {
	// 	if (
	// 		status === request.SUCCESS &&
	// 		[types.CREATE_BRANCH_MACHINE, types.EDIT_BRANCH_MACHINE].includes(
	// 			recentRequest,
	// 		)
	// 	) {
	// 		onClose();
	// 		reset();
	// 	}
	// }, [status, recentRequest]);

	// const onSubmit = (formData) => {
	// 	const data = {
	// 		...formData,
	// 		branchId,
	// 	};

	// 	if (branchMachine) {
	// 		editBranchMachine(data);
	// 	} else {
	// 		createBranchMachine(data);
	// 	}
	// };

	return (
		<Modal
			title={`${branchMachine ? '[Edit]' : '[Create]'} Branch Machine`}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{/* <RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<CreateEditBranchMachineForm
				branchMachine={branchMachine}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={status === request.REQUESTING}
			/> */}
		</Modal>
	);
};
