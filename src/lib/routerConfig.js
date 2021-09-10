import { Main } from "../pages";
import { getHomePage } from "./api.js";
import { createPageComponents } from "./Factory.js";

const routes = [
    {
        path: 'home',
        component: Main,
        on: async (page) => {
            getHomePage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true
                })
        },
        widgets: ['menu']
    }
]

export default {
    root: routes[0].path,
    routes
}