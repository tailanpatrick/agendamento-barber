import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isPast } from 'date-fns';
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: true
            barbershop: true
        }
    }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
    const isBookingFinalized = isPast(booking.date);

    return (
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
                            locale:ptBR
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default BookingItem;