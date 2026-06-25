import cron from 'node-cron';
import { Resend } from 'resend';
import { prisma } from '../db/prisma';
import { config } from '../config';
import { buildReminderEmail } from '../utils/emailTemplates';
import { getDaysUntil } from '../utils/dateHelper';

const resend = new Resend(config.resendApiKey);

async function sendReminders(): Promise<void> {
  console.log('[sendReminders] Starting daily reminder job...');

  try {
    const maintenances = await prisma.maintenance.findMany({
      where: {
        owner: {
          emailEnabled: true,
        },
      },
      include: {
        owner: true,
        car: true,
      },
    });

    console.log(`[sendReminders] Found ${maintenances.length} maintenance records to check`);

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    for (const maintenance of maintenances) {
      const { owner, car } = maintenance;
      const daysUntil = getDaysUntil(maintenance.nextMaintenance);

      // Check if today matches a reminder day or if it's 7 days overdue
      const shouldSend =
        owner.daysBeforeReminder.includes(daysUntil) || daysUntil === -7;

      if (!shouldSend) {
        skipped++;
        continue;
      }

      try {
        const { subject, html } = buildReminderEmail({
          maintenance: {
            name: maintenance.name,
            type: maintenance.type,
            product: maintenance.product,
            odometer: maintenance.odometer,
            nextMaintenance: maintenance.nextMaintenance,
            intervalMonths: maintenance.intervalMonths,
          },
          user: {
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
          },
          car: car
            ? {
                make: car.make,
                model: car.model,
                year: car.year,
                licensePlate: car.licensePlate,
              }
            : null,
          daysUntil,
        });

        await resend.emails.send({
          from: config.fromEmail,
          to: owner.email,
          subject,
          html,
        });

        console.log(
          `[sendReminders] Sent reminder to ${owner.email} for maintenance '${maintenance.name}' (daysUntil=${daysUntil})`,
        );
        sent++;
      } catch (emailErr) {
        console.error(
          `[sendReminders] Failed to send email to ${owner.email} for maintenance '${maintenance.name}':`,
          emailErr,
        );
        errors++;
      }
    }

    console.log(
      `[sendReminders] Job complete — sent: ${sent}, skipped: ${skipped}, errors: ${errors}`,
    );
  } catch (err) {
    console.error('[sendReminders] Fatal error during reminder job:', err);
  }
}

export function startReminderJob(): void {
  cron.schedule(
    '0 9 * * *',
    async () => {
      await sendReminders();
    },
    { timezone: 'UTC' },
  );

  console.log('[sendReminders] Daily reminder cron job scheduled (09:00 UTC)');
}
