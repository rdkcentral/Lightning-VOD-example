import { Lightning, Img, Colors } from "@lightningjs/sdk";
import { Button } from "../components";

export default class Detail extends Lightning.Component {
    static _template() {
        return {
            LargePoster: {
                renderOffscreen: true, alpha: 0, mountX: 1, x: 190, y: 90, w: 300, h: 450, shader: {type: Lightning.shaders.RoundedRectangle, radius: 18}
            },
            DetailWrapper: { x: 230, y: 90,
                Labels: {
                    flex: {direction: 'column'},
                    Title: {w: 1260, renderOffscreen: true, text: {fontFace: 'Bold', wrap: true, fontSize: 74, lineHeight: 88}},
                    TitleInfo: {alpha: 0, text: {fontFace: 'Regular', fontSize: 28, lineHeight: 28}, flexItem: {marginBottom: 20}},
                    Tagline: {alpha: 0, color: Colors('white').alpha(0.8).get(), text: {fontFace: 'MediumItalic', fontSize: 38, lineHeight: 48}},
                },
                PlayButton: {
                    type: Button, alpha: 0, y: 340, w: 250, h: 90, label: 'Play'
                },
                DescriptionWrapper: { h: 580, w: 960, rtt: true, shader: {type: Lightning.shaders.FadeOut, bottom: 400},
                    Description: {w: 960, renderOffscreen: true, text: {fontFace: 'Regular', wrap: true, maxLines: 4, fontSize: 36, lineHeight: 44}},
                    DescriptionFull: {alpha: 0, w: 960, renderOffscreen: true, text: {fontFace: 'Regular', wrap: true, fontSize: 36, lineHeight: 44}}
                }
            }
        }
    }
    
    _init() {
        const title = this.tag('Title');
        title.on('txLoaded', () => {
            if(this._loadingData) {
                this._loadingData = false;
                this.tag('DescriptionWrapper').y = title.renderHeight || 88;
                this._startAnimation();   
            }
        });
    }

    setData(data) {
        if(data.id === this._assetId) {
            this._startAnimation();
            return;
        }

        this._loadingData = true;
        const { title, description, media_type, large_poster, backdrop, genres, runtime, tagline} = data;
        
        const titleInfo = [media_type.charAt(0).toUpperCase() + media_type.slice(1)];

        if(genres.length > 0) {
            titleInfo.push(genres.map((genre) => genre.name).join(', '))
        }

        if(runtime) {
            let formatted = runtime + ' m';
            if(runtime > 59) {
                formatted = `${Math.floor(runtime / 60)} h ${(runtime % 60)} m`
            }
            titleInfo.push(formatted);
        }

        this.fireAncestors('$updateBackdrop', {src: backdrop});
        this.patch({
            LargePoster: {
                texture: Img(large_poster).original()
            },
            DetailWrapper: {
                Labels: {
                    Title: {text: title},  
                    TitleInfo: {text: titleInfo.join(' \u2022 ')},
                    Tagline: {text: tagline}
                },
                DescriptionWrapper: {
                    Description: {text: description},
                    DescriptionFull: {text: description},
                }
            }
        });
    }

    _startAnimation() {
        const y = this.tag('DescriptionWrapper').y;
        this._openAnimation = this.animation({duration: 0.6, actions: [
            {t: 'LargePoster', p: 'x', v: {0: 180, 1: 480}},
            {t: 'LargePoster', p: 'alpha', v: {0.6: 0, 1: 1}},
            {t: 'DetailWrapper', p: 'x', v: {0: 230, 1: 530}},
            {t: 'TitleInfo', p: 'alpha', v: {0.6: 0, 1: 1}},
            {t: 'Tagline', p: 'alpha', v: {0.6: 0, 1: 1}},
            {t: 'PlayButton', p: 'alpha', v: {0.6: 0, 1: 1}},
            {t: 'DescriptionWrapper', p: 'y', v: {0: y, 1: 500}},
            {t: 'Description', p: 'alpha', v: {0.5: 1, 1: 0}},
            {t: 'DescriptionFull', p: 'alpha', v: {0.5: 0, 1: 1}}
        ]});

        this._openAnimation.on('finish', () => {
            this._setState('PlayButton');
            this._updateDescriptionAnimation(y);
        });

        this._openAnimation.start();
    }

    _updateDescriptionAnimation(targetY) {
        this._descriptionAnimation = this.animation({duration: 0.4, actions: [
            {t: 'TitleInfo', p: 'alpha', v: {0: 1, 0.5: 0}},
            {t: 'Tagline', p: 'alpha', v: {0: 1, 0.5: 0}},
            {t: 'PlayButton', p: 'alpha', v: {0: 1, 0.5: 0}},
            {t: 'DescriptionWrapper', p: 'y', v: {0.3: 500, 1: targetY}},
            {t: 'DescriptionWrapper', p: 'h', v: {0.3: 580, 1: 580 + (500 - targetY)}},
            {t: 'DescriptionWrapper', p: 'shader.bottom', v: {0.3: 400, 1: 0}}
        ]});
    }

    _inactive() {
        this.patch({
            LargePoster: {alpha: 0},
            DetailWrapper: {
                Label: {
                    Title: {text: ''}
                },
                Description: {text: ''}
            }
        });
        this.tag('Description').text.maxLines = 4;
    }

    static _states() {
        return [
            class PlayButton extends this {
                _getFocused() {
                    return this.tag('PlayButton')
                }

                _handleDown() {
                    if(this.tag('DescriptionFull').texture.source.renderInfo.lines.length > 6) {
                        this._setState('Description')
                    }
                }
            },
            class Description extends this {
                $enter() {
                    this._descriptionAnimation.start();
                }

                $exit() {
                    this._descriptionAnimation.stop();
                }

                _handleUp() {
                    this._setState('PlayButton')
                }
            }
        ]
    }
}