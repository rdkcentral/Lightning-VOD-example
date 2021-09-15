import { Lightning, Router } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";

export default class Main extends Lightning.Component {
    static _template() {
        return {
            LabelWrapper: { alpha: 0.001, x: 230, y: 90, flex: {direction: 'column'},
                ItemTitle: {w: 1260, text: {fontFace: 'Bold', wrap: true, fontSize: 74, lineHeight: 88}},
                ItemDescription: {w: 960, text: {fontFace: 'Regular', wrap: true, maxLines: 4, fontSize: 36, lineHeight: 44}}
            },
            List: {x: 140, type: List, w: w => w, h: 1080, direction: 'column', scroll: 580, scrollTransition: {duration: 0.4}}
        }
    }

    _getFocused() {
        return this.tag('List');
    }

    $updateItemTitle(e) {
        if(this._currentItem && this._currentItem.title === e.title) {
            return;
        }
        this._currentItem = e;
        this._updateItemDetails();
    }

    _init() {
        this._fadeItemDetail = this.animation({delay: 0.2, duration: 0.3, actions: [
            {t: 'LabelWrapper', p: 'alpha', v: {0: 0.001, 1: 1}},
            {t: 'LabelWrapper', p: 'x', v: {0: 270, 1: 230}}
        ]});
    }

    _updateItemDetails() {
        const { title, description } = this._currentItem;
        this.tag('LabelWrapper').patch({
            ItemTitle: {text: title},
            ItemDescription: {text: description},
        });
        this._fadeItemDetail.start();
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