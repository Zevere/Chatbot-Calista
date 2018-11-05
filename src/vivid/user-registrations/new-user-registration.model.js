/**
``` 
NewUserRegistration: {
  description:   Contains arguments for associating a Zevere user to his account on a chat platform
  username:
    type:        string
    description: ID of the Zevere user account
  chatUserId:	
    type:        string
    description: Unique identifier of the user on the chat platform
  }

Example:
{
  "username": "string",
  "chatUserId": "string"
}
```
*/
export class NewUserRegistration {
    constructor() {
        this.username = '';
        this.chatUserId = '';
    }
}
