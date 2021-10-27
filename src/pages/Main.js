import { Lightning, Router } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";
import { ItemDescription, Page } from "../components";

export default class Main extends Page {
    static _template() {
        return {
            Content: {x: 140, type: List, w: w => w, y: 580, h: 500, direction: 'column', scroll: 0, scrollTransition: {duration: 0.4}}
        }
    }

    pageTransition(pageIn, pageOut) {
        const menu = pageIn.widgets.menu;
        if(menu.alpha !== 1) {
            menu.visible = true;
            menu.alpha = 0.001;
            menu.setSmooth('alpha', 1, {delay: 0.2, duration: 0.2});
        }
        return super.pageTransition(pageIn, pageOut);
    }

    _getFocused() {
        return this.tag('Content');
    }

    $updateItemTitle(e) {
        this.tag('ItemDescription').item = e;
    }

    addStrips(array) {
        // const {backdrop, title, description} = array[0].items[0].item;
        // this.fireAncestors('$updateBackdrop', {src: backdrop});
        // this.fireAncestors('$getDetailWidget').show({title, description});
        this.tag('Content').add(array);
        this._refocus();
    }

    _handleLeft() {
        Router.focusWidget('Menu');
    }
}