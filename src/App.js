/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Utils, Router } from '@lightningjs/sdk';
import { Menu, InputField } from './widgets';
import routerConfig from './lib/routerConfig.js';
import { Backdrop, AmbientBackground } from './components';

export default class App extends Router.App{
  static getFonts() {
    return [
      { family: 'Regular', url: Utils.asset('fonts/Montserrat-Regular.ttf') },
      { family: 'Medium', url: Utils.asset('fonts/Montserrat-Medium.ttf') },
      { family: 'Bold', url: Utils.asset('fonts/Montserrat-Bold.ttf') },
      { family: 'MediumItalic', url: Utils.asset('fonts/Montserrat-MediumItalic.ttf') }
    ]
  }

  static _template() {
    return {
      Content: { zIndex: 1, rtt: true, w: 1920, h: 1080,
        AmbientBackground: {type: AmbientBackground},
        Backdrop: {type: Backdrop},
        Pages: {
          forceZIndexContext: true
        }
      },
      Loading: {

      },
      Widgets: {
        Menu: {
          type: Menu, visible: true
        },
        InputField: {
          type: InputField, visible: true
        }
      }
    }
  }

  $getAppContentTexture() {
    return this.tag('Content').getTexture();
  }

  $updateBackdrop(e) {
    this.tag('Backdrop').update(e.src);
  }

  $updateAmbientBackground(e) {
    this.tag('AmbientBackground').update(e.color);
  }

  _setup() {
    Router.startRouter(routerConfig, this);
  }

  static colors() {
    return true;
  }
}
