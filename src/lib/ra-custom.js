// Customizations for react-admin
// created 21-feb-2020 by docker@instantlinux.net

import React from 'react';
import { EditButton, Pagination, SaveButton, Toolbar,
         TopToolbar } from 'react-admin';

// Pagination choice list
export const ListPagination = props => <Pagination
    rowsPerPageOptions={[10, 20, 40, 100, 250]} {...props} />

// Location dropdowns
export const LocationRenderer = record => {
    if (record.name) {
	return `${record.name} - ${record.city}`
    }
    else if (record.address) {
	return `${record.address}, ${record.city}`
    }
    else if (record.neighborhood) {
	return record.neighborhood
    }
    else {
	return record.city ? record.city : record.id
    }
}

// Menu title with name instead of ID
export const MenuTitle = ({ record }) => {
    return <span>{record ? record.name : ''}</span>;
};

// Top toolbar: enable edit if permissions allow
export const TopbarActions = ({basePath, data, ...props}) => {
    if (data && data.rbac && data.rbac.includes('u')) {
        return <TopToolbar>
            <EditButton basePath={basePath} record={data}/>
        </TopToolbar>;
    }
    else {
        return <TopToolbar />;
    }
};

// Top toolbar: disable all the standard buttons (for profile edit)
export const TopbarNoActions = props => (
    <TopToolbar />
);

// Bottom toolbar: only show a save button, no delete button
export const BottombarSaveOnly = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);

// Bottom toolbar: disable save/edit buttons - just use {null}
