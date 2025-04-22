import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Layout, Breadcrumb, Modal } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
const { Header, Content } = Layout;
const MainLayout = ({ children }) => {
    return (
        <Layout className="main">
            {/* Main Content Area */}
            <Layout>
                {/* Header */}
                <Header className="d-flex align-items-center header-top">
                    <div className="logoWrapper me-2">
                        <Link href="/">
                            <img src="/assets/imgs/logos/hms.png"
                                className="img-fluid"
                                alt="Logo" />
                        </Link>
                    </div>
                    <div className="menuWrapper" style={{ width: "100%" }}>
                        <div className="d-flex justify-content-between">
                            <Breadcrumb
                                separator="|"
                                items={[
                                    { title: <Link href="/">Dashboard</Link> },
                                    { title: <Link href="/opd/token">OPD</Link> },
                                    { title: <Link href="/patients">Patient</Link> },
                                    { title: <Link href="/departments">Department</Link> },
                                    {
                                        title: "Users",
                                        menu: {
                                            items: [
                                                { title: <Link href="/users/all">All</Link> },
                                                { title: <Link href="/users/admin">Admin</Link> },
                                                { title: <Link href="/users/doctor">Doctor</Link> },
                                                { title: <Link href="/users/receptionist">Receptionist</Link> },
                                                { title: <Link href="/users/accountant">Accountant</Link> },
                                                { title: <Link href="/users/nurse">Nurse</Link> },
                                            ],
                                        },
                                    },
                                    { title: <Link href="/medical-records">Medical Records</Link> },
                                    { title: <Link href="/templates">Templates</Link> },
                                    {
                                        title: "Inventory",
                                        menu: {
                                            items: [
                                                { title: <Link href="/items">Items</Link> },
                                                { title: <Link href="/manage-stock">Manage Stock</Link> },
                                                { title: <Link href="/consume-stock">Consume Stock</Link> },
                                                { title: <Link href="/stock-adjustment">Stock Adjustment</Link> },
                                                { title: <Link href="/stock-request">Asset Request And Return</Link> },
                                                { title: <Link href="/stock-suppliers">Stock Suppliers</Link> },
                                                { title: <Link href="/purchase-order">Purchase Order</Link> },
                                                { title: <Link href="/purchase-requisition">Purchase Requisition</Link> },
                                                { title: <Link href="/manufacturers">Manufacturers</Link> },
                                            ]
                                        }
                                    },
                                ]}
                            />
                            <div className="me-4">
                                <Breadcrumb
                                    separator="|"
                                    items={[
                                        {
                                            title: "REPORTS",
                                            menu: {
                                                items: [
                                                    { title: <Link href="">OPD</Link> },
                                                    { title: "Patients" },
                                                    { title: "IPD" },
                                                    { title: "Pharmacy" },
                                                    { title: "Laboratry" },
                                                    { title: "Radiology" },
                                                ]
                                            }
                                        },
                                        { title: <Link href="/">Setting</Link> }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </Header>
                {/* Page Content */}
                <Content className="main-content">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;