const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Payment = require('../model/Payment/Controller');
const apiController = require('../controller/apiController');
const afiliadoController = require('../model/Afiliados/Controller');

router.get('/comprar-instagram', ensureAuthenticated, async (req, res, next) => {
    let query = req.query;
    if (!query) return res.redirect('painel');
    if (!query.valor) return res.redirect('painel');
    if (!query.dias) return res.redirect('painel');
    let preference = {
        items: [
            {
                title: "Licença Arka",
                currency_id: "BRL",
                picture_url: "https://i.imgur.com/HPaRdLP.jpg",
                description: `Compra de ${query.dias} dias de licença Arka Bot`,
                category_id: "services",
                quantity: 1,
                unit_price: parseFloat(query.valor)
            }
        ],
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "amex"
                },
                {
                    id: "diners"
                }
            ],
            excluded_payment_types: [
                {
                    id: "ticket"
                },
                {
                    id: "digital_currency"
                },
                {
                    id: "digital_wallet"
                }
            ],
            "installments": 12
        },
        binary_mode: true,
        back_urls: {
            success: "https://arkabot.com.br/checkout/ret-insta",
            failure: "https://arkabot.com.br/checkout/ret-insta",
            pending: "https://arkabot.com.br/checkout/ret-insta"
        },
        auto_return: "approved",
    }
    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.redirect(response.body.init_point);
        })
        .catch(function (error) {
            console.log(error)
        })
})

router.all('/ret-insta', ensureAuthenticated, async (req, res, next) => {
    try {
        let user = req.user;
        let values = [2.50, 3, 5, 35, 45, 72];
        if (!req.query.payment_id) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel carregar o pagamento do MercadoPago" });
        let payment = await mercadopago.payment.findById(req.query.payment_id);
        if (!payment) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel carregar o pagamento do MercadoPago" });
        if (!payment.response) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel carregar o pagamento do MercadoPago" });
        if (!payment.response.status) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel carregar o pagamento do MercadoPago" });
        if (!payment.response.transaction_amount) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel carregar o pagamento do MercadoPago" });
        if (!values.includes(payment.response.transaction_amount)) return res.render('checkouterr', { user: req.user, erro: "Valor de transação errado" });
        if (payment.response.status == "pending") {
            if (await Payment.adicionarPayment(payment, req.query.payment_id, user.token)) {
                return res.render('checkouterr', { user: req.user, erro: "Compra pelo pix pendente, verificaremos novamente mais tarde e adicionaremos a licença caso seja aprovado." });
            } else {
                return res.render('checkouterr', { user: req.user, erro: "Compra pelo pix pendente, verificaremos novamente mais tarde e adicionaremos a licença caso seja aprovado." });
            }
        }
        if (payment.response.status != "approved") return res.render('checkouterr', { user: req.user, erro: "Seu pagamento não foi aprovado" });
        if (payment.response.order.id != req.query.merchant_order_id) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel carregar o pagamento do MercadoPago" });
        if (await Payment.checkPaymentID(req.query.payment_id)) return res.render('checkouterr', { user: req.user, erro: "Ja foram adicionados os pontos dessa compra" });
        if (!user) return res.render('checkouterr', { user: req.user, erro: "Não foi possivel localizar o usuario" });
        if (payment.response.transaction_amount == 5) {
            let compras = await apiController.checkPromotionWeek(user.token);
            if (compras) {
                let dias = 7;
                let json = {
                    "token": user.token,
                    "dias": dias,
                    "origin": "Site",
                    "vendedor": "Site",
                    "valor": payment.response.transaction_amount,
                    "tipo": 1
                };
                let res2 = await apiController.addLicenceSite(json);
                if (res2) {
                    console.log(12);
                    await afiliadoController.addVendAfiliados(user.token, payment.response.transaction_amount);
                    console.log(13);
                    await Payment.adicionarPayment(payment, req.query.payment_id, user.token);
                    return res.render('checkoutapr', { user: req.user });
                } else {
                    return res.render('checkouterr', { user: req.user, erro: "Não foi possiel adicionar sua licença, entre em contato com o suporte." });
                }
            } else {
                let dias = 1;
                let json = {
                    "token": user.token,
                    "dias": dias,
                    "origin": "Site",
                    "vendedor": "Site",
                    "valor": payment.response.transaction_amount,
                    "tipo": 1
                };
                let res2 = await apiController.addLicenceSite(json);
                if (res2) {
                    console.log(12);
                    await afiliadoController.addVendAfiliados(user.token, payment.response.transaction_amount);
                    console.log(13);
                    await Payment.adicionarPayment(payment, req.query.payment_id, user.token);
                    return res.render('checkoutapr', { user: req.user });
                } else {
                    return res.render('checkouterr', { user: req.user, erro: "Não foi possiel adicionar sua licença, entre em contato com o suporte." });
                }
            }
        } else {
            let dias = payment.response.transaction_amount == 2.50 || payment.response.transaction_amount == 3 || payment.response.transaction_amount == 5 ? 1 : payment.response.transaction_amount == 35 || payment.response.transaction_amount == 45 ? 30 : payment.response.transaction_amount == 72 ? 70 : 1;
            let json = {
                "token": user.token,
                "dias": dias,
                "origin": "Site",
                "vendedor": "Site",
                "valor": payment.response.transaction_amount,
                "tipo": 1
            };
            let res2 = await apiController.addLicenceSite(json);
            if (res2) {
                console.log(12);
                await afiliadoController.addVendAfiliados(user.token, payment.response.transaction_amount);
                console.log(13);
                await Payment.adicionarPayment(payment, req.query.payment_id, user.token);
                return res.render('checkoutapr', { user: req.user });
            } else {
                return res.render('checkouterr', { user: req.user, erro: "Não foi possiel adicionar sua licença, entre em contato com o suporte." });
            }
        }
    } catch {
        return res.redirect("../painel")
    }
})

module.exports = router;