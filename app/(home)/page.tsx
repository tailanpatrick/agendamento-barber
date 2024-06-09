import Header from "../_components/header";
import Search from "@/app/_components/search";
import BookingItem from '../_components/booking-item';
import BarbershopItem from "./_components/barbershop-item";
import { db } from "../_lib/prisma";
import WelcomeDate from "./_components/welcome-date";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

import { Badge } from "@/app/_components/ui/badge";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const currentDate = new Date();

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),

    session?.user ? await db.booking.findMany({
      where: {
        date: {
          gte: currentDate
        },
        userId: (session.user as any).id
      },
      orderBy: {
        date: 'asc'
      },

      include: {
        service: true,
        barbershop: true
      }
    }) : Promise.resolve()
  ])


  return (
    <div>
      <Header />

      <WelcomeDate />

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">

        {session?.user &&
          (<h2 className="text-xs ml-2 mb-3 uppercase text-gray-400 text-bold">
            Agendamentos próximos
          </h2>)
        }

        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {session?.user && (confirmedBookings && confirmedBookings.length ? confirmedBookings.map(booking => (
            <BookingItem booking={booking} key={booking.id} />
          )) : (
            <Badge variant="secondary">
              <p>Nenhum agendamento próximo</p>
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6">

        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Recomendados</h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">

              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>

      </div>

      <div className="mt-6 mb-[3.75rem]">

        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Populares</h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">

              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>

      </div>


    </div>
  );
}
