/**
```
  UserRegistration: {
    description: Contains information of a user and the bot connected to him on a specific chat platform
    platform:
      type:        string
      description: Name of the chat platform
    botId:
      type:        string
      description: Unique identifier of the bot that registered that user
    chatUserId:
	  type:        string
      description: Unique identifier of the user on that chat platform
}
```
*/
// @flow
export class UserRegistration {
    platform: string;
    botId: string;
    chatUserId: string;
    
    constructor() {
        this.platform = '';
        this.botId = '';
        this.chatUserId = '';
    }
}
