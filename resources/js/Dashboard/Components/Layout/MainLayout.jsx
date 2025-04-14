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
                                    {
                                        title: "Medical Record",
                                        menu: {
                                            items: [
                                                { title: <Link href="/prescriptions">Prescription</Link> },
                                                { title: <Link href="/vitals">Vitals</Link> },
                                                { title: <Link href="/medications">Medications</Link> },
                                                { title: <Link href="/medical-histories">Medical Histories</Link> },
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
                                                    { title: <Link href="/patient/create">OPD</Link> },
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