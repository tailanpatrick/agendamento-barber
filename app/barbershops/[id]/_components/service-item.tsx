import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import { Service } from "@prisma/client";
import Image from "next/image";

interface ServiceItemProps {
    service: Service
    isAuthenticated: boolean;
}

const ServiceItem = ({ service, isAuthenticated }: ServiceItemProps) => {

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
        
        else {
            return (
                <Button variant="secondary">
                    Reservar
                </Button>
            )
        }
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