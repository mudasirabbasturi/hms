import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, router } from "@inertiajs/react";
import { Breadcrumb, Select } from 'antd';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Doctor = ({ appointments, doctor, doctors }) => {
    const [events, setEvents] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(doctor?.id || "all");
    const calendarRef = useRef(null);
    const doctorSelectRef = useRef(null);

    useEffect(() => {
        setEvents(
            appointments.map(appointment => ({
                id: appointment.id.toString(),
                title: `Token #${String(appointment.token_number).padStart(4, '0')}`,
                start: appointment.start,
                extendedProps: {
                    token: appointment.token_number,
                    doctor_id: appointment.user_id,
                    patient_id: appointment.patient_id,
                    doctor_name: appointment.doctor_name,
                    patient_name: appointment.patient_name
                }
            }))
        );
    }, [appointments]);

    const doctorOptions = useMemo(() => [
        { value: 'all', label: 'All Doctors' },
        ...doctors.map(doc => ({ value: doc.id, label: doc.name }))
    ], [doctors]);

    const handleDoctorChange = useCallback((value) => {
        setSelectedDoctor(value || "all");

        if (value === "all") {
            router.get(`/opd`)
        } else {
            router.get(`/opd/doctor/${value}`);
        }
    }, []);

    const renderEventContent = (eventInfo) => {
        return (
            <div
                style={{
                    padding: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    background: "#f8f9fa",
                    width: "100%"
                }}>
                <div><strong>Token:</strong> {eventInfo.event.extendedProps.token}</div>
                <div><strong>Doctor:</strong> {eventInfo.event.extendedProps.doctor_name}</div>
                <div><strong>Patient:</strong> {eventInfo.event.extendedProps.patient_name}</div>
            </div>
        );
    };

    // Injects dropdown into FullCalendar toolbar
    useEffect(() => {
        if (calendarRef.current) {
            const toolbarRight = calendarRef.current.querySelector(".fc-toolbar-chunk:last-child");
            if (toolbarRight && !doctorSelectRef.current) {
                doctorSelectRef.current = document.createElement("div");
                doctorSelectRef.current.classList.add("doctor-select");
                toolbarRight.appendChild(doctorSelectRef.current);
            }
        }
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 bg-white pt-2 pb-2 d-flex justify-content-between flex-wrap align-items-center">
                    <Breadcrumb
                        items={[
                            { title: <Link href="/">Dashboard</Link> },
                            { title: "Opd" },
                            { title: "Calendar" },
                        ]}
                    />
                </div>
            </div>

            <div className="row mt-2 mb-3">
                <div className="col-12 mt-3 mb-3">
                    <div ref={calendarRef}>
                        <FullCalendar
                            height="auto"
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev today next',
                                center: 'title',
                                right: '',
                            }}
                            buttonText={{ today: 'Today' }}
                            events={events}
                            eventContent={renderEventContent}
                            editable={true}
                            selectable={true}
                        />
                    </div>
                </div>
            </div>

            {doctorSelectRef.current &&
                createPortal(
                    <Select
                        style={{ width: "180px" }}
                        placeholder="Select Doctor"
                        className="mb-2"
                        allowClear
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        options={doctorOptions}
                    />,
                    doctorSelectRef.current
                )
            }

            <style>
                {`
                .fc-daygrid-day-frame {
                    max-height: 300px;
                    overflow-y: auto;
                }
                .fc-daygrid-event {
                    white-space: normal !important;
                }
                .fc-toolbar-chunk .fc-button {
                    margin: 0 5px;
                    padding: 4px 8px;
                    font-size: 12px;
                }
                .fc-toolbar-chunk:last-child {
                    display: flex;
                    align-items: center;
                }
                .doctor-select {
                    margin-left: 10px;
                }
                `}
            </style>
        </div>
    );
};

export default Doctor;
