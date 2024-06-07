import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";

const BookingPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect('/');
    }

    const [ confirmedBookings, finishedBookings ] = await Promise.all([
        db.booking.findMany({
            where: {
                userId: (session.user as any).id,
                date: {
                    gte: new Date(),
                }
            },
            include: {
                service: true,
                barbershop: true
            },
            orderBy: {
                date: 'asc'
            }
        }),

        db.booking.findMany({
            where: {
                userId: (session.user as any).id,
                date: {
                    lt: new Date(),
                }
            },
            include: {
                service: true,
                barbershop: true
            },
            orderBy: {
                date: 'desc'
            }
        })
    ]);

    return (<>
        <Header />


        <div className="px-5 py-6 min-h-[83.7vh]">
            <h1 className="text-xl font-bold mb-6">Agendamentos</h1>

            <h2 className="text-gray-400 uppercase font-bold text-sm mb-3">Confirmados</h2>

            <div className="flex flex-col gap-3">

            {confirmedBookings.length ? confirmedBookings.map(booking => (
                    <BookingItem booking={booking} key={booking.id} />
                )) : (
                    <p>Nenhum agendamento confirmado</p>
                )}
            </div>

            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Finalizados</h2>

            <div className="flex flex-col gap-3">

                {finishedBookings.length ? finishedBookings.map(booking => (
                    <BookingItem booking={booking} key={booking.id} />
                )) : (
                    <p>Nenhum agendamento finalizado</p>
                )}
            </div>
        </div>

    </>)
}

export default BookingPage;