import { Modal } from 'antd';
import React from 'react';
import { FieldError } from '../../../../components/elements';
import { CreateEditBranchForm } from './CreateEditBranchForm';

interface Props {
	visible: boolean;
	branch: any;
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreateEditBranchModal = ({
	branch,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => {
	return (
		<Modal
			title={branch ? 'Edit Branch' : 'Create Branch'}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<CreateEditBranchForm
				branch={branch}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={loading}
			/>
		</Modal>
	);
};

CreateEditBranchModal.defaultProps = {
	loading: false,
};
