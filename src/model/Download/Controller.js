const mongoose = require('mongoose');
const md5 = require('md5');
const moment = require('moment');
const Download = mongoose.model('Download');

exports.setDownloadLink = async function (link) {
    var l = await Download.findOne();
    if (l == null) {
        l = new Download ({
            link: link
        });
        await l.save();
        return;
    } else {
        l.link = link;
        await l.save();
        return;
    }
}

exports.getDownloadLink = async function (link) {
    var l = await Download.findOne();
    if (l != null) {
        return l.link
    } else {
        return "";
    }
}