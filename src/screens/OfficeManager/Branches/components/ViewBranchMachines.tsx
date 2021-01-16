/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { TableHeader, TableNormal } from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';

interface Props {
	branchMachines: any;
}

const columns = [{ name: 'Name' }, { name: 'Machine ID' }, { name: 'Printer Serial #' }];

export const ViewBranchMachines = ({ branchMachines }: Props) => {
	// States
	const [tableData, setTableData] = useState([]);

	// Effect: Format branch machines to be rendered in Table
	useEffect(() => {
		const formattedBranchMachines = branchMachines.map((branchMachine) => {
			const { name, machine_id, machine_printer_serial_number } = branchMachine;

			return [
				name || EMPTY_CELL,
				machine_id || EMPTY_CELL,
				machine_printer_serial_number || EMPTY_CELL,
			];
		});

		setTableData(formattedBranchMachines);
	}, [branchMachines]);

	return (
		<>
			<TableHeader title="Machines" />

			<TableNormal columns={columns} data={tableData} />
		</>
	);
};
