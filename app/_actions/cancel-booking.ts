"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export const cancelBooking = async (bookingId: string) => {
    const deletedBooking = await db.booking.delete({
        where: {
            id: bookingId
        },
        include: {
            barbershop: true
        }
    })
    revalidatePath('/bookings');

    return deletedBooking;
};