const Spoiler = require("../model/spoiler");
const status = require("http-status");

exports.buscarUm = (request, response, next) => {
    const id = request.params.id;
    Spoiler.findByPk(id)
        .then(spoiler => {
            if (spoiler) {
                response.status(status.OK).send(spoiler);
            } else {
                response.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};

exports.buscarTodos = (request, response, next) => {
    let limite = parseInt(request.query.limite || 0);
    let pagina = parseInt(request.query.pagina || 1);

    if (!Number.isInteger(limite) || !Number.isInteger(pagina)) {
        response.status(status.BAD_REQUEST).send();
    }

    const ITENS_POR_PAGINA = 10;
    limite = limite <= 0 ? ITENS_POR_PAGINA : limite;
    limite = limite > ITENS_POR_PAGINA ? ITENS_POR_PAGINA : limite;
    pagina = pagina * limite - limite;

    Spoiler.findAll({ limit: limite, offset: pagina })
        .then(spoilers => {
            response.send(spoilers);
        })
        .catch(error => next(error));
};

exports.criar = (request, response, next) => {
    const titulo = request.body.titulo;
    const espoliador = request.body.espoliador;
    const descricao = request.body.descricao;

    Spoiler.create({
        titulo: titulo,
        espoliador: espoliador,
        descricao: descricao
    })
        .then(() => {
            response.status(status.CREATED).send();
        })
        .catch(error => next(error));
};

exports.atualizar = (request, response, next) => {
    const id = request.params.id;

    const titulo = request.body.titulo;
    const espoliador = request.body.espoliador;
    const descricao = request.body.descricao;

    Spoiler.findByPk(id)
        .then(spoiler => {
            if (spoiler) {
                Spoiler.update(
                    {
                        titulo: titulo,
                        espoliador: espoliador,
                        descricao: descricao
                    },
                    { where: { id: id } }
                )
                    .then(() => {
                        response.status(status.OK).send();
                    })
                    .catch(error => next(error));
            } else {
                response.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};

exports.excluir = (request, response, next) => {
    const id = request.params.id;

    Spoiler.findById(id)
        .then(spoiler => {
            if (spoiler) {
                Spoiler.destroy({
                    where: { id: id }
                })
                    .then(() => {
                        response.status(status.OK).send();
                    })
                    .catch(error => next(error));
            } else {
                response.status(status.NOT_FOUND).send();
            }
        })
        .catch(error => next(error));
};
