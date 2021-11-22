const mongoose = require('mongoose');
const MobileUA = mongoose.model('MobileUA');
const NavegadorUA = mongoose.model('NavegadorUA');
const md5 = require('md5');
const moment = require('moment');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomMobileUA = async function () {
    let uas = await MobileUA.find();
    if (uas.length > 0) {
        let value = getRandomInt(0, uas.length);
        return uas[value].ua;
    } else {
        return "Mozilla/5.0 (Linux; Android 11; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/11 Chrome/95.0.4638.744 Mobile Safari/537.36";
    }
}

exports.getRandomNavegadorUA = async function () {
    let uas = await NavegadorUA.find();
    if (uas.length > 0) {
        let value = getRandomInt(0, uas.length);
        return uas[value].ua;
    } else {
        return "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0";
    }
}

exports.adicionarMobileUA = async function (ua) {
    let mobile = new MobileUA ({
        ua: ua
    });
    await mobile.save();
    return;
}

exports.adicionarNavegadorUA = async function (ua) {
    let nav = new NavegadorUA ({
        ua: ua
    });
    await nav.save();
    return;
}