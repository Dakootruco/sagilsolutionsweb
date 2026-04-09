// Outputs: /builtwith.json

import type { APIRoute } from "astro";

import { Resend } from "resend";


export const POST: APIRoute = async ({ request }) => {
    try {
        // En Netlify, a veces import.meta.env no está disponible en runtime de la misma forma, process.env es más seguro
        const apiKey = import.meta.env.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : undefined);
        
        if (!apiKey) {
            throw new Error("No se encontró la API Key de Resend (RESEND_API_KEY). Asegúrate de agregarla en Netlify.");
        }

        const resend = new Resend(apiKey);
        
        // Cambiar a JSON para máxima compatibilidad con el entorno Netlify (evita errores nativos de parseo de FormData)
        const body = await request.json();
        const nombre = body.nombre;
        const empresa = body.empresa || "No especificada";
        const correo = body.correo;
        const telefono = body.telefono || "No especificado";
        const mensaje = body.mensaje;

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