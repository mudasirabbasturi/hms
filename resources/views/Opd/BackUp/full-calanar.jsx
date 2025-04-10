import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, router } from "@inertiajs/react"
import { Breadcrumb, Select, Modal } from 'antd'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

const Index = ({ appointments, doctors }) => {
    const [events, setEvents] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const calendarRef = useRef(null)
    const doctorSelectRef = useRef(null)

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
    }, [appointments])

    const doctorOptions = useMemo(() => [
        ...doctors.map(doctor => ({ value: doctor.id, label: doctor.name }))
    ], [doctors])

    const handleDoctorChange = useCallback((value) => {
        if (value === 'all') {
            router.get(`/opd`)
        } else {
            router.get(`/opd/doctor/${value}`)
        }
    }, [])

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

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event.extendedProps);
        setIsModalOpen(true);
    }

    useEffect(() => {
        if (calendarRef.current) {
            const toolbarRight = calendarRef.current.querySelector(".fc-toolbar-chunk:last-child");
            if (toolbarRight && !doctorSelectRef.current) {
                doctorSelectRef.current = document.createElement("div");
                doctorSelectRef.current.classList.add("doctor-select");
                toolbarRight.appendChild(doctorSelectRef.current);
            }
        }
    }, [])

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

            <div className="row mb-5 mt-3">
                <div className="col-12">
                    <div ref={calendarRef}>
                        <FullCalendar
                            height="auto"
                            // plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            // initialView="multiMonthYear"
                            // multiMonthMaxColumns={1}
                            headerToolbar={{
                                left: 'prev today next',
                                center: 'title',
                                right: '',
                            }}
                            buttonText={{ today: 'Today' }}
                            events={events}
                            editable={true}
                            selectable={true}
                            eventContent={renderEventContent}
                            eventClick={handleEventClick}
                        />

                    </div>
                </div>
            </div>

            {doctorSelectRef.current &&
                createPortal(
                    <Select
                        style={{ width: "180px" }}
                        className=""
                        placeholder="Select Doctor"
                        onChange={handleDoctorChange}
                        options={doctorOptions}
                    />, doctorSelectRef.current
                )
            }

            <Modal
                title="Appointment Details"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                {selectedEvent && (
                    <div>
                        <p><strong>Token:</strong> {selectedEvent.token}</p>
                        <p><strong>Doctor ID:</strong> {selectedEvent.doctor}</p>
                        <p><strong>Patient ID:</strong> {selectedEvent.patient}</p>
                    </div>
                )}
            </Modal>

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
export default Index;