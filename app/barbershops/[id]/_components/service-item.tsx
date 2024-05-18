"use client"
import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Service, Barbershop } from '@prisma/client';
import Image from "next/image";
import { useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { saveBooking } from "../_actions/save-booking";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ServiceItemProps {
    barbershop: Barbershop;
    service: Service;
    isAuthenticated: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
    const { data } = useSession();

    const router =  useRouter();

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [hour, setHour] = useState<string | undefined>();
    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [sheetIsOpen, setSheetIsOpen] = useState(false);

    const timeList = useMemo(() => date ? generateDayTimeList(date) : [], [date]);

    const handleDateClick = (date: Date | undefined) => {
        setDate(date);
        setHour(undefined);
    }

    const handleHourClick = (time: string) => {
        setHour(time)
    }

    const handleBookingSubmit = async () => {
        setSubmitIsLoading(true);
        try {
            if (!date || !hour || !data?.user) return;

            const dateHour = Number(hour.split(':')[0]);
            const dateMinutes = Number(hour.split(':')[1]);

            const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

            await saveBooking({
                serviceId: service.id,
                barbershopId: barbershop.id,
                userId: (data.user as any).id,
                date: newDate
            })

            setSheetIsOpen(false);

            toast('Agendamento realizado! ', {
                description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'MM'h'", {
                    locale: ptBR
                }),
                action: {
                    label: 'Visualizar',
                    onClick: () => router.push('/bookings')
                }

            })

            setHour(undefined);
            setDate(undefined);
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitIsLoading(false);
        }
    }
    const handleBookingClick = () => {
        if (!isAuthenticated) {
            return (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="secondary">
                            Reservar
                        </Button>
                    </SheetTrigger>

                    <SheetContent className="p-0">
                        <SideMenu />
                    </SheetContent>
                </Sheet>
            );

        }

        return (
            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="secondary">
                        Reservar
                    </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                    <SheetHeader className="text-left border-b border-solid border-secondary p-5">
                        <SheetTitle>Fazer Reserva</SheetTitle>
                    </SheetHeader>

                    <div className="py-5">
                        <Calendar mode="single" selected={date}
                            onSelect={handleDateClick}
                            locale={ptBR}
                            fromDate={new Date()}
                            styles={{
                                head_cell: {
                                    width: '100%',
                                    textTransform: 'capitalize'
                                },
                                cell: {
                                    width: '100%'
                                },
                                button: {
                                    width: '100%'
                                },
                                nav_button_previous: {
                                    width: '32px',
                                    height: '32px'
                                },
                                nav_button_next: {
                                    width: '32px',
                                    height: '32px'
                                },
                                caption: {
                                    textTransform: 'capitalize'
                                }
                            }}
                        />
                    </div>

                    {/* Mostrar lista de horários apenas se alguma data estiver selecionada*/}


                    {date && (<div className="flex overflow-x-auto py-6 px-5 border-t
                        border-solid border-secondary [&::-webkit-scrollbar]:hidden gap-2">

                        {timeList.map(time => (

                            <Button variant={
                                hour === time ? 'default' : 'outline'
                            }
                                className="rounded-full"
                                key={time}
                                onClick={() => handleHourClick(time)}
                            >
                                {time}
                            </Button>

                        ))}

                    </div>)
                    }

                    <div className="py-6 px-5 border-t border-solid border-secondary">
                        <Card>
                            <CardContent className="p-3 flex flex-col gap-3">
                                <div className="flex justify-between">
                                    <h2 className="font-bold">{service.name}</h2>

                                    <h3 className="font-bold text-sm">{Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    }).format(Number(service.price))}
                                    </h3>

                                </div>

                                {date && (
                                    <div className="flex justify-between">
                                        <h3 className="text-gray-400 text-sm">Data</h3>
                                        <h4 className="text-sm">{format(date, "dd 'de' MMMM", {
                                            locale: ptBR
                                        })}</h4>
                                    </div>
                                )}

                                {hour && (
                                    <div className="flex justify-between">
                                        <h3 className="text-gray-400 text-sm">Horário</h3>
                                        <h4 className="text-sm">{hour}</h4>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <h3 className="text-gray-400 text-sm">Barbearia</h3>
                                    <h4 className="text-sm">{barbershop.name}</h4>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    <SheetFooter className="px-5">
                        <Button disabled={!hour || !date || submitIsLoading}
                            onClick={handleBookingSubmit}
                        >
                            {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Reserva
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        )

    }

    return (
        <Card>
            <CardContent className="p-3 w-full">
                <div className="flex gap-4 items-center w-full">
                    <div className="relative min-h-[110px] min-w-[110px] max-w-[110px]">
                        <Image src={String(service.imageUrl)}
                            alt={service.name}
                            fill
                            style={{
                                objectFit: 'contain'
                            }}
                            className="rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <h2 className="font-bold">{service.name}</h2>
                        <p className="text-sm text-gray-400">{service.description}</p>

                        <div className="flex items-center justify-between mt-3">
                            <p className="text-primary font-bold text-sm">{Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            }).format(Number(service.price))}
                            </p>

                            {handleBookingClick()}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ServiceItem;