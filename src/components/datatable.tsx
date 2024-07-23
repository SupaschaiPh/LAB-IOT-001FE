import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "./datagrid-themes/ag-grid-theme-kmit-n.css";

interface DatatableI {
  rowData: any[];
  columnDefs: any[] | undefined;
  isLoading: boolean | undefined;
  gref: React.MutableRefObject<any> | undefined;
  onEdit: ((e: any) => void) | undefined;
  onSelect: ((e: any) => void) | undefined;
  quickFilterText: string | undefined;
}
export default function Datatable({
  rowData,
  columnDefs,
  isLoading,
  gref,
  quickFilterText,
  onEdit,
  onSelect,
}: DatatableI) {
  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-kmit-n" // applying the Data Grid theme
      style={{ height: "100%" }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact
        rowStyle={{ flex: 1 }}
        quickFilterText={quickFilterText}
        rowData={rowData}
        columnDefs={
          columnDefs ??
          Object.keys(rowData[0])?.map((r) => ({
            field: r,
          }))
        }
        defaultColDef={{
          flex: 1,
          filter: true,
          editable: true,
          floatingFilter: true,
        }}
        suppressRowClickSelection={true}
        pagination={true}
        rowSelection="multiple"
        onRowSelected={onSelect}
        onCellValueChanged={onEdit}
        undoRedoCellEditing={true}
        loading={isLoading}
        ref={gref}
      />
    </div>
  );
}
