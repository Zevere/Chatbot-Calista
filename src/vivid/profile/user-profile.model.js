// @flow
/**
``` 
  UserProfile: {
    description: Profile of a Zevere user
    id:
     type:         string
     description:  User ID
    firstName:	
      type:        string
      description: User first name
    lastName:
      type:        string
      description: User last name
    joinedAt:	
      type:        string($date-time)
      description: The date account was created in UTC
  }
```
 */
export type UserProfile = {
    id: string,
    firstName: string,
    lastName: string,
    joinedAt: string,
};
