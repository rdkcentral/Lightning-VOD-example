import { Lightning, Router } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";
import { ItemDescription } from "../components";

export default class Main extends Lightning.Component {
    static _template() {
        return {
            ItemDescription: {x: 230, y: 90, type: ItemDescription},
            List: {x: 140, type: List, w: w => w, y: 580, h: 500, direction: 'column', scroll: 0, scrollTransition: {duration: 0.4}}
        }
    }

    _getFocused() {
        return this.tag('List');
    }

    $updateItemTitle(e) {
        this.tag('ItemDescription').item = e;
    }

    addStrips(array) {
        const {backdrop, title, description} = array[0].items[0].item;
        this.fireAncestors('$updateBackdrop', {src: backdrop});
        this.$updateItemTitle({title, description});
        this.tag('List').add(array);
        this._refocus();
    }

    _handleLeft() {
        Router.focusWidget('Menu');
    }
}