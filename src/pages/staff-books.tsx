import {  useMemo } from "react";
import Datatable from "../components/datatable";
import Layout from "../components/layout";
import useSWR from "swr";

export default function StaffBookPage(){
    const { data: books, error, isLoading } = useSWR<any[]>("/books");
      const colDef = useMemo(
        ()=>[{
            field:"title"
        },{
            field:"description",
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
        },{
            field:"author"
        },{
            field:"is_published"
        },{
            field:"category"
        },{
            field:"synopsis"
        },{
            field:"year"
        }],[]
      )
    return <Layout>
        <section className="container mx-auto h-[600px] mt-8">
      <Datatable columnDefs={colDef} rowData={books??[]} isLoading={isLoading} gref={undefined} onEdit={function (e: any): void | undefined {
             console.log(e)
          } } onSelect={function (e: any): void | undefined {
              throw new Error("Function not implemented.");
          } } ></Datatable>
    </section>
    </Layout>
}
