// Outputs: /builtwith.json

import type { APIRoute } from "astro";

import { Resend } from "resend";


const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const nombre = formData.get("nombre");
        const empresa = formData.get("empresa") || "No especificada";
        const correo = formData.get("correo");
        const telefono = formData.get("telefono") || "No especificado";
        const mensaje = formData.get("mensaje");

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev", // NUNCA PONGAS UN @GMAIL.COM AQUÍ. Siempre onboarding@resend.dev para pruebas.
            to: "daco010203@gmail.com", // AQUÍ va tu correo registrado en Resend
            subject: `Nuevo contacto de: ${nombre}`,
            html: `
                <h2>Nuevo mensaje desde la Web</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Empresa:</strong> ${empresa}</p>
                <p><strong>Correo:</strong> ${correo}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje}</p>
            `,
        });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        // Si se envió bien, redirigir a una página o enviar respuesta success
        // Para formularios normales es mejor redirigir, pero aquí mandamos JSON.
        // Opcional: podrías retornar Response.redirect('/gracias', 302);
        return new Response(JSON.stringify({ message: "Correo enviado con éxito", data }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: "Error procesando el formulario", detalle: err?.message || String(err) }), { status: 500 });
    }
};