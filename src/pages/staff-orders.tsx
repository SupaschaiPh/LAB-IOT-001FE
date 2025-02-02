import { useMemo, useRef, useState } from "react";
import Datatable from "../components/datatable";
import Layout from "../components/layout";
import useSWR from "swr";
import { IconAlertTriangleFilled, IconReceipt2 } from "@tabler/icons-react";
import { Alert, Button, Paper, TextInput } from "@mantine/core";
import Loading from "../components/loading";
import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { modals } from "@mantine/modals";

export default function StaffOrderPage() {
  const {
    data: orders,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any[]>("/orders", {
    onSuccess: function (data) {
      setordersData(
        data.map((v) => ({
          ...v,
          order_items: JSON.stringify(
            v?.order_items?.map((vv: any) => ({
              menu_id: vv.menu_id,
              quantity: vv.quantity,
            })),
          ),
        })),
      );
    },
  });
  const [ordersData, setordersData] = useState<any[]>(
    (orders as any[])?.map((v) => ({
      ...v,
      created_at: new Date(v.created_at).toLocaleString(),
      updated_at: new Date(v.updated_at).toLocaleString(),
      order_items: JSON.stringify(
        v?.order_items?.map((vv: any) => ({
          menu_id: vv.menu_id,
          quantity: vv.quantity,
        })),
      ),
    })),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const tableRef = useRef<any>();

  const colDef = useMemo(
    () => [
      {
        field: "id",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        cellRenderer: (d: any) => (
          <Link to={"/receipt/" + d?.data?.id}>{d.value}</Link>
        ),
        editable: false,
      },
      {
        field: "created_at",
        editable: false,
      },
      {
        field: "updated_at",
        editable: false,
      },
      {
        field: "total_price",
        cellRenderer: (d: any) => <p>{d?.value?.toLocaleString()}</p>,
      },
      {
        field: "order_items",
        cellEditor: "agLargeTextCellEditor",
        cellEditorPopup: true,
      },
      {
        field: "note",
        cellEditor: "agLargeTextCellEditor",
        cellEditorPopup: true,
      },
    ],
    [],
  );

  async function editHandler(id: number, values: any) {
    try {
      setIsProcessing(true);

      await axios.patch(`/orders/${id}`, {
        note:values.note,
        order_items: JSON.parse(values?.order_items),
      });
      notifications.show({
        title: "แก้ไขข้อมูลคำสั่งซื้อสำเร็จ",
        message: "ข้อมูลคำสั่งซื้อได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลคำสั่งซื้อ",
            message: "ไม่พบข้อมูลคำสั่งซื้อที่ต้องการแก้ไข",
            color: "red",
          });
        } else if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message:
            "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      mutate(orders);
      setIsProcessing(false);
    }
  }
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/orders/${id}`);
      notifications.show({
        title: "ลบคำสั่งซื้อสำเร็จ id " + id,
        message: "ลบคำสั่งซื้อนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลคำสั่งซื้อ id " + id,
            message: "ไม่พบข้อมูลคำสั่งซื้อที่ต้องการลบ",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้งคำสั่งซื้อ id " + id,
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message:
            "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      mutate(orders);
    }
  };

  return (
    <Layout>
      <section className="container mx-auto h-[600px] mt-4">
        {isProcessing || (isLoading && !error && <Loading />)}
        {error && (
          <Alert
            className="w-full mb-4"
            color="red"
            title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
            icon={<IconAlertTriangleFilled />}
          >
            {error.message}
          </Alert>
        )}
        <Paper
          className="transition cursor-default mb-4"
          shadow="xs"
          withBorder
          p="xl"
        >
          <div className="flex gap-4 items-center h-full w-full">
            <span className="flex border bg-orange-100  rounded p-2 items-center">
              <IconReceipt2 className="text-orange-500" size={30} />
            </span>
            <span className="flex flex-col">
              <h2>จัดการคำสั่งซื้อ</h2>
              <sub>ดับเบิลคลิกที่คอลัมน์เพื่อแก้ไขข้อมูล</sub>
            </span>
          </div>
        </Paper>
        <div className="flex w-full mb-2 items-center gap-2">
          <TextInput
            placeholder="ค้นหา"
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
          ></TextInput>
          <Button
            className="w-fit"
            variant="default"
            onClick={() => mutate(orders, { revalidate: true })}
            loading={isValidating || isLoading}
          >
            รีเฟรชตาราง
          </Button>
          <Button
            onClick={() => {
              modals.openConfirmModal({
                title: "คุณต้องการลบคำสั่งซื้อนี้ใช่หรือไม่",
                children: (
                  <span className="text-xs">
                    เมื่อคุณดำนเนินการลบคำสั่งซื้อนี้แล้ว จะไม่สามารถย้อนกลับได้
                  </span>
                ),
                labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                onConfirm: async () => {
                  setIsProcessing(true);
                  await Promise.all(
                    selectedRow?.map((v) => handleDelete(v?.id)),
                  );
                  setIsProcessing(false);
                },
                confirmProps: {
                  color: "red",
                },
              });
            }}
            className="w-fit"
            color="red"
          >
            {"ลบ" + (selectedRow.length || 0) + "แถว"}
          </Button>
        </div>
        <Datatable
          columnDefs={colDef}
          rowData={ordersData}
          isLoading={isValidating || isLoading}
          gref={tableRef}
          onEdit={(e) => {
            const data = { ...e.data };
            delete data?.id;
            editHandler(e.data.id, data);
          }}
          quickFilterText={quickFilterText}
          onSelect={() =>
            setSelectedRow(tableRef.current?.api?.getSelectedRows())
          }
        ></Datatable>
        <div className="h-12"></div>
      </section>
    </Layout>
  );
}
