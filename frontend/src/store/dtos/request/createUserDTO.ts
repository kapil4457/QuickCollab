/*
 "profilePicture":"",
    "firstName":"CONTENT",
    "lastName":"CREATOR 2",
    "emailId":"contentcreator2@gmail.com",
    "password":"password",
    "registerationMethod":"CREDENTIALS_LOGIN",
    "userRole":"CONTENT_CREATOR"

*/
export interface createUserDTO {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  registerationMethod: string;
  userRole: string;
  profilePicture?: string;
}
