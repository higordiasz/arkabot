const mongoose = require('mongoose');
const md5 = require('md5');

const Ativo = mongoose.model('Ativo');
const Bloquueio = mongoose.model('Bloquueio');
const Cadastro = mongoose.model('Cadastro');
const InstaCadastro = mongoose.model('InstaCadastro');
const PlatAtivo = mongoose.model('PlatAtivo');
const Utilizacao = mongoose.model('Utilizacao');