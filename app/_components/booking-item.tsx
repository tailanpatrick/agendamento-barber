"use client"
import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: true
            barbershop: true
        }
    }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const isBookingFinalized = isPast(booking.date);

    const handleCancelClick = async () => {
        setIsDeleteLoading(true);

        try {
            const bookingCancelled = await cancelBooking(booking);
            const barberShopCancelled = bookingCancelled.barbershop.name;
            const dateHourCancelled = format(bookingCancelled.date, "em dd 'de' MMMM, 'às' HH:mm'h'", {
                locale: ptBR
            })
            console.log(dateHourCancelled)
            console.log(barberShopCancelled)
            toast.success(`Agendamento em ${barberShopCancelled}, ${dateHourCancelled}, cancelado com sucesso.`)
        } catch(err) {

        } finally {
            setIsDeleteLoading(false);
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Card className="min-w-full md:min-w-[32%]">
                    <CardContent className="px-5 flex py-0">
                        <div className="flex flex-col flex-[3] gap-3 px-3 py-5">
                            <Badge variant={
                                isBookingFinalized ? 'secondary' : 'default'
                            } className="w-fit">
                                {isBookingFinalized ? "Finalizado" : "Confirmado"}
                            </Badge>
                            <h2 className="font-bold">{booking.service.name}</h2>

                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={booking.barbershop.imageUrl} />
                                    <AvatarFallback>CC</AvatarFallback>
                                </Avatar>

                                <h3 className="text-sm">{booking.barbershop.name}</h3>
                            </div>
                        </div>

                        <div className="pl-6 flex flex-col flex-1 items-center justify-center border-l border-solid border-secondary">
                            <p className="text-sm capitalize">
                                {format(booking.date, "MMMM", {
                                    locale: ptBR
                                })}
                            </p>

                            <p className="text-2xl font-bold">
                                {format(booking.date, "dd")}
                            </p>

                            <p className="text-sm">
                                {format(booking.date, "HH:mm'h'", {
                                    locale: ptBR
                                })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>

            <SheetContent className=" px-3">
                <SheetHeader className="text-left px-5 pb-6 border-b border-solid border-secondary">
                    <SheetTitle>Informações do Agendamento</SheetTitle>
                </SheetHeader>
                <div className="">
                    <div className="relative h-[180px] mt-6">
                        <Image src="/barbershop-map.png"
                            alt={booking.barbershop.name}
                            style={{
                                objectFit: 'contain'
                            }}
                            fill />

                        <div className="w-full absolute bottom-4 left-0 px-5">
                            <Card className="mx-5 p-1">
                                <CardContent className="p-3 flex gap-2">
                                    <Avatar>
                                        <AvatarImage src={booking.barbershop.imageUrl} />
                                    </Avatar>

                                    <div>
                                        <h2 className="font-bold">{booking.barbershop.name}</h2>
                                        <p className="text-xs overflow-hidden text-nowrap text-ellipsis">{booking.barbershop.address}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Badge variant={
                        isBookingFinalized ? 'secondary' : 'default'
                    } className="w-fit mt-3 mx-2 my-3">
                        {isBookingFinalized ? "Finalizado" : "Confirmado"}
                    </Badge>

                    <Card>
                        <CardContent className="p-3 flex flex-col gap-3">
                            <div className="flex justify-between">
                                <h2 className="font-bold">{booking.service.name}</h2>

                                <h3 className="font-bold text-sm">{Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                }).format(Number(booking.service.price))}
                                </h3>

                            </div>

                            <div className="flex justify-between">
                                <h3 className="text-gray-400 text-sm">Data</h3>
                                <h4 className="text-sm">{format(booking.date, "dd 'de' MMMM", {
                                    locale: ptBR
                                })}</h4>
                            </div>


                            <div className="flex justify-between">
                                <h3 className="text-gray-400 text-sm">Horário</h3>
                                <h4 className="text-sm">{format(booking.date, "HH:mm")}</h4>
                            </div>

                            <div className="flex justify-between">
                                <h3 className="text-gray-400 text-sm">Barbearia</h3>
                                <h4 className="text-sm">{booking.barbershop.name}</h4>
                            </div>
                        </CardContent>
                    </Card>

                    <SheetFooter className="flex flex-row gap-4 mt-6">
                        <SheetClose asChild>
                            <Button variant="secondary" className="w-full">Voltar</Button>
                        </SheetClose>
                        <Button variant="destructive"
                            className="w-full"
                            disabled={isBookingFinalized || isDeleteLoading}
                            onClick={handleCancelClick}
                        >
                        {isDeleteLoading && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                        Cancelar Reserva</Button>
                    </SheetFooter>

                </div>

            </SheetContent>
        </Sheet>
    );
}

export default BookingItem;