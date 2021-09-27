import { IconKey, Key } from "../components/Key.js";

export default keyboardConfig = {
    layouts: {
        'ABC': [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], 
            ['onLayout:123', 'U', 'V', 'W', 'X', 'Y', 'Z', 'onSpace', 'onBackspace']
        ],
        '123': [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['onLayout:ABC', 'onSpace', 'onBackspace']
        ]
    },
    offsets: {
        align: 'center',
        horizontalSpacing: 15,
        verticalSpacing: 20,
    },
    buttonTypes: {
        default: {
            type: Key,
        },
        onLayout: {
            type: Key, w: 110,
        },
        onBackspace: {
            type: IconKey, icon: '/images/backspace.png'
        },
        onSpace: {
            type: IconKey, w: 110, icon: '/images/space.png',
        }
    }
};