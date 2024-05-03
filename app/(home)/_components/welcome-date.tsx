"use client"

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession } from "next-auth/react";

const WelcomeDate =  () => {
    const { data } = useSession();
    const username = data?.user?.name?.split(' ').slice(0,2).join(' ');

    return (<div className="px-5 pt-5">
        {username && <h2 className="text-xl font-bold">Olá, {username}</h2>}
        <p className="capitalize text-sm ">{format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
        })}
        </p>
    </div>);
}

export default WelcomeDate;