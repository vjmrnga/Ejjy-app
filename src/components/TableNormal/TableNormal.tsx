import { Spin } from 'antd';
import React, { ReactNode } from 'react';
import { calculateTableHeight } from '../../utils/function';
import { ROW_HEIGHT } from '../Table/Table';
import './style.scss';
import cn from 'classnames';

interface Column {
	name: string | ReactNode;
	width?: string;
	center?: boolean;
}

interface Props {
	columns: Column[];
	data: any;
	loading?: boolean;
	displayInPage?: boolean;
}

export const TableNormal = ({ columns, data, loading, displayInPage }: Props) => {
	return (
		<Spin size="large" spinning={loading}>
			<div
				className={cn('TableNormal', { page: displayInPage })}
				style={{ height: calculateTableHeight(data?.length + 1) + 25 }}
			>
				<table>
					<thead>
						<tr>
							{columns.map(({ name, width, center = false }, index) => (
								<th key={`th-${index}`} style={{ width, textAlign: center ? 'center' : 'left' }}>
									{name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, index) => {
							if (row?.isCustom) {
								return (
									<tr key={`tr-${index}`} style={{ height: `${row?.height || ROW_HEIGHT}px` }}>
										<td colSpan={row.span} key={`td-${index}`}>
											{row.content}
										</td>
									</tr>
								);
							} else {
								return (
									<tr key={`tr-${index}`} style={{ height: `${ROW_HEIGHT}px` }}>
										{row.map((item, index) => (
											<td
												key={`td-${index}`}
												style={{ textAlign: columns?.[index].center ? 'center' : 'left' }}
											>
												{item}
											</td>
										))}
									</tr>
								);
							}
						})}
					</tbody>
				</table>
			</div>
		</Spin>
	);
};

TableNormal.defaultProps = {
	loading: false,
	displayInPage: false,
};
