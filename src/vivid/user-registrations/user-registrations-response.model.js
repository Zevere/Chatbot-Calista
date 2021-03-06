// @flow
import { UserRegistration } from './user-registration.model';

/**
```
UserRegistrationsResponse: {
    description: Contains a list of associations of a Zevere account with chat platforms
    username:
      type:        string
      description: ID of the Zevere user account
    registrations: [
      type:        UserRegistration
      description: List of user registrations
      minLength:   1
      uniqueItems: false
    ]
}
```
*/
export type UserRegistrationsResponse = {
    username: string,
    registrations: UserRegistration[],
};
