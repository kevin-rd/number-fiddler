const BigNumber = require('./public/bignumber.js')

let fmt = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ' ',
    groupSize: 4,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 3,
    suffix: ''
}

BigNumber.config({FORMAT: fmt})


const azkme = 1;
const zkme = 1000000000000000000;


function toItem(bigNumber, description) {
    return {title: bigNumber.toFormat(), description: description, value: bigNumber.toString(10)}
}

function convert(numstr, callbackSetList) {
    numstr = String(numstr).toLowerCase();
    if (/a(z(k(me?)?)?)?$/.test(numstr)) {
        // 3239993493azkme
        numstr = numstr.replace(/\D/g, '');
        let rawNum = new BigNumber(numstr, 10)
        let number = new BigNumber(numstr, 10).multipliedBy(azkme).dividedBy(zkme);

        return callbackSetList([
            toItem(number, "zkme"),
            toItem(rawNum, "azkme"),
        ])
    } else if (/(me|zk(me?)?)$/.test(numstr)) {
        // 10000000zkme
        numstr = numstr.replace(/\D/g, '');
        let rawNum = new BigNumber(numstr, 10)
        let number = new BigNumber(numstr, 10).multipliedBy(zkme).dividedBy(azkme);

        return callbackSetList([
            toItem(number, "azkme"),
            toItem(rawNum, "zkme"),
        ])
    } else if (/^\d+\.\d+$/.test(numstr)) {
        // 23.456
        let rawNum = new BigNumber(numstr, 10)
        let number = new BigNumber(numstr, 10).multipliedBy(zkme).dividedBy(azkme);

        return callbackSetList([
            toItem(number, "azkme"),
            toItem(rawNum, "zkme"),
        ])
    } else if (/^\d+$/.test(numstr)) {
        // 1090000000
        if (String(numstr).length > 9) {
            let rawNumber = new BigNumber(numstr, 10)
            let number = new BigNumber(numstr, 10).multipliedBy(azkme).dividedBy(zkme)

            return callbackSetList([
                toItem(number, "zkme"),
                toItem(rawNumber, "azkme"),
            ])
        } else {
            return callbackSetList([])
        }
    } else {
        return callbackSetList([])
    }
}

window.exports = {
    // 注意：键对应的是 plugin.json 中的 features.code
    "converter": {
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                return convert(action.payload, callbackSetList)
            },
            search: (action, searchWord, callbackSetList) => {
                return convert(searchWord, callbackSetList)
            },
            select: (action, itemData, callbackSetList) => {
                window.utools.copyText(itemData.value)
                window.utools.hideMainWindow()
                window.utools.outPlugin()
            },
            placeholder: "输入数字",
        },
    },
};
