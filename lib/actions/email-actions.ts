"use server"

import { createActionClient } from "@/lib/supabase/server"
import nodemailer from "nodemailer"

type EmailData = {
  to: string
  subject: string
  html: string
}

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes cambiar a otro servicio como SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER || "notificaciones@reciclapp.com", // Reemplazar con tu email real
    pass: process.env.EMAIL_PASSWORD || "app_password", // Reemplazar con tu contraseña real o app password
  },
})

// Función para enviar correo de notificación de inicio de sesión
export async function enviarNotificacionLogin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createActionClient()

    // Obtener información del usuario
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("nombre, correo, ultima_conexion")
      .eq("id", userId)
      .single()

    if (error || !usuario) {
      console.error("Error al obtener información del usuario:", error)
      return { success: false, error: "No se pudo obtener la información del usuario" }
    }

    // Formatear fecha y hora
    const fechaHora = new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    // Preparar el contenido del correo
    const emailData: EmailData = {
      to: usuario.correo,
      subject: "Inicio de sesión detectado en ReciclApp",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://reciclapp.com/logo.png" alt="ReciclApp Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #2e7d32; text-align: center;">Hola ${usuario.nombre}</h2>
          <p>Hemos detectado un inicio de sesión en tu cuenta de ReciclApp.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Fecha y hora:</strong> ${fechaHora}</p>
            <p><strong>Dispositivo:</strong> Navegador web</p>
          </div>
          <p>Si fuiste tú, puedes ignorar este mensaje. Si no reconoces esta actividad, te recomendamos cambiar tu contraseña inmediatamente.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://reciclapp.com/recuperar-contrasena" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Cambiar mi contraseña</a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #757575; text-align: center;">
            Este es un mensaje automático, por favor no respondas a este correo.
          </p>
        </div>
      `,
    }

    // Enviar el correo
    await transporter.sendMail({
      from: '"ReciclApp" <notificaciones@reciclapp.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    // Registrar el envío del correo en la base de datos (opcional)
    await supabase.from("notificaciones_email").insert({
      usuario_id: userId,
      tipo: "login",
      fecha_envio: new Date().toISOString(),
      email_destino: usuario.correo,
    })

    return { success: true }
  } catch (error) {
    console.error("Error al enviar notificación por correo:", error)
    return { success: false, error: "Error al enviar la notificación por correo" }
  }
}

// Función para enviar correo de bienvenida al registrarse
export async function enviarCorreoBienvenida(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createActionClient()

    // Obtener información del usuario
    const { data: usuario, error } = await supabase.from("usuarios").select("nombre, correo").eq("id", userId).single()

    if (error || !usuario) {
      console.error("Error al obtener información del usuario:", error)
      return { success: false, error: "No se pudo obtener la información del usuario" }
    }

    // Preparar el contenido del correo
    const emailData: EmailData = {
      to: usuario.correo,
      subject: "¡Bienvenido a ReciclApp!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://reciclapp.com/logo.png" alt="ReciclApp Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #2e7d32; text-align: center;">¡Bienvenido a ReciclApp, ${usuario.nombre}!</h2>
          <p>Gracias por unirte a nuestra comunidad de reciclaje. Estamos emocionados de tenerte con nosotros.</p>
          <p>Con ReciclApp podrás:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 10px; padding-left: 25px; background: url('https://reciclapp.com/check.png') no-repeat left center; background-size: 18px;">Conectar con recicladores y empresas</li>
            <li style="margin-bottom: 10px; padding-left: 25px; background: url('https://reciclapp.com/check.png') no-repeat left center; background-size: 18px;">Publicar materiales reciclables</li>
            <li style="margin-bottom: 10px; padding-left: 25px; background: url('https://reciclapp.com/check.png') no-repeat left center; background-size: 18px;">Aprender sobre prácticas sostenibles</li>
            <li style="margin-bottom: 10px; padding-left: 25px; background: url('https://reciclapp.com/check.png') no-repeat left center; background-size: 18px;">Contribuir a un planeta más limpio</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://reciclapp.com/bienvenida" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Comenzar ahora</a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #757575; text-align: center;">
            Si tienes alguna pregunta, no dudes en contactarnos a <a href="mailto:soporte@reciclapp.com">soporte@reciclapp.com</a>
          </p>
        </div>
      `,
    }

    // Enviar el correo
    await transporter.sendMail({
      from: '"ReciclApp" <notificaciones@reciclapp.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    return { success: true }
  } catch (error) {
    console.error("Error al enviar correo de bienvenida:", error)
    return { success: false, error: "Error al enviar el correo de bienvenida" }
  }
}
