import 'dotenv/config';
import { createApp } from './app';
import { config } from './config';
import { startReminderJob } from './jobs/sendReminders';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  startReminderJob();
});
