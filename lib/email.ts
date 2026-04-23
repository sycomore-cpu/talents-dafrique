import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "Talents d'Afrique <noreply@talentsdafrique.com>"

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_placeholder')) {
    console.log('[Email skipped — add RESEND_API_KEY]', { to, subject })
    return
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('[Email error]', err)
  }
}

export function emailReservationNew(talentName: string, clientName: string, service: string, date: string) {
  return {
    subject: `🔔 Nouvelle demande : ${service}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Bonjour ${talentName} 👋</h2>
          <p style="color: #5C3D1E;">${clientName} souhaite réserver <strong>${service}</strong> le ${date}.</p>
          <a href="https://talentsdafrique.com/dashboard?tab=reservations"
             style="display: inline-block; background: #C8920A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Voir la demande →
          </a>
          <p style="color: #8B6845; font-size: 12px; margin-top: 24px;">Talents d'Afrique • La communauté des talents de la diaspora</p>
        </div>
      </div>
    `
  }
}

export function emailReservationAccepted(clientName: string, talentName: string, service: string) {
  return {
    subject: `🎉 Votre demande a été acceptée !`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Super nouvelle, ${clientName} ! 🎉</h2>
          <p style="color: #5C3D1E;"><strong>${talentName}</strong> a accepté votre demande pour <strong>${service}</strong>.</p>
          <p style="color: #5C3D1E;">Rendez-vous dans votre espace pour révéler le contact du talent et organiser votre rendez-vous.</p>
          <a href="https://talentsdafrique.com/dashboard?tab=reservations"
             style="display: inline-block; background: #C8920A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Contacter le talent →
          </a>
          <p style="color: #8B6845; font-size: 12px; margin-top: 24px;">Talents d'Afrique • La communauté des talents de la diaspora</p>
        </div>
      </div>
    `
  }
}

export function emailReservationRefused(clientName: string, service: string) {
  return {
    subject: `Votre demande pour ${service}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Bonjour ${clientName}</h2>
          <p style="color: #5C3D1E;">Votre demande pour <strong>${service}</strong> n'a pas pu être acceptée cette fois-ci. D'autres talents peuvent vous aider !</p>
          <a href="https://talentsdafrique.com/talents"
             style="display: inline-block; background: #C8920A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Explorer d'autres talents →
          </a>
          <p style="color: #8B6845; font-size: 12px; margin-top: 24px;">Talents d'Afrique • La communauté des talents de la diaspora</p>
        </div>
      </div>
    `
  }
}
