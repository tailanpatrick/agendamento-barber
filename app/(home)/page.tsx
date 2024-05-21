import Header from "../_components/header";
import Search from "./_components/search";
import BookingItem from '../_components/booking-item';
import BarbershopItem from "./_components/barbershop-item";
import { Barbershop } from '@prisma/client';
import { db } from "../_lib/prisma";
import WelcomeDate from "./_components/welcome-date";

export default async function Home() {

  const barbershops = await db.barbershop.findMany({});

  return (
    <div>
      <Header />

      <WelcomeDate />

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-xs ml-2 mb-3 uppercase text-gray-400 text-bold">
          Agendamentos
        </h2>
        {/* <BookingItem /> */}
      </div>

      <div className="mt-6">

        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Recomendados</h2>
        
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"> 
          {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop}/>
          ))}
        </div>

      </div>

      <div className="mt-6 mb-[3.75rem]">
        
        <h2 className="px-5 text-xs mb-3 uppercase text-gray-400 font-bold">Populares</h2>
        
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"> 
          {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop}/>
          ))}
        </div>

      </div>

      
    </div>
  );
}
