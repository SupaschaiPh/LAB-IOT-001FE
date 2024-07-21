import { useMemo, useRef, useState } from "react";
import Datatable from "../components/datatable";
import Layout from "../components/layout";
import useSWR from "swr";
import { IconAlertTriangleFilled, IconNotebook } from "@tabler/icons-react";
import { Alert, Button, Paper, TextInput } from "@mantine/core";
import Loading from "../components/loading";
import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { modals } from "@mantine/modals";

export default function StaffBookPage() {
  const {
    data: books,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<any[]>("/books", {
    onSuccess: function (data) {
      setBookData(data);
    },
  });
  const [bookData, setBookData] = useState<any[]>(books as any[]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const tableRef = useRef<any>();

  const colDef = useMemo(
    () => [
      {
        field: "title",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        cellRenderer: (d: any) => (
          <Link to={"/books/" + d?.data?.id}>{d.value}</Link>
        ),
      },
      {
        field: "description",
        cellEditor: "agLargeTextCellEditor",
        cellEditorPopup: true,
      },
      {
        field: "cover_url",
        cellEditor: "agLargeTextCellEditor",
        cellEditorPopup: true,
        cellRenderer: (d: any) => (
          <img
            className=" aspect-[3/4] object-cover"
            height="100%"
            src={
              d.value && d.value.length > 0
                ? d.value
                : "https://placehold.co/75x100?text=cover"
            }
          />
        ),
      },
      {
        field: "author",
      },
      {
        field: "is_published",
      },
      {
        field: "category",
      },
      {
        field: "synopsis",
      },
      {
        field: "year",
      },
    ],
    [],
  );

  async function editHandler(id: number, values: any) {
    try {
      setIsProcessing(true);
      await axios.patch(`/books/${id}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข",
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
      mutate(books);
      setIsProcessing(false);
    }
  }
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/books/${id}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ id " + id,
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ id " + id,
            message: "ไม่พบข้อมูลหนังสือที่ต้องการลบ",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้งหนังสือ id " + id,
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
      mutate(books);
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
              <IconNotebook className="text-orange-500" size={30} />
            </span>
            <span className="flex flex-col">
              <h2>จัดการหนังสือ</h2>
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
            onClick={() => mutate(books, { revalidate: true })}
            loading={isValidating || isLoading}
          >
            รีเฟรชตาราง
          </Button>
          <Button component={Link} to="/books/create">
            เพิ่มหนังสือ
          </Button>
          <Button
            onClick={() => {
              modals.openConfirmModal({
                title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                children: (
                  <span className="text-xs">
                    เมื่อคุณดำนเนินการลบหนังสือเล่มนี้แล้ว
                    จะไม่สามารถย้อนกลับได้
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
          rowData={bookData}
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
