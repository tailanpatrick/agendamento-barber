import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { isFuture, isPast } from "date-fns";

const BookingPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect('/');
    }

    const bookings = await db.booking.findMany({
        where: {
            userId: (session.user as any).id
        },
        include: {
            service: true,
            barbershop: true
        },
        orderBy: {
            date: 'desc'
        }
    })

    const confirmedBookings = bookings.filter(booking => isFuture(booking.date)).reverse();
    const finalizedBookings = bookings.filter(booking => isPast(booking.date))

    return (<>
        <Header />


        <div className="px-5 py-6">
            <h1 className="text-xl font-bold">Agendamentos</h1>

            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Confirmados</h2>

            <div className="flex flex-col gap-3">

                {confirmedBookings.map(booking => <BookingItem booking={booking} key={booking.id} />)}
            </div>

            <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Finalizados</h2>

            <div className="flex flex-col gap-3">

                {finalizedBookings.map(booking => <BookingItem booking={booking} key={booking.id} />)}
            </div>
        </div>

    </>)
}

export default BookingPage;