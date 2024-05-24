"use server"

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface SaveBookingParams {
    barbershopId: string;
    serviceId: string;
    userId: string;
    date: Date
}

export const saveBooking = async (params : SaveBookingParams) => {

    const utcDate = new Date(params.date.toISOString());

    await db.booking.create({
        data: {
            barbershopId: params.barbershopId,
            serviceId: params.serviceId,
            userId: params.userId,
            date: utcDate,
        }
    })
    revalidatePath('/');
    revalidatePath('/bookings')
}