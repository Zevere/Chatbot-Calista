/**
 * A type representing the Options object sent from Slack.
 * 
 * @see https://api.slack.com/dialogs#dynamic_select_elements_external
 */
export type Options = {
    type: string,
    token: string,
    action_ts: string,
    team: {
      id: string,
      domain: string
    },
    user: {
      id: string,
      name: string
    },
    channel: {
      id: string,
      name: string
    },
    name: string,
    value: string,
    callback_id: string
};
