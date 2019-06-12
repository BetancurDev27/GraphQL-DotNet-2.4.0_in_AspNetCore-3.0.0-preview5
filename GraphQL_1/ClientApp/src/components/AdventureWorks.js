﻿import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import {
    FilteringState,
    SortingState,
    // IntegratedSorting,
    PagingState,
    CustomPaging,
    SelectionState,
    DataTypeProvider,
    TreeDataState,
    CustomTreeData
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
    TableFilterRow,
    Toolbar,
    TableSelection,
    ColumnChooser,
    TableColumnVisibility,
    TableTreeColumn
} from '@devexpress/dx-react-grid-bootstrap4';

const FilterIcon = ({ type }) => {
    if (type === 'month') {
        return (
            <span className="d-block oi oi-calendar" />
        );
    }
    return <TableFilterRow.Icon type={type} />;
};

const ROOT_ID = '';

const getRowId = row => row.productId;

const getChildRows = (currentRow, rootRows) => {        //currentRow  // rootRows
    const childRows = rootRows.filter(r => r.productId === (r.transactionHistory[0].productId ? r.transactionHistory[0].productId : ROOT_ID));
    if (childRows.length) {
        return childRows;
    }
    return currentRow && currentRow.hasItems ? [] : null;
};

export class AdventureWorks extends Component {
    static displayName = AdventureWorks.name;

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            columns: [
                { name: 'productId', title: 'Id' },
                { name: 'name', title: 'Name' },
                { name: 'productnumber', title: 'Number' },
                { name: 'makeFlag', title: 'Make flag' },
                { name: 'color', title: 'Color' },
                { name: 'standardCost', title: 'Cost' },
                { name: 'listPrice', title: 'Price' },
                { name: 'size', title: 'Size' },
                { name: 'sellStartDate', title: 'Sell start date' },
                { name: 'sellEndDate', title: 'Sell end date' },
                { name: 'productSubcategoryId', title: 'SubCat Id', getCellValue: row => (row.productSubcategory ? row.productSubcategory.productSubcategoryId : undefined) },
                //{ name: 'name', title: 'SubCat name', getCellValue: row => (row.productSubcategory ? row.productSubcategory.name : undefined) }
            ],
            totalCount: 0,
            loading: true,
            queryString: ``,
            selection: [],
            currentPage: 0,
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 0],
            defaultHiddenColumnNames: [],
            lastQuery: '',
            filters: [],
            sorting: [{ columnName: 'productId', direction: 'asc' }],
            intColumns: ['productId'],
            dateColumns: ['sellStartDate'],
            intFilterOperations: ['equal', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'],
            dateFilterOperations: ['month', 'contains', 'startsWith', 'endsWith'],
            tableColumnExtensions: [
                { columnName: 'productId', width: 50, wordWrapEnabled: true },
            ],
            defaultExpandedRowIds: [],
        };

        this.changeSelection = this.changeSelection.bind(this);

        this.changeCurrentPage = this.changeCurrentPage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.changeFilters = this.changeFilters.bind(this);
        this.changeSorting = this.changeSorting.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { currentPage, pageSize, filters, sorting } = this.state;

        //var tmp01 = prevProps;
        //var tmp02 = prevState;
        //var tmp03 = snapshot;

        var tmp1 = currentPage;
        var tmp2 = prevState.currentPage;

        var stopDebug = currentPage;

        if (currentPage != prevState.currentPage
            || pageSize != prevState.pageSize
            || filters != prevState.filters
            || sorting != prevState.sorting
        ) {
            this.createQueryString()
            this.loadData();
        }
    }

    //static renderProductsTable(rows, defaultHiddenColumnNames) {
    //    return (
    //        <Grid
    //            rows={rows}
    //            columns={Object.keys(rows[0]).map(function (key) {
    //                    return { name: key, title: key }
    //                })
    //            }>

    //            <SearchState deafaultValue="" />
                
    //            <PagingState defaultCurrentPage={0} pageSize={10} />
    //            <IntegratedPaging />

    //            <FilteringState defaultFilters={[]} />
    //            <IntegratedFiltering />
                
    //            <SortingState defaultSorting={[{ columnName: 'productId', direction: 'asc' }]} />
    //            <IntegratedSorting />

    //            <SelectionState onSelectionChange={this.caller.changeSelection} />  {/* defaultSelection={selection} */}

    //            <Table />
    //            <TableHeaderRow allowSorting showSortingControls />
    //            <TableColumnVisibility defaultHiddenColumnNames={defaultHiddenColumnNames} />
    //            <TableSelection />
    //            <Toolbar />
    //            <ColumnChooser />
    //            <SearchPanel />
    //            <PagingPanel pageSizes={this.state.pageSizes} />
    //            <TableFilterRow />
    //        </Grid>
    //    );
    //}

    //renderProductsTable() {
    //    return (
    //        <div className="card">
    //            <Grid
    //                rows={rows}
    //                columns={Object.keys(rows[0]).map(function (key) {
    //                    return { name: key, title: key }
    //                })
    //                }>
    //                <PagingState d defaultCurrentPage={this.state.currentPage} defaultPageSize={this.state.pageSize} onCurrentPageChange={this.changeCurrentPage} onPageSizeChange={this.changePageSize} />
    //                <CustomPaging totalCount={totalCount} />

    //                <FilteringState defaultFilters={[]} />
    //                <IntegratedFiltering />

    //                <SortingState defaultSorting={[{ columnName: 'productId', direction: 'asc' }]} />
    //                <IntegratedSorting />

    //                <SelectionState defaultSelection={this.state.selection} onSelectionChange={this.state.changeSelection} />

    //                <Table />
    //                <TableHeaderRow allowSorting showSortingControls />
    //                <PagingPanel pageSizes={this.state.pageSizes} />
    //                <TableColumnVisibility defaultHiddenColumnNames={this.state.defaultHiddenColumnNames} />
    //                <TableSelection />
    //                <Toolbar />
    //                <ColumnChooser />
    //                <TableFilterRow />
    //            </Grid>
    //        </div>
    //    );
    //}

    //queryStringMethod() {
    //    const { searchValue } = this.state;
    //    var qString = '';

    //    if (searchValue <= 0 || searchValue > 9999) {
    //        searchValue = -411;
    //    }
    //    qString = 'graphql?query={products(productId:' + searchValue + '){productId:productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}}';

    //    return qString;
    //}

    //setProductId(event) {
    //    this.setState({ productId: event.target.value });
    //}

    changeSelection(event) {
        this.setState({ selection: event.target.value });
    }

    createQueryString() {
        let { pageSize, currentPage, totalCount, filters, sorting } = this.state;

        let qString = '';
        let after = pageSize * currentPage;
        let whereString = '';
        const columnSorting = sorting[0];
        let sortDirection = false;

        if (columnSorting.direction != "asc") {
            sortDirection = true;
        }

        if (pageSize == 0) {
            pageSize = totalCount;
        }

        if ((filters && filters.length) != 0) {
            for (let item of filters) {
                if (item.operation == "notContains") {
                    item.operation = "notEqual";
                }
                var where = `, where: { path: "${item.columnName}", comparison: "${item.operation}", value:"${item.value}"}`;
                whereString += where;

                after = -1;
                this.changeCurrentPage(0);
            }
        } else {
            if (pageSize * currentPage >= totalCount) {
                after = totalCount - pageSize;
            }

            if (after <= 0) {
                after = -1;
            }
        }

        qString = `graphql?query={
            productsConnection(
                first: ${pageSize},
                after: "${after}"
                ${whereString}
                ,orderBy: {
                    path: "${columnSorting.columnName}",
                    descending: ${sortDirection}
                }
            ),
            {
                totalCount,
                items{ productId, name, productNumber, makeFlag, color, standardCost, listPrice, size, sellStartDate, sellEndDate,
                    productSubcategory { productSubcategoryId },
                    transactionHistory { transactionId, productId, referenceOrderId, transactionType } },
                pageInfo{ startCursor, endCursor, hasPreviousPage, hasNextPage }
            }
        }`;

        //transactionHistory{
        //    transactionId,
        //        referenceOrderId,
        //        transactionType
        //}

        // (where:{path:"productId",comparison:"equal",value:3})

        //qString = `graphql?query={
        //    products(where:{path:"productId",comparison:"equal",value:"3"}){
        //        productId,
        //        name,
        //        productNumber,
        //        makeFlag,
        //        color,
        //        standardCost,
        //        listPrice,
        //        size,
        //        sellStartDate,
        //        sellEndDate}}`;

        this.setState({ queryString: qString });
        return qString;
    }

    changeCurrentPage(currentPage) {
        this.setState({
            loading: true,
            currentPage,
        });
    }

    changePageSize(pageSize) {
        var { currentPage, totalCount } = this.state;

        if (pageSize == 0) {
            this.setState({ pageSize: totalCount })
        }

        var numberOfPages = Math.ceil((totalCount / pageSize) - 1);

        if (numberOfPages < currentPage) {
            this.changeCurrentPage(numberOfPages);
        }

        this.setState({ pageSize });
    }

    changeFilters(filters) {
        this.setState({
            loading: true,
            filters,
        });
    }

    changeSorting(sorting) {
        this.setState({
            loading: true,
            sorting,
        });
    }

    changeSearchValue(searchValue) {
        this.setState({
            loading: true,
            searchValue,
        });
    }

    render() {
        const {
            rows,
            columns,
            totalCount,
            loading,
            pageSize,
            filters,
            intColumns,
            dateColumns,
            intFilterOperations,
            dateFilterOperations,
            sorting,
            tableColumnExtensions,
            defaultExpandedRowIds
        } = this.state;

        //let contents = this.state.loading
        //    ? <p><em>Loading...</em></p>
        //    : AdventureWorks.renderProductsTable(rows, totalCount/*, this.state.selection, this.state.defaultHiddenColumnNames*/);

        if (loading) {
            return (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>)
        }
        return (
            //<div>
            //    {contents}
            //</div>

            <div className="card">
                <Grid
                    rows={rows}
                    columns={columns}       /* Object.keys(rows[0]).map(function (key) {return { name: key, title: key }}) */
                    /* getRowId={getRowId} */
                >

                    <DataTypeProvider
                        for={intColumns}
                        availableFilterOperations={intFilterOperations}
                    />

                    <DataTypeProvider
                        for={dateColumns}
                        availableFilterOperations={dateFilterOperations}
                    />

                    <TreeDataState defaultExpandedRowIds={defaultExpandedRowIds} />

                    <CustomTreeData getChildRows={getChildRows} />

                    <PagingState defaultCurrentPage={this.state.currentPage} defaultPageSize={pageSize} onCurrentPageChange={this.changeCurrentPage} onPageSizeChange={this.changePageSize} />
                    <CustomPaging totalCount={totalCount} />

                    <FilteringState defaultFilters={filters} onFiltersChange={this.changeFilters} />

                    <SortingState defaultSorting={sorting} onSortingChange={this.changeSorting} />
                    { /* <IntegratedSorting /> */ }

                    <SelectionState defaultSelection={this.state.selection} onSelectionChange={this.state.changeSelection} />

                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow showSortingControls />
                    <TableColumnVisibility defaultHiddenColumnNames={this.state.defaultHiddenColumnNames} />
                    <TableSelection />

                    <TableTreeColumn for="name" showSelectionControls showSelectAll />

                    <Toolbar />
                    <ColumnChooser />
                    <TableFilterRow
                        showFilterSelector
                        iconComponent={FilterIcon}
                        messages={{ month: 'Month equals' }}
                    />
                    <PagingPanel pageSizes={this.state.pageSizes} />
                </Grid>
            </div>
        );
    }

    async loadData() {
        //const queryString = this.queryString();
        //if (queryString === this.lastQuery) {
        //    this.setState({ loading: false });
        //    return;
        //}

        //const queryString1 = 'graphql?query={products(productId:-411){productId:productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}}';
        //const queryString1 = 'graphql?query={products(take:10,skip:0){productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}}';
        //const queryString2 = 'graphql?query={productsConnection(first:10,after:"0"){totalCount,items{productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}pageInfo{startCursor,endCursor,hasPreviousPage,hasNextPage}}}';

        const queryString = this.createQueryString();
        var tmp = queryString;
        if (tmp) {

        }

        //graphql1?query={products(first:2,after:'2'){productId}}

        //fetch(queryString)
        //    .then(response => response.json())
        //    .then(data => data.data)
        //    .then(data => {
        //        if (data.productsConnection.totalCount != 0) {
        //            this.setState({
        //                rows: data.productsConnection.items,
        //                totalCount: data.productsConnection.totalCount,
        //                //loading: false,
        //            })
        //        }
        //        this.setState({ loading: false });
        //    })
        //    .catch(() => this.setState({ loading: false }));

        // var tmpString = "graphql?query={productsConnection(first: 50,after: " - 1", where: { path: "name", comparison: "equal", value: "ada" },orderBy: {path: "productId",descending: false}),{totalCount,items{productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}pageInfo{ startCursor, endCursor, hasPreviousPage, hasNextPage }}}";
        // var tmpString2 = "graphql?query={productsConnection(first: 50,after: ' - 1', where: { path: 'name', comparison: 'equal', value: 'ada' },orderBy: {path: 'productId',descending: false}),{totalCount,items{productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}pageInfo{ startCursor, endCursor, hasPreviousPage, hasNextPage }}}";
        // var tmpString3 = "graphql?query={productsConnection(first: 50,after: " + " - 1" + ", where: { path: " + "name" + ", comparison: " + "equal" + ", value: " + "ada" + " },orderBy: {path: " + "productId" + ",descending: false}),{totalCount,items{productId,name,productNumber,makeFlag,color,standardCost,listPrice,size,sellStartDate,sellEndDate}pageInfo{ startCursor, endCursor, hasPreviousPage, hasNextPage }}}";

        const response = await fetch(queryString);
        //if (response.ok) {
        const responseJson = await response.json();
        if (responseJson.data.productsConnection) {
            if (responseJson.data.productsConnection.totalCount != 0) {
                const data = responseJson.data.productsConnection;
                this.setState({ rows: data.items, totalCount: data.totalCount });
            } else {
                this.setState({ rows: [{ productId: null, name: null, productnumber: null, makeFlag: null, color: null, standardCost: null, listPrice: null, size: null, sellStartDate: null, sellEndDate: null }], totalCount: 0 });      //productId: null, name: null, productnumber: null, makeFlag: null, color: null, standardCost: null, listPrice: null, size: null, sellStartDate: null, sellEndDate: null
            }
        } else {
            this.setState({ rows: [{ productId: null, name: null, productnumber: null, makeFlag: null, color: null, standardCost: null, listPrice: null, size: null, sellStartDate: null, sellEndDate: null }], totalCount: 0 });
        }
        this.setState({ loading: false });

        //const response = await fetch(tmpString2);
        ////if (response.ok) {
        //const responseJson = await response.json();
        //djuif (responseJson.data.productsConnection) {
        //    if (responseJson.data.productsConnection.totalCount != 0) {
        //        const data = responseJson.data.productsConnection;
        //        this.setState({ rows: data.items, totalCount: data.totalCount });
        //    }
        //}
        //this.setState({ loading: false });

    //} 
    //else {
    //        throw Error(`Request rejected with status ${response.status}`);
    //    }

        //const response = await fetch(queryString);
        //const responseJson = await response.json();
        //const data = responseJson.data.productsConnection;
        //this.setState({ rows: data.items, totalCount: data.totalCount, loading: false });

        var tmp1 = this.state.totalCount;
        var stopDebug = queryString;
        var stopDebug2 = queryString;
    }
}

// GraphQL PLAYGROUND query
//
//query Products {
//    productsConnection(
//        first: 10,
//        after: "-1",
//        where: {
//            path: "productId",
//            comparison: "equal",
//            value: "3"
//        })
//    {
//        totalCount,
//            items{
//            productId,
//                name,
//                productNumber,
//                makeFlag,
//                color,
//                standardCost,
//                listPrice,
//                size,
//                sellStartDate,
//                sellEndDate
//        }
//    }
//}
