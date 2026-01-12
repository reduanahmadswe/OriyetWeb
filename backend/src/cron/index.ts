import { startEventReminderCron } from './eventReminder.cron.js';
import { startEventStatusCron } from './eventStatus.cron.js';
import { startPaymentCleanup } from './paymentCleanup.cron.js';
import { startOtpCleanup } from './otpCleanup.cron.js';

export const initCronJobs = () => {
  console.log('🚀 Initializing cron jobs...');
  
  startEventReminderCron();
  startEventStatusCron();
  startPaymentCleanup();
  startOtpCleanup();
  
  console.log('✅ All cron jobs initialized');
};
