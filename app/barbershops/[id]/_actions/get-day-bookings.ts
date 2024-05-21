"use server"

import { db } from "@/app/_lib/prisma"
import { Barbershop } from "@prisma/client"
import { endOfDay, startOfDay } from 'date-fns';


export const getDayBookings = async (date: Date, barbershop: Barbershop) => {

    const bookings = await db.booking.findMany({
        where: {
            barbershopId: barbershop.id,
            date: {
                lte: endOfDay(date),
                gte: startOfDay(date),
            }
        }
    })

    return bookings;
}