import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-3.jpg";
import useSWR from "swr";
import { Cart, Menu, OrderItem } from "../lib/models";
import Loading from "../components/loading";
import { Alert, Button, NumberInput } from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconPlus,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CartComponent from "../components/cart";
import { notifications } from "@mantine/notifications";
import axios, { AxiosError } from "axios";


export default function MenuPage() {
  const navigate = useNavigate();
  const { data: menus, error, isLoading } = useSWR<Menu[]>("/menus");

  const [orders, setOrders] = useState<any>({});
  const [cartsData, setCartsData] = useState<Cart[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOrder = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.post<OrderItem>(`/orders`, {order_items:cartsData.map((c)=>({menu_id:c.id,quantity:c.count}))});
      notifications.show({
        title: "เพิ่มข้อมูลเมนูสำเร็จ",
        message: "ข้อมูลเมนูได้รับการเพิ่มเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/receipt/${response.data.id}`);
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
  

  function handlerSelect(menu: Menu, count: number): void {
    const oldIndex = cartsData.findIndex((c) => c?.id === menu.id);
    const hold = [...cartsData];
    if (oldIndex != -1) hold[oldIndex] = { ...menu, count: count ?? 1 };
    else hold.push({ ...menu, count: count ?? 1 });
    setCartsData(hold);
  }
  function handlerDeleteCartsData() {
    setCartsData([]);
    setOrders({});
  }


  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">เมนูกาแฟ และเครื่องดื่ม</h1>
          <h2>รายการเมนูทั้งหมด</h2>
        </section>
        <section className="container mx-auto py-8 mb-8">
          <div className="flex justify-between">
            <h1>รายการเมนูเครื่องดื่ม</h1>
            <div className="flex gap-4">
              <Button
                component={Link}
                leftSection={<IconPlus />}
                to="/menu/create"
                size="xs"
                variant="primary"
                className="flex items-center space-x-2"
              >
                เพิ่มเมนู
              </Button>
            </div>
          </div>

          {!menus && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {!!error || isLoading ||
              (menus && menus?.length > 0 ? (
                menus?.map((menu) => (
                  <div
                    className="border border-solid border-neutral-200"
                    key={menu.id}
                  >
                    <img
                      src={
                        menu.cover_url && menu.cover_url.length > 0
                          ? menu.cover_url
                          : "https://placehold.co/200x150?text=menu"
                      }
                      alt={menu.name}
                      className="w-full object-cover aspect-[4/3]"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold line-clamp-2">
                        {menu.name}
                      </h2>
                      <p className="text-xs text-neutral-500">
                        ราคา {menu.price}
                      </p>
                    </div>

                    <div className="flex justify-end px-4 pb-2 gap-2">
                      <p>จำนวน</p>
                      <NumberInput
                        onChange={(v) => {
                          setOrders((old: any) => {
                            let hold = { ...old };
                            hold[menu.id] = v;
                            return hold;
                          });
                        }}
                        value={orders[menu.id] || 1}
                        min={1}
                        size="xs"
                      ></NumberInput>
                      <Button
                        onClick={() => handlerSelect(menu, orders[menu.id])}
                        size="xs"
                        variant="primary"
                      >
                        เลือก
                      </Button>
                    </div>
                    <div className="flex px-4 pb-2 gap-2">
                      <Button  component={Link} to={"/menu/edit/"+menu.id} size="xs"  fullWidth variant="default" className="w-1/2">
                        แก้ไข
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="pt-2 text-red-600">ไม่พบข้อมูลเมนูในฐานข้อมูล</p>
              ))}
          </div>
        </section>

        <CartComponent data={cartsData} loading={isProcessing} onSubmit={handleOrder} onCancel={handlerDeleteCartsData} />
      </Layout>
    </>
  );
}
