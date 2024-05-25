"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { Booking } from "@prisma/client";
import { isFuture, isPast } from "date-fns";

export const cancelBooking = async (booking: Booking) => {
    if (isPast(booking.date)) {
            throw new Error(`A data informada corresponde a uma reserva já finalizada!
            \n No usuário de ID: ${booking.userId}`);
    }
    
    const deletedBooking = await db.booking.delete({
        where: {
            id: booking.id,
        },
        include: {
            barbershop: true
        }
    })
    revalidatePath('/bookings');
    revalidatePath('/');
    return deletedBooking;
};