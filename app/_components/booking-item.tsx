import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";


const BookingItem = () => {
    return (
        <Card>
            <CardContent className="px-3 flex justify-between py-0">
                <div className="flex flex-col gap-3 px-3 py-5">
                    <Badge className="bg-[#221C3D] text-primary hover:bg-[#221C3D] w-fit">Confirmado</Badge>
                    <h2 className="font-bold">Corte de Cabelo</h2>

                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRDYhnG5nyT-aGEnY4OHZaJ4JvHw-F9k_WfUkZix8oAg&s" />
                            <AvatarFallback>CC</AvatarFallback>
                        </Avatar>

                        <h3 className="text-sm">Vintage Barber</h3>
                    </div>
                </div>

                <div className="px-2 pl-6 flex flex-col items-center justify-center border-l border-solid border-secondary">
                    <p className="text-sm">Fevereiro </p>
                    <p className="text-2xl font-bold">06</p>
                    <p className="text-sm">9:45h</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default BookingItem;