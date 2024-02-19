
const loggeddata:any =localStorage.getItem("userData");
const parsedloggedin:any =JSON.parse(loggeddata)
export const loggedInby =parsedloggedin?parsedloggedin[0]:null;
