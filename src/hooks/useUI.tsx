import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/ui';
import { useActionDispatch } from './useActionDispatch';

export const useUI = () => {
	// SELECTORS
	const isSidebarCollapsed = useSelector(selectors.selectIsSidebarCollapsed());

	// ACTIONS
	const handleCollapseSidebar = useActionDispatch(actions.onCollapseSidebar);

	return {
		isSidebarCollapsed,
		onCollapseSidebar: handleCollapseSidebar,
	};
};
