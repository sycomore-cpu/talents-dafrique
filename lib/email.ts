import { Resend } from 'resend'

const FROM = "Talents d'Afrique <noreply@talentsdafrique.com>"

// Lazy singleton — never instantiated at module load time so the build
// does not fail when RESEND_API_KEY is absent in the build environment.
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key || key.startsWith('re_placeholder') || key === 're_123') {
    console.log('[Email skipped — add RESEND_API_KEY]', { to, subject })
    return
  }
  try {
    await getResend().emails.send({ from: FROM, to, subject, html })
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

export function emailContactAdmin(name: string, email: string, subject: string, message: string) {
  return {
    subject: `📨 Nouveau message contact — ${subject || 'Sans sujet'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique — Admin</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Nouveau message depuis le formulaire contact</h2>
          <p><strong>De :</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Sujet :</strong> ${subject || '(non renseigné)'}</p>
          <hr style="border: none; border-top: 1px solid #E8D5B7; margin: 16px 0;" />
          <p style="color: #5C3D1E; white-space: pre-wrap;">${message.replace(/</g, '&lt;')}</p>
          <a href="https://talentsdafrique.com/admin?tab=messages"
             style="display: inline-block; background: #C8920A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Ouvrir l'espace admin →
          </a>
        </div>
      </div>
    `
  }
}

export function emailReportNew(reporterName: string, reportedName: string, reason: string, details: string) {
  return {
    subject: `🚨 Signalement — ${reportedName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7F1D1D; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #FEE2E2; margin: 0; font-size: 20px;">Talents d'Afrique — Modération</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Nouveau signalement</h2>
          <p><strong>Signalé par :</strong> ${reporterName}</p>
          <p><strong>Profil signalé :</strong> ${reportedName}</p>
          <p><strong>Motif :</strong> ${reason}</p>
          ${details ? `<p><strong>Détails :</strong><br/><span style="white-space: pre-wrap;">${details.replace(/</g, '&lt;')}</span></p>` : ''}
          <a href="https://talentsdafrique.com/admin?tab=moderation"
             style="display: inline-block; background: #C8920A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Ouvrir la modération →
          </a>
        </div>
      </div>
    `
  }
}

export function emailKorysAdded(userName: string, amount: number, reason: string) {
  return {
    subject: `🪙 +${amount} Korys crédités sur votre compte`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Bonne nouvelle ${userName} !</h2>
          <p style="color: #5C3D1E;">L'équipe vient de vous créditer <strong>${amount} Korys</strong>.</p>
          ${reason ? `<p style="color: #5C3D1E;"><em>Motif : ${reason}</em></p>` : ''}
          <a href="https://talentsdafrique.com/dashboard?tab=korys"
             style="display: inline-block; background: #C8920A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Voir mon solde →
          </a>
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
