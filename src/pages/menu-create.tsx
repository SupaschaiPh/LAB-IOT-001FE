import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import {
  Button,
  Container,
  Divider,
  NumberInput,
  TextInput,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import {  Menu } from "../lib/models";

import {  FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

export default function MenuCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const menuCreateForm = useForm({
    initialValues: {
      name: "",
      price: 60,
      description: "lorem ipsum dolor sit amet",
      cover_url:""
    },

    validate: {
      name: isNotEmpty("กรุณาระบุชื่อเมนู"),
      price: isNotEmpty("กรุณาราคาเมนู"),
    },
  });


  const handleSubmit = async (values: typeof menuCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<Menu>(`/menus`, values);
      notifications.show({
        title: "เพิ่มข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/menus/${response.data.id}`);
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
          message:
            "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
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
          <h1 className="text-xl">เพิ่มเมนูในระบบ</h1>

          <form
            onSubmit={menuCreateForm.onSubmit(handleSubmit)}
            className="space-y-8"
          >
            <TextInput
              label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
              {...menuCreateForm.getInputProps("name")}
            />

            {!import.meta.env.VITE_UPLOADDER_PUBLIC_KEY || (
              <div>
              <p>ภาพเมนู</p>
              
              <FileUploaderRegular
                pubkey={import.meta.env.VITE_UPLOADDER_PUBLIC_KEY}
                maxLocalFileSizeBytes={1000000}
                multiple={false}
                imgOnly={true}
                classNameUploader="my-config uc-light"
                onFileUploadSuccess={(x)=>{  menuCreateForm.setFieldValue("cover_url",x.cdnUrl); }}
              />
              </div>
            )}

            <NumberInput
              label="ราคา"
              placeholder="ราคา"
              min={0}
              {...menuCreateForm.getInputProps("price")}
            />

            {/* TODO: เพิ่มรายละเอียดเมนู */}
            <Textarea
              label="รายละเอียดเมนู"
              placeholder="รายละเอียดเมนู"
              rows={3}
              {...menuCreateForm.getInputProps("description")}
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
