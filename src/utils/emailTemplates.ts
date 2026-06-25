interface Car {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface Maintenance {
  name: string;
  type: string;
  product: string;
  odometer: number;
  nextMaintenance: Date;
  intervalMonths: number;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ReminderEmailData {
  maintenance: Maintenance;
  user: User;
  car: Car | null;
  daysUntil: number;
}

export interface ReminderEmail {
  subject: string;
  html: string;
}

function getStatusLabel(daysUntil: number): { label: string; color: string } {
  if (daysUntil < 0) {
    return { label: `Overdue by ${Math.abs(daysUntil)} day(s)`, color: '#dc2626' };
  }
  if (daysUntil === 0) {
    return { label: 'Due today', color: '#d97706' };
  }
  if (daysUntil <= 7) {
    return { label: `Due in ${daysUntil} day(s)`, color: '#d97706' };
  }
  return { label: `Due in ${daysUntil} day(s)`, color: '#16a34a' };
}

function getSubject(maintenanceName: string, daysUntil: number): string {
  if (daysUntil < 0) {
    return `[OVERDUE] ${maintenanceName} maintenance is overdue`;
  }
  if (daysUntil === 0) {
    return `[TODAY] ${maintenanceName} maintenance is due today`;
  }
  return `[REMINDER] ${maintenanceName} maintenance due in ${daysUntil} day(s)`;
}

export function buildReminderEmail(data: ReminderEmailData): ReminderEmail {
  const { maintenance, user, car, daysUntil } = data;
  const { label, color } = getStatusLabel(daysUntil);
  const subject = getSubject(maintenance.name, daysUntil);

  const nextDate = new Date(maintenance.nextMaintenance).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const carSection = car
    ? `
    <tr>
      <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
        <strong>Vehicle</strong>
      </td>
      <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
        ${car.year} ${car.make} ${car.model}
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
        <strong>License Plate</strong>
      </td>
      <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
        ${car.licensePlate}
      </td>
    </tr>`
    : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1e40af; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">
                Car Maintenance Reminder
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 24px 32px 16px;">
              <p style="margin: 0; font-size: 16px; color: #374151;">
                Hello <strong>${user.firstName} ${user.lastName}</strong>,
              </p>
              <p style="margin: 12px 0 0; font-size: 15px; color: #6b7280;">
                This is a reminder about an upcoming or overdue maintenance for your vehicle.
              </p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 8px 32px 24px;">
              <span style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ${label}
              </span>
            </td>
          </tr>

          <!-- Details Table -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; font-size: 14px; color: #374151;">
                <tr>
                  <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; width: 40%;">
                    <strong>Maintenance</strong>
                  </td>
                  <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
                    ${maintenance.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong>Type</strong>
                  </td>
                  <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;">
                    ${maintenance.type}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong>Product Used</strong>
                  </td>
                  <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
                    ${maintenance.product}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong>Last Odometer</strong>
                  </td>
                  <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
                    ${maintenance.odometer.toLocaleString()} km
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong>Due Date</strong>
                  </td>
                  <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
                    ${nextDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <strong>Interval</strong>
                  </td>
                  <td style="padding: 8px 16px; border-bottom: 1px solid #e5e7eb;">
                    Every ${maintenance.intervalMonths} month(s)
                  </td>
                </tr>
                ${carSection}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                You received this email because you have maintenance reminders enabled.
                To manage your notification preferences, log in to your account.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}
