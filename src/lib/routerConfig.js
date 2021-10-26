import { Item, Page } from "../components";
import { Main, Search, Splash } from "../pages";
import { getDetailPage, getHomePage, getMoviesPage, getSearchResults, getSeriesPage } from "./api.js";
import { applyItemModel, createItemCollection, createPageComponents } from "./Factory.js";
import { Lightning, Router } from "@lightningjs/sdk";
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
        widgets: ['menu', 'detail']
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
        widgets: ['menu', 'detail']
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
        widgets: ['menu', 'detail']
    },
    {
        path: 'search',
        component: Search,
        widgets: ['inputfield'],
        on: async (page) => {
            page.tag('Content').itemType = Item;
            page.onSearch = async (input) => {
                return getSearchResults(input)
                    .then((response) => {
                        return createItemCollection(response);
                    });
            }
            return true;
        },
        widgets: ['inputfield', 'detail']
    },
    {
        path: 'detail/:mediaType/:mediaId',
        component: class Detail extends Page {
            pageTransition(pageIn, pageOut) {
                pageOut.setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
                pageIn.widgets.menu.setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
                // pageIn.widgets.inputfield.setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
                return this._pageTransition(pageIn, pageOut);
            }
            _active() {
                Router.focusWidget('detail');
            }
        },
        before: async (page, {mediaType, mediaId}) => {
            getDetailPage(mediaType, mediaId)
                .then((response) => {
                    const dataItem = applyItemModel(response);
                    page.widgets.detail.show(dataItem);
                    page.widgets.detail.showMore(dataItem);
                    return true;
                });
        },
        widgets: ['detail']
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