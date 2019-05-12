import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';
import { GridOptions } from 'ag-grid-community';
import AccountsService from '../services/AccountsService';
import AuthService from '../services/Auth';

class AccountSelector extends Component {

  state: GridOptions;

  constructor(props: {}) {
    super(props);
    this.state = {
      columnDefs: [{
        headerName: 'ID', field: 'id', sortable: true, filter: 'text'
      }, {
        headerName: 'Name', field: 'name', sortable: true, filter: 'text'
      }, {
        headerName: 'Created At', field: 'created_at', hide: true
      }],
      sortingOrder: ['created_at']
    }
  }

  async componentDidMount() {
    const result = await AccountsService.fetchAllAccounts();
    this.setState({ rowData: result.data });
  }

  render() {
    return (
      <div
        className='ag-theme-bootstrap'
        style={{ height: '500px' }}
      >
        <AgGridReact
          {...this.state}

          onRowClicked={function(event) {
            AuthService.setAccount(event.data.id);
          }}
        >
        </AgGridReact>
      </div>
    );
  }
}

export default AccountSelector;
