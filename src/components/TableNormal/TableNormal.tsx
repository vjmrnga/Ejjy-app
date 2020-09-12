import React from 'react';
import './style.scss';

export const TableNormal = ({ columns, data }) => {
	return (
		<table className="TableNormal">
			<thead>
				<tr>
					{columns.map(({ name, width }) => (
						<th style={{ width }}>{name}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((items, index) => (
					<tr key={index}>
						{items.map((item) => (
							<td>{item}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
