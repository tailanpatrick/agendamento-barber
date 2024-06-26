import { authOptions } from "@/app/_lib/auth"
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getServerSession } from "next-auth";

const WelcomeDate = async () => {
    const  data  = await getServerSession(authOptions);
    const username = data?.user?.name?.split(' ').slice(0,2).join(' ');

    return (<div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, {username ? username : ' vamos agendar um corte hoje?'}</h2>
        <p className="capitalize text-sm ">{format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
        })}
        </p>
    </div>);
}

export default WelcomeDate;