import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Content, TableActions, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { sleep } from 'utils';
import { CreateEditBranchModal } from './components/Branch/CreateEditBranchModal';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', width: 150, fixed: 'left' },
	{ title: 'Online URL', dataIndex: 'url' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const Branches = () => {
	// STATES
	const [data, setData] = useState([]);
	const [createEditBranchModalVisible, setCreateEditBranchModalVisible] =
		useState(false);
	const [selectedBranch, setSelectedBranch] = useState(null);

	// CUSTOM HOOKS
	const { branches, getBranches, removeBranch, status } = useBranches();

	// EFFECTS
	useEffect(() => {
		getBranches();
	}, []);

	// Effect: Format branches to be rendered in Table
	useEffect(() => {
		const formattedBranches = branches.map((branch) => {
			const { id, name, online_url } = branch;

			return {
				name: <Link to={`branches/${id}`}>{name}</Link>,
				url: online_url,
				actions: (
					<TableActions
						onEdit={() => onEdit(branch)}
						onRemove={() => removeBranch(id)}
					/>
				),
			};
		});

		sleep(500).then(() => setData(formattedBranches));
	}, [branches]);

	const onCreate = () => {
		setSelectedBranch(null);
		setCreateEditBranchModalVisible(true);
	};

	const onEdit = (branch) => {
		setSelectedBranch(branch);
		setCreateEditBranchModalVisible(true);
	};

	return (
		<Content className="Branches" title="Branches">
			<Box>
				<TableHeader buttonName="Create Branch" onCreate={onCreate} />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
					pagination={false}
					loading={status === request.REQUESTING}
				/>

				<CreateEditBranchModal
					branch={selectedBranch}
					visible={createEditBranchModalVisible}
					onClose={() => setCreateEditBranchModalVisible(false)}
				/>
			</Box>
		</Content>
	);
};
