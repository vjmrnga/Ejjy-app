/* eslint-disable no-confusing-arrow */
import { Spin, Tooltip } from 'antd';
import cn from 'classnames';
import React, { ReactNode, useEffect, useRef } from 'react';
import { NOT_FOUND_INDEX, ROW_HEIGHT } from '../../global/constants';
import { calculateTableHeight } from '../../utils/function';
import './style.scss';

interface Column {
	name: string | ReactNode;
	width?: string;
	center?: boolean;
	tooltip?: string;
}

interface Props {
	columns: Column[];
	data: any;
	activeRow?: number;
	loading?: boolean;
	displayInPage?: boolean;
	hasCustomHeaderComponent?: boolean;
}

export const TableNormal = ({
	columns,
	data,
	activeRow,
	loading,
	displayInPage,
	hasCustomHeaderComponent,
}: Props) => {
	const rowRefs = useRef([]);

	// Effect: Focus active item
	useEffect(() => {
		if (activeRow !== NOT_FOUND_INDEX) {
			rowRefs.current?.[activeRow]?.focus();
		}
	}, [activeRow]);

	return (
		<Spin spinning={loading}>
			<div
				className={cn('TableNormal', {
					page: displayInPage,
					hasCustomHeaderComponent,
				})}
				style={{ height: calculateTableHeight(data?.length + 1) + 25 }}
			>
				<table>
					<thead>
						<tr>
							{columns.map(
								({ name, width, center = false, tooltip = null }, index) => (
									<th
										key={`th-${index}`}
										style={{ width, textAlign: center ? 'center' : 'left' }}
									>
										{tooltip ? <Tooltip title={tooltip}>{name}</Tooltip> : name}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{data?.map((row, rowIndex) =>
							row?.isCustom ? (
								<tr
									key={`tr-${rowIndex}`}
									style={{ height: `${row?.height || ROW_HEIGHT}px` }}
								>
									<td colSpan={row.span} key={`td-${rowIndex}`}>
										{row.content}
									</td>
								</tr>
							) : (
								<tr
									ref={(el) => {
										rowRefs.current[rowIndex] = el;
									}}
									className={cn({ active: rowIndex === activeRow })}
									tabIndex={rowIndex}
									key={`tr-${rowIndex}`}
									style={{ height: `${ROW_HEIGHT}px` }}
								>
									{row
										.filter((item) => !item?.isHidden)
										.map((item, columnIndex) => (
											<td
												key={`td-${columnIndex}`}
												style={{
													textAlign: columns?.[columnIndex].center
														? 'center'
														: 'left',
												}}
											>
												{item}
											</td>
										))}
								</tr>
							),
						)}
					</tbody>
				</table>
			</div>
		</Spin>
	);
};

TableNormal.defaultProps = {
	loading: false,
	displayInPage: false,
	activeRow: NOT_FOUND_INDEX,
};
