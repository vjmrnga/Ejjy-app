import React from 'react';
import { Content } from 'components';
import { Box } from 'components/elements';
import { ViewBranchSiteSettings } from 'screens/Shared/Branches/components/ViewBranchSiteSettings';

export const SiteSettings = () => (
	<Content className="SiteSettings" title="Site Settings">
		<Box padding>
			<ViewBranchSiteSettings branchId={null} withHeader={false} />
		</Box>
	</Content>
);
