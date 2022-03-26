import { ColumnsType } from 'antd/lib/table';
import React from 'react';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name', width: 150, fixed: 'left' },
	{ title: 'Machine ID', dataIndex: 'machine_id', key: 'machine_id' },
	{ title: 'Serial', dataIndex: 'serial', key: 'serial' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

interface Props {
	branchId: any;
}

// TODO: Refactor this once we start doing the online version of the app
export const ViewBranchMachines = ({ branchId }: Props) => {
	// STATES
	// const [data, setData] = useState([]);
	// const [selectedBranchMachine, setSelectedBranchMachine] = useState(null);
	// const [
	// 	createEditBranchMachineModalVisible,
	// 	setCreateEditBranchMachineModalVisible,
	// ] = useState(false);

	// // CUSTOM HOOKS
	// const { branchMachines, getBranchMachines, status, errors, warnings } =
	// 	useBranchMachines();

	// // METHODS
	// useEffect(() => {
	// 	getBranchMachines(branchId);
	// }, []);

	// // Effect: Format branch machines to be rendered in Table
	// useEffect(() => {
	// 	const formattedBranchMachines = branchMachines.map((branchMachine) => {
	// 		const { name, machine_id, machine_printer_serial_number } = branchMachine;

	// 		return {
	// 			name: name || EMPTY_CELL,
	// 			machine_id: machine_id || EMPTY_CELL,
	// 			serial: machine_printer_serial_number || EMPTY_CELL,
	// 			actions: <TableActions onEdit={() => onEdit(branchMachine)} />,
	// 		};
	// 	});

	// 	setData(formattedBranchMachines);
	// }, [branchMachines]);

	// const onCreate = () => {
	// 	setSelectedBranchMachine(null);
	// 	setCreateEditBranchMachineModalVisible(true);
	// };

	// const onEdit = (branchMachine) => {
	// 	setSelectedBranchMachine(branchMachine);
	// 	setCreateEditBranchMachineModalVisible(true);
	// };

	return (
		<>
			{/* <TableHeader
				title="Machines"
				buttonName="Create Branch Machine"
				onCreate={onCreate}
			/>

			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 1000 }}
				pagination={false}
				loading={status === request.REQUESTING}
			/>

			<CreateEditBranchMachineModal
				visible={createEditBranchMachineModalVisible}
				branchId={branchId}
				branchMachine={selectedBranchMachine}
				onClose={() => setCreateEditBranchMachineModalVisible(false)}
			/> */}
		</>
	);
};
