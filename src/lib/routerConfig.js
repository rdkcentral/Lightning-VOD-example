import { Main } from "../pages";
import { getHomePage, getMoviesPage, getSeriesPage } from "./api.js";
import { createPageComponents } from "./Factory.js";

const routes = [
    {
        path: 'home',
        component: Main,
        on: async (page) => {
            getHomePage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true;
                })
        },
        widgets: ['menu']
    },
    {
        path: 'movies',
        component: Main,
        on: async (page) => {
            getMoviesPage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true;
                })
        },
        widgets: ['menu']
    },
    {
        path: 'series',
        component: Main,
        on: async (page) => {
            getSeriesPage()
                .then((response) => {
                    page.addStrips(createPageComponents(response));
                    return true;
                })
        },
        widgets: ['menu']
    }
]

export default {
    root: routes[0].path,
    routes
}