import { Auth } from "aws-amplify";

function isAdmin(currentPath) {
    return currentPath.includes("/admin");
}

function isDashboard(currentPath) {
    return currentPath.includes("/dashboard");
}

function isLandingPage(currentPath) {
    return currentPath === "/";
}


export const AuthenticateUser = async () => {
    const currentPath = window.location.pathname;
    // console.log("currentPath",currentPath)
    // if (currentPath != '/') {
        try {
            const user = await Auth.currentAuthenticatedUser()
            // console.log("user", user);
            if(isLandingPage(currentPath)){
                window.location.pathname = (user.attributes["custom:role"] === "admin" || !("custom:role" in user.attributes)) ? "/admin" : "/dashboard";
            }else if ((isAdmin(currentPath) && (("custom:role" in user.attributes) && (["Writer", "Member", "reader"].some(role => user.attributes["custom:role"].includes(role)))))) {
                window.location.pathname = "/403";
            }
            else if (isDashboard(currentPath) && (user.attributes["custom:role"] === "admin" || !("custom:role" in user.attributes))){
                window.location.pathname = "/admin";
            }
            else {
                return user;
            }

        } catch (error) {
            if (isAdmin(currentPath)){
                window.location.pathname = "/admin/login";
            }else if(!isLandingPage(currentPath)){
                window.location.pathname = "/";
            }else{
                return;
            }
        }
    // }

};