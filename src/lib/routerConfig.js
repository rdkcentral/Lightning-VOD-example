import { Item } from "../components";
import { Main, Search } from "../pages";
import { getHomePage, getMoviesPage, getSearchResults, getSeriesPage } from "./api.js";
import { createItemCollection, createPageComponents } from "./Factory.js";

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
    },
    {
        path: 'search',
        component: Search,
        widgets: ['inputfield'],
        before: async (page) => {
            page.tag('Grid').itemType = Item;
            page.onSearch = async (input) => {
                return getSearchResults(input)
                    .then((response) => {
                        return createItemCollection(response);
                    });
            }
            return true;
        }
    }
]

export default {
    root: routes[0].path,
    routes
}