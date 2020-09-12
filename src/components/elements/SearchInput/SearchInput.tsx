import { SearchOutlined } from '@ant-design/icons';
import * as React from 'react';
import './style.scss';
import cn from 'classnames';

interface Props {
	placeholder?: string;
	onChange: any;
	classNames: any;
}

const SearchInput = ({ onChange, placeholder, classNames }: Props) => (
	<div className={cn('SearchInput', classNames)}>
		<SearchOutlined className="icon" />
		<input onChange={onChange} placeholder={placeholder} />
	</div>
);

export default SearchInput;
