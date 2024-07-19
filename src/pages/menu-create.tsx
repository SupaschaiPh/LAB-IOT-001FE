import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { Button, Checkbox, Container, Divider, NumberInput, TextInput,Textarea,FileInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Book } from "../lib/models";

export default function MenuCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const bookCreateForm = useForm({
    initialValues: {
      name : "" ,
      description  : "",
      price : 0 ,
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      price: isNotEmpty("กรุณาระบุราคา"),
    },
  });

  const handleSubmit = async (values: typeof bookCreateForm.values) => {
    console.log('xx',values)

    try {
      setIsProcessing(true);
      const response = await axios.post<Book>(`/books`, values );
      notifications.show({
        title: "เพิ่มข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
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
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">เพิ่มหนังสือในระบบ</h1>

          <form onSubmit={bookCreateForm.onSubmit(handleSubmit)} className="space-y-8">
            <TextInput
              label="ชื่อหนังสือ"
              placeholder="ชื่อหนังสือ"
              {...bookCreateForm.getInputProps("title")}
            />

            {/*<FileInput
            label="ปกหนังสือ"
            placeholder="ปกหนังสือ"
            {...bookCreateForm.getInputProps("cover")}
            />*/}

            <TextInput
              label="ชื่อผู้แต่ง"
              placeholder="ชื่อผู้แต่ง"
              {...bookCreateForm.getInputProps("author")}
            />

            <NumberInput
              label="ปีที่พิมพ์"
              placeholder="ปีที่พิมพ์"
              min={1900}
              max={new Date().getFullYear() + 1}
              {...bookCreateForm.getInputProps("year")}
            />

            {/* TODO: เพิ่มรายละเอียดหนังสือ */}
            <Textarea
              label="รายละเอียดหนังสือ"
              placeholder="รายละเอียดหนังสือ"
              rows={3}
              {...bookCreateForm.getInputProps("description")}
            />
            {/* TODO: เพิ่มเรื่องย่อ */}
            <Textarea
              label="เรื่องย่อ"
              placeholder="เรื่องย่อ"
              rows={5}
              {...bookCreateForm.getInputProps("synopsis")}
            />
            {/* TODO: เพิ่มหมวดหมู่(s) */}
            <TextInput
              label="หมวดหมู่"
              placeholder="หมวดหมู่"
              description="ใช้ , คั่น"
              {...bookCreateForm.getInputProps("category")}
            />
            <Checkbox
              label="เผยแพร่"
              {...bookCreateForm.getInputProps("is_published", {
                type: "checkbox",
              })}
            />

            <Divider />

            <Button type="submit" loading={isProcessing}>
              บันทึกข้อมูล
            </Button>
          </form>
        </Container>
      </Layout>
    </>
  );
}
