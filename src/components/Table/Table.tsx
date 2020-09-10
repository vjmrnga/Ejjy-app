import React, { useState, useEffect, useRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import { Table as AntdTable } from 'antd';
import './style.scss';

const ROW_HEIGHT = 65;

const Table = (props) => {
	const { columns, scroll } = props;
	const [tableWidth, setTableWidth] = useState(0);

	const widthColumnCount = columns.filter(({ width }) => !width).length;
	const mergedColumns = columns.map((column) => {
		if (column.width) {
			return column;
		}

		return {
			...column,
			width: Math.floor(tableWidth / widthColumnCount),
		};
	});

	const gridRef = useRef<any>();
	const [connectObject] = useState<any>(() => {
		const obj = {};
		Object.defineProperty(obj, 'scrollLeft', {
			get: () => null,
			set: (scrollLeft: number) => {
				if (gridRef.current) {
					gridRef.current.scrollTo({ scrollLeft });
				}
			},
		});

		return obj;
	});

	const resetVirtualGrid = () => {
		gridRef.current.resetAfterIndices({
			columnIndex: 0,
			shouldForceUpdate: false,
		});
	};

	useEffect(() => resetVirtualGrid, [tableWidth]);

	const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
		ref.current = connectObject;

		return (
			<Grid
				ref={gridRef}
				className="virtual-grid"
				columnCount={mergedColumns.length}
				columnWidth={(index) => {
					const { width } = mergedColumns[index];

					return index === mergedColumns.length - 1 ? width - scrollbarSize - 1 : width;
				}}
				height={scroll.y}
				rowCount={rawData.length}
				rowHeight={() => ROW_HEIGHT}
				width={tableWidth}
				onScroll={({ scrollLeft }) => {
					onScroll({ scrollLeft });
				}}
			>
				{({ columnIndex, rowIndex, style }) => (
					<div
						className={classNames('virtual-table-cell', {
							'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
						})}
						style={style}
					>
						{rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
					</div>
				)}
			</Grid>
		);
	};

	return (
		<ResizeObserver
			onResize={({ width }) => {
				setTableWidth(width);
			}}
		>
			<AntdTable
				{...props}
				className="VirtualTable"
				columns={mergedColumns}
				pagination={false}
				components={{ body: renderVirtualList }}
			/>
		</ResizeObserver>
	);
};

export default Table;