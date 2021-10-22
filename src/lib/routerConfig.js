import { Item } from "../components";
import { Detail, Main, Search, Splash } from "../pages";
import { getDetailPage, getHomePage, getMoviesPage, getSearchResults, getSeriesPage } from "./api.js";
import { applyItemModel, createItemCollection, createPageComponents } from "./Factory.js";

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
    },
    {
        path: 'detail/:mediaType/:mediaId',
        component: Detail,
        before: async (page, {mediaType, mediaId}) => {
            getDetailPage(mediaType, mediaId)
                .then((response) => {
                    page.setData(applyItemModel(response));
                    return true;
                });
        }
    },
    {
        path: '$',
        component: Splash
    },
]

export default {
    root: routes[0].path,
    routes
}