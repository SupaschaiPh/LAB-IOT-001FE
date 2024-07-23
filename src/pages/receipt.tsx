import { useParams } from "react-router-dom";
import Layout from "../components/layout";
import useSWR from "swr";
import { Order } from "../lib/models";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Alert, Paper } from "@mantine/core";
import Loading from "../components/loading";

export default function ReceiptPage() {
  const { receiptId } = useParams();
  const {
    data: receipt,
    isLoading,
    error,
  } = useSWR<Order>(`/orders/${receiptId}`);

  return (
    <Layout>
      <section className="container mx-auto px-4 flex flex-col items-center mt-8">
        {isLoading && !error && <Loading />}
        {error && (
          <Alert
            className="w-full"
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}
        {!isLoading && !error && receipt && (
          <Paper p="lg">
            <h2>ใบเสร็จ</h2>
            <table className="w-full mb-8">
              <tbody>
                <tr>
                  <th className="w-32 text-left  text-nowrap">
                    หมายเลขใบเสร็จ
                  </th>
                  <td className="w-full"></td>
                  <td>{receipt?.id}</td>
                </tr>
                <tr>
                  <th className="w-32 text-left  text-nowrap">
                    ออกใบเสร็จเมื่อ
                  </th>
                  <td className="w-full"></td>
                  <td className="text-nowrap">
                    {receipt?.created_at &&
                      new Date(receipt?.created_at).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-32 text-left pr-4">รายการ</th>
                  <th className="pl-4 text-right">ราคาต่อหน่วย</th>
                  <th className="pl-4 text-right">จำนวน</th>
                  <th className="pl-4 text-right">ราคา</th>
                </tr>
                <tr>
                  <th colSpan={4}>
                    <hr />
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* แสดงรายการออเดอร์ */}
                {receipt?.order_items?.map((i) => (
                  <tr key={i.id}>
                    <td className="flex gap-2 items-center">
                      <img
                        className="h-6 aspect-square"
                        src={
                          i.menu &&
                          i.menu.cover_url &&
                          i.menu.cover_url.length > 0
                            ? i.menu.cover_url
                            : "https://placehold.co/1x1"
                        }
                      />
                      <p>
                        {i?.menu_id || -1} : {i?.menu?.name || "Null"}
                      </p>
                    </td>
                    <td className="text-right pl-4">
                      {i?.price?.toLocaleString()}
                    </td>
                    <td className="text-right pl-4 ">
                      {i?.quantity?.toLocaleString()}
                    </td>
                    <td className="text-right pl-4 ">
                      {(i?.price * i?.quantity)?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td className="pt-8" colSpan={4}>
                    <hr />
                    <hr />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>ยอดรวม</td>
                  <td className="text-nowrap text-right">
                    {receipt?.total_price?.toLocaleString()} บาท
                  </td>
                </tr>
              </tfoot>
            </table>
          </Paper>
        )}
      </section>
    </Layout>
  );
}
