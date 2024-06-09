import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";
import { redirect } from "next/navigation";
import Search from "@/app/_components/search";

interface BarbershopsPageProps {
    searchParams: {
        search?: string
    }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
    if (!searchParams.search){
        return redirect('/')
    }

    const barbershops = await db.barbershop.findMany({
        where: {
            name: {
                contains: searchParams.search,
                mode: 'insensitive'
            }
        }
    })

    return (<>
        <Header />

        <div className="px-5 mt-6">
            <Search defaultValue={{
                search: searchParams.search
            }}/>
        </div>

        <div className="px-5 py-6 min-h-[83.7vh]">
            <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{searchParams.search}&quot;</h1>

            <div className="grid grid-cols-2 mt-3 gap-3">
                {barbershops.map(barbershop => (
                    <div key={barbershop.id} className="w-full">

                        <BarbershopItem barbershop={barbershop} />
                    </div>
                ))}
            </div>
        </div>
    </>);
}

export default BarbershopsPage;