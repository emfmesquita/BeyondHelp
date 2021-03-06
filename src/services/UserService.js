import $ from "jquery";
import PageScriptService from "./PageScriptService";
let userIdCache = null;


/* global chrome */
class UserService {
    /**
     * Gets the current logged user username.
     */
    static getCurrentUsername(): Promise<string> {
        return new Promise((resolve, reject) => {
            const answer = (value) => chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(value);

            chrome.cookies.getAll({
                domain: ".dndbeyond.com"
            }, (cookies) => {
                if (!cookies) {
                    answer(null);
                    return;
                }

                let cookie = cookies.find(cookie => cookie.name === "User.Username");
                if (cookie) {
                    answer(cookie.value);
                    return;
                }

                cookie = cookies.find(cookie => cookie.name === "User");
                const value = cookie ? cookie.value : null;
                let username = null;
                if (value) {
                    value.split("&").forEach(token => {
                        if (token.startsWith("UserName=")) username = token.replace("UserName=", "");
                    });
                }
                answer(username);
            });
        });
    }

    static getUserID() {
        if (userIdCache) return userIdCache;

        PageScriptService.run('jQuery("body").append(`<div id="bh-user-id" value="${Cobalt.User.ID}"/>`);');

        userIdCache = $("#bh-user-id").attr("value");
        return userIdCache;
    }
}

export default UserService;