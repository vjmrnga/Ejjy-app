import React from 'react';
import { calculateTableHeight } from '../../utils/function';
import { ROW_HEIGHT } from '../Table/Table';
import './style.scss';

interface Column {
	name: string;
	width?: string;
}

interface Props {
	columns: Column[];
	data: any;
}

export const TableNormal = ({ columns, data }: Props) => {
	return (
		<div className="TableNormal" style={{ height: calculateTableHeight(data?.length + 1) + 25 }}>
			<table>
				<thead>
					<tr>
						{columns.map(({ name, width }) => (
							<th style={{ width }}>{name}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((items, index) => (
						<tr key={index} style={{ height: `${ROW_HEIGHT}px` }}>
							{items.map((item) => (
								<td>{item}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
