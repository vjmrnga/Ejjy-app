import cn from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { AddIcon } from '../..';
import { Button, SearchInput, Select } from '../../elements';
import { Option } from '../../elements/Select/Select';
import { Pending } from '../../Pending/Pending';
import './style.scss';

const SEARCH_DEBOUNCE_TIME = 250; // 250ms

interface Props {
	title?: string;
	buttonName?: string;
	onCreateDisabled?: boolean;
	onCreateTooltip?: string;
	onCreate?: any;
	pending?: number;

	searchPlaceholder?: string;
	onSearch?: any;
	searchDisabled?: boolean;

	statuses?: Option[];
	onStatusSelect?: any;
	statusDisabled?: boolean;
}

export const TableHeader = ({
	title,

	buttonName,
	onCreateDisabled,
	onCreateTooltip,

	onCreate,
	pending,

	searchPlaceholder,
	onSearch,
	searchDisabled,

	statuses,
	onStatusSelect,
	statusDisabled,
}: Props) => {
	const debounceSearchedChange = useCallback(
		debounce((keyword) => onSearch(keyword), SEARCH_DEBOUNCE_TIME),
		[onSearch],
	);

	return (
		<div className="TableHeader">
			{title && <p className="title">{title}</p>}
			<div
				className={cn('controls', {
					'no-title': !title,
					'only-button': !title && !onSearch,
				})}
			>
				<div className="main-controls">
					{onSearch && (
						<SearchInput
							classNames="search-input"
							placeholder={searchPlaceholder}
							onChange={(event) => {
								debounceSearchedChange(event.target.value.trim());
							}}
							disabled={searchDisabled}
						/>
					)}

					{onStatusSelect && (
						<Select
							classNames="status-select"
							options={statuses}
							placeholder="Status"
							onChange={onStatusSelect}
							disabled={statusDisabled}
						/>
					)}
				</div>

				<div className="pending-button">
					{pending >= 0 && <Pending value={pending} />}

					{onCreate && (
						<Button
							text={buttonName}
							variant="primary"
							onClick={onCreate}
							iconDirection="left"
							icon={<AddIcon />}
							disabled={onCreateDisabled}
							tooltip={onCreateTooltip}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

TableHeader.defaultProps = {
	title: null,
	onSearch: null,
	onCreate: null,
	searchPlaceholder: 'Search',
};
