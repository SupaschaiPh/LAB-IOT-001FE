import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import {
  Button,
  Container,
  Divider,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Student } from "../lib/models";

import "@uploadcare/react-uploader/core.css";

export default function StudentCreatePage() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const studentCreateForm = useForm({
    initialValues: {
      stu_id: 6500000,
      name: "",
      lastname: "",
      bod: "",
      gender: "",
    },

    validate: {
      stu_id: isNotEmpty("กรุณาระบุรหัสนักเรียน"),
      name: isNotEmpty("กรุณาระบุชื่อนักเรียน"),
      lastname: isNotEmpty("กรุณานามสกุลนักเรียน"),
      bod: isNotEmpty("กรุณาระบุวันเกิดนักเรียน"),
      gender: isNotEmpty("กรุณาระบุเพศนักเรียน"),
    },
  });

  const handleSubmit = async (values: typeof studentCreateForm.values) => {
    console.log(values);
    try {
      setIsProcessing(true);
      await axios.post<Student>(`/students`, values);
      notifications.show({
        title: "เพิ่มข้อมูลนักเรียนสำเร็จ",
        message: "ข้อมูลนักเรียนได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/staff/students`);
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
          <h1 className="text-xl">เพิ่มนักเรียนในระบบ</h1>

          <form
            onSubmit={studentCreateForm.onSubmit(handleSubmit)}
            className="space-y-8"
          >
            <NumberInput
              label="รหัสนักเรียน"
              placeholder="รหัสนักเรียน"
              min={0}
              {...studentCreateForm.getInputProps("stu_id")}
            />

            <TextInput
              label="ชื่อนักเรียน"
              placeholder="ชื่อนักเรียน"
              {...studentCreateForm.getInputProps("name")}
            />

            <TextInput
              label="นามสกุลนักเรียน"
              placeholder="นามสกุลนักเรียน"
              {...studentCreateForm.getInputProps("lastname")}
            />

            {/* TODO: เพิ่มวันเกิดนักเรียน */}
            <TextInput
              type="date"
              label="วันเกิดนักเรียน"
              placeholder="วันเกิดนักเรียน"
              {...studentCreateForm.getInputProps("bod")}
            />

            <Select
              label="เพศนักเรียน"
              placeholder="เพศนักเรียน"
              data={["ชาย", "หญิง"]}
              {...studentCreateForm.getInputProps("gender")}
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
