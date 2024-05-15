import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface BarberShopDetailsProps {
    params: {
        id?: string;
    }
}

const BarbershopDetailsPage = async ({ params }: BarberShopDetailsProps) => {
    const session = await getServerSession(authOptions);

    if (!params.id) {
        // TODO: Redirecionar para Home Page
        return null;
    }

    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id
        },
        include: {
            services: true
        }
    });

    if (!barbershop) {
        // TODO: Redirecionar para Home Page
        return null;
    }

    return (
        <div>
            <BarbershopInfo barbershop={barbershop} />

            <div className="px-5 flex flex-col gap-4 py-6">
                {barbershop.services.map(service => (
                    <ServiceItem
                        key={service.id}
                        service={service}
                        barbershop={barbershop}
                        isAuthenticated={!!session}
                    />
                ))}
            </div>

        </div>
    );
}

export default BarbershopDetailsPage;