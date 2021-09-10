import { Lightning, Router } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";

export default class Main extends Lightning.Component {
    static _template() {
        return {
            LabelWrapper: { x: 230, y: 90, flex: {direction: 'column'},
                ItemTitle: {w: 1260, text: {fontFace: 'Bold', wrap: true, fontSize: 74, lineHeight: 88}},
                ItemDescription: {w: 960, text: {fontFace: 'Regular', wrap: true, maxLines: 4, fontSize: 36, lineHeight: 44}}
            },
            List: {x: 140, type: List, w: w => w, h: 1080, direction: 'column', scroll: 580, scrollTransition: {duration: 0.4}}
        }
    }

    _getFocused() {
        return this.tag('List');
    }

    $updateItemTitle({title, description}) {
        this.tag('LabelWrapper').patch({
            ItemTitle: {text: title},
            ItemDescription: {text: description},
        });
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