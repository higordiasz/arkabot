const mongoose = require('mongoose');
const md5 = require('md5');
const moment = require('moment');
const DadosAtivo = mongoose.model('DadosAtivo');
const DadosBloqueio = mongoose.model('DadosBloqueio');
const DadosCadastro = mongoose.model('DadosCadastro');
const DadosCadastroInsta = mongoose.model('DadosCadastroInsta');
const DadosPlatAtivo = mongoose.model('DadosPlatAtivo');
const DadosTarefa = mongoose.model('DadosTarefa');
const DadosTarefaPlat = mongoose.model('DadosTarefaPlat')
const DadosUtilizacao = mongoose.model('DadosUtilizacao');

// Pegar a data de hoje em string: let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();

exports.addTarefa = async function (tipo) {
    try {
        if (tipo == 1) {
            //Tarefa de Seguir
            let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
            let T = await DadosTarefa.findOne({ data: hoje });
            if (T == null) {
                T = new DadosTarefa({
                    seguir: 1,
                    curtir: 0,
                    data: hoje
                });
                await T.save();
                return;
            } else {
                T.seguir += 1;
                await T.save();
                return;
            }
        } else {
            if (tipo == 2) {
                //Tarefa de Curtir
                let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
                let T = await DadosTarefa.findOne({ data: hoje });
                if (T == null) {
                    T = new DadosTarefa({
                        seguir: 0,
                        curtir: 1,
                        data: hoje
                    });
                    await T.save();
                    return;
                } else {
                    T.curtir += 1;
                    await T.save();
                    return;
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

exports.addCadastro = async function () {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let C = await DadosCadastro.findOne({ data: hoje });
        if (C != null) {
            C.qtd += 1;
            await C.save();
            return;
        } else {
            C = new DadosCadastro({
                data: hoje,
                qtd: 1
            });
            await C.save();
        }
    } catch (err) {
        console.log(err);
    }
}

exports.addAtivo = async function (token) {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let A = await DadosAtivo.findOne({ data: hoje });
        if (A != null) {
            let tokens = A.token;
            if (!tokens.includes(token)) {
                A.qtd += 1;
                A.token.push(token);
                await A.save();
                return;
            }
        } else {
            A = new DadosAtivo({
                data: hoje,
                qtd: 1,
                token: [token]
            });
            await A.save();
            return;
        }
    } catch (err) {
        console.log(err);
    }
}

//0 = block action, 1 = challenge, 2 = incorrect
exports.addBloqueio = async function (tipo, conta) {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        if (tipo == 1 || tipo == 2 || tipo == 0) {
            let B = await DadosBloqueio.findOne({ data: hoje, tipo: tipo });
            if (B == null) {
                B = new DadosBloqueio({
                    contas: [conta],
                    data: hoje,
                    tipo: tipo,
                    qtf: 1
                });
                await B.save();
                return;
            } else {
                B.contas.push(conta);
                B.qtd += 1;
                await B.save();
                return;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

exports.addCadastroInsta = async function () {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let I = await DadosCadastroInsta.findOne({ data: hoje });
        if (I == null) {
            I = new DadosCadastroInsta({
                data: hoje,
                qtd: 1
            });
            await I.save();
            return;
        } else {
            I.qtd += 1;
            await I.save();
            return;
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getBloqueiosHojeByTipo = async function (tipo) {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        if (tipo == 1 || tipo == 2 || tipo == 0) {
            let B = await DadosBloqueio.findOne({data: hoje, tipo: tipo});
            if (B != null)
                return B.qtd;
            return 0;
        }
        return -1;
    } catch (err) {
        console.log(err)
        return -1;
    }
}

exports.getQtdCadastroHoje = async function () {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let C = await DadosCadastro.findOne({ data: hoje });
        if (C != null)
            return C.qtd;
        return 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

exports.getQtdCadastroInstaHoje = async function () {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let I = await DadosCadastroInsta.findOne({ data: hoje });
        if (I != null)
            return I.qtd;
        return 0;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

exports.getTarefasHoje = async function () {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let T = await DadosTarefa.findOne({ data: hoje });
        if (T != null) {
            let ret = T.toJSON();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.getAllTarefas = async function () {
    try {
        let hoje = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY").toString();
        let T = await DadosTarefa.find({ data: hoje });
        if (T.length > 0) {
            let ret = [];
            for (let i = 0; i < T.length; i++) {
                let aux = T[i].toJSON();
                delete aux._id;
                delete aux.__v;
                ret.push(aux);
            }
            return ret;
        }
        return [];
    } catch (err) {
        console.log(err);
        return [];
    }
}