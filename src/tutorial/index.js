import { WebClient } from '@slack/client';
import Winston from '../logging/app.logger';

// The current date
async function tutorial () {
  const currentTime = new Date().toTimeString();
  const token = process.env.ZEVERE_SLACK_TOKEN.trim();
  Winston.info(token);
  const web = new WebClient(token
  //   , {
  //   clientId: process.env.CLIENT_ID,
  //   clientSecret: process.env.CLIENT_SECRET
  // }
  );
  // Use the `apps.permissions.resources.list` method to find the conversation ID for an app home
  try {
    web.auth.test();
    Winston.info(JSON.stringify(web.apps));
    const response = await web.apps.permissions.resources.list();

    // Find the app home to use as the conversation to post a message
    // At this point, there should only be one app home in the whole response since only one user has installed the app
    Winston.info(JSON.stringify(response.resources));
    const appHome = response.resources.find(r => r.type === 'app_home');
    // Use the `chat.postMessage` method to send a message from this app
    Winston.info(JSON.stringify(appHome));
    const result = await web.chat.postMessage({
      channel: appHome.id,
      text: `The current time is ${currentTime}`,

    });
    Winston.info('Message posted!');
    Winston.info(JSON.stringify(result));
  }
  catch(exception) {
    Winston.error(JSON.stringify(exception));
  }

}

module.exports = tutorial;
