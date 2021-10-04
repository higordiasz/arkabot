/*const db = require('quick.db');
const moment = require('moment');

String.prototype.ReplaceAll = function (stringToFind, stringToReplace) {
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};

const Venda = new Object({
    adicionarVenda: async function (venda) {
        if (!venda.valor) return;
        if (!venda.origin) return;
        if (!venda.data) return;
        if (!venda.token) return;
        if (!venda.vendedor) return;
        if (!venda.nome) return;
        if (await db.get(`arka.vendas`) != null) {
            db.push(`arka.vendas`, venda);
            if (await db.get(`arka.vendast.${venda.token}`) != null) {
                db.push(`arka.vendast.${venda.token}`, venda)
            } else {
                await db.set(`arka.vendast.${venda.token}`, [venda]);
            }
        } else {
            await db.set(`arka.vendas`, [venda]);
            if (await db.get(`arka.vendast.${venda.token}` != null)) {
                db.push(`arka.vendast.${venda.token}`, venda)
            } else {
                await db.set(`arka.vendast.${venda.token}`, [venda]);
            }
        }
        return;
    },
    getTokenVendas: async function (token) {
        return await db.get(`arka.vendast.${token}`);
    }
})

module.exports = Venda;*/