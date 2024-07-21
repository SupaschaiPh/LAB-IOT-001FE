import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Paper,
} from "@mantine/core";

export interface CartI {
  data: any;
  onCancel:()=>void;
  loading: boolean;
  onSubmit:()=>void;
}

export default function CartComponent({ data,onCancel,loading,onSubmit }: CartI) {
  return (
    <Paper className="fixed right-0 bottom-0 w-96 z-50" shadow="xs" withBorder>
      <Accordion>
        <AccordionItem value="xx">
          <AccordionControl>รายการที่เลือก</AccordionControl>
          <AccordionPanel className="pl-2">
            <table>
            <thead>
              <tr>
                <td className="w-full opacity-80">รายการ</td>
                <td className="text-nowrap text-right">จำนวน</td>
                <td className="text-nowrap text-right">ราคา</td>

              </tr></thead>
              <tbody>
              <tr>
                <td colSpan={3}>
                  <hr />
                </td>
              </tr>

              {data.map((i:any,index:number) => (
                <tr key={"cart"+index}>
                  <td className="w-full">
                    <div className="flex h-fit gap-2 items-center">
                    <img className="h-6 aspect-square"  src={
                        i.cover_url && i.cover_url.length > 0
                          ? i.cover_url
                          : "https://placehold.co/1x1"
                      } />
                    <p>{i?.name}</p>
                    </div>
                    </td>
                  <td className="text-right">{i?.count?.toLocaleString()}</td>
                  <td className="text-right text-nowrap">{(i?.price * i?.count)?.toLocaleString()}</td>
                </tr>
              ))}
              </tbody>
              <tfoot>
                <tr>
                    <td colSpan={3}>
                        <hr/><hr/>
                    </td>
                </tr>
                <tr>
                <td colSpan={2}>
                    ยอดรวม
                </td>
                <td className="text-nowrap">
                    {data.map((i:any)=>i?.price*i?.count).reduce((x:number,y:number)=>x+y,0)?.toLocaleString()} บาท
                </td>
                </tr>
                
              </tfoot>
            </table>

            <div className="flex gap-2 justify-end mt-4">
            <Button onClick={onCancel} disabled={!data} color="red" size="xs">
                ยกเลิก
            </Button>
            <Button onClick={onSubmit} loading={loading} disabled={!data} size="xs">
                เสร็จสิ้น
            </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Paper>
  );
}
