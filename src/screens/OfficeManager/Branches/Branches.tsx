/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, TableActions, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { types } from '../../../ducks/OfficeManager/branches';
import { request } from '../../../global/types';
import { calculateTableHeight, sleep } from '../../../utils/function';
import { useBranches } from '../hooks/useBranches';
import { CreateEditBranchModal } from './components/CreateEditBranchModal';
import './style.scss';

const columns = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const Branches = () => {
	const [data, setData] = useState([]);
	const [createEditBranchModalVisible, setCreateEditBranchModalVisible] = useState(false);
	const [selectedBranch, setSelectedBranch] = useState(null);

	const {
		branches,
		createBranch,
		editBranch,
		removeBranch,
		status,
		errors,
		recentRequest,
	} = useBranches();

	// Effect: Format branches to be rendered in Table
	useEffect(() => {
		const formattedBranches = branches.map((branch) => {
			const { id, name } = branch;

			return {
				name: <Link to={`/branches/${id}`}>{name}</Link>,
				actions: <TableActions onEdit={() => onEdit(branch)} onRemove={() => removeBranch(id)} />,
			};
		});

		sleep(500).then(() => setData(formattedBranches));
	}, [branches]);

	// Effect: Reload the list if recent requests are Create, Edit or Remove
	useEffect(() => {
		const reloadListTypes = [types.CREATE_BRANCH, types.EDIT_BRANCH];

		if (status === request.SUCCESS && reloadListTypes.includes(recentRequest)) {
			setCreateEditBranchModalVisible(false);
			setSelectedBranch(null);
		}
	}, [status, recentRequest]);

	const onCreate = () => {
		setSelectedBranch(null);
		setCreateEditBranchModalVisible(true);
	};

	const onEdit = (branch) => {
		setSelectedBranch(branch);
		setCreateEditBranchModalVisible(true);
	};

	return (
		<Container title="Branches">
			<section className="Branches">
				<Box>
					<TableHeader buttonName="Create Branch" onCreate={onCreate} />

					<Table
						columns={columns}
						dataSource={data}
						scroll={{ y: calculateTableHeight(data.length), x: '100%' }}
						loading={status === request.REQUESTING}
					/>

					<CreateEditBranchModal
						branch={selectedBranch}
						visible={createEditBranchModalVisible}
						onSubmit={selectedBranch ? editBranch : createBranch}
						onClose={() => setCreateEditBranchModalVisible(false)}
						errors={errors}
						loading={status === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default Branches;
