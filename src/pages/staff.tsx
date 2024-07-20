import { Paper, TextInput } from "@mantine/core";
import Layout from "../components/layout";
import { IconCoffee, IconNotebook, IconReceipt2, IconUsersGroup } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Datatable from "../components/datatable";

export default function StaffPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const staffMenu = [
    {
      icon: <IconCoffee className="text-orange-500" size={30} />,
      title: "จัดการเมนู",
      path: "/staff/menus",
    },
    {
      icon: <IconNotebook className="text-orange-500" size={30} />,
      title: "จัดการหนังสือ",
      path: "/staff/books",
    },
    {
        icon: <IconReceipt2 className="text-orange-500" size={30} />,
        title: "จัดการคำสั่งซื้อ",
        path: "/staff/orders",
      },
    {
      icon: <IconUsersGroup className="text-orange-500" size={30} />,
      title: "จัดการนักเรียน",
      path: "/staff/students",
    },
  ];

  if(staffMenu.length%2 == 0){staffMenu.push({icon:<IconCoffee></IconCoffee>, title:"",path:""})}
  return (
    <Layout>
      <section className="container mx-auto px-4 pt-4 pb-8">
        <Paper withBorder className="h-[250px] w-full rounded overflow-hidden">
          <div className="h-full flex flex-col justify-center items-center text-white bg-orange-800">
            <h1 className="text-center text-5xl">เมนูสตาฟ</h1>
          </div>
        </Paper>
      </section>
      <section className="container mx-auto py-8 grid grid-cols-2 gap-4 px-4">
        <TextInput
          label="ค้นหาเมนู"
          description="ค้นหาเมนูสำหรับstaff"
          placeholder="เมนู"
          className="col-span-2 mb-4"
          value={search}
          onChange={(e)=>{setSearch(e.target.value);}}
        />
        {staffMenu.filter((m)=>(search==""||m.title.includes(search))).map((menu, index) => (
          <Paper
            key={index}
            className={`transition hover:opacity-60 ${!!menu?.path || "opacity-60"} cursor-default col-span-${
              index === 0 ? 2 : 1
            }`}
            shadow="xs"
            withBorder
            p="xl"
            onClick={() => navigate(menu?.path)}
          >
            <div className="flex gap-4 items-center">
              <span
                className={`flex border bg-orange-100  ${!!menu?.path || "hidden"} rounded p-2 items-center`}
              >
                {menu?.icon}
              </span>
              <h3>{menu?.title}</h3>
            </div>
          </Paper>
        ))}
      </section>
      

    </Layout>
  );
}
