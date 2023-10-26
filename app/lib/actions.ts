'use server';

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const DeleteInvoice = FormSchema.pick({ id: true });

export async function deleteInvoice(formData: FormData) {
    // throw new Error('Failed to Delete Invoice');

    const { id } = DeleteInvoice.parse({
        id: formData.get('id'),
    });

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}