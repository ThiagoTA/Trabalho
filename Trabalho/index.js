const express = require('express')
const { response, request } = require('express')
const app = express()
app.use(express.json())

const produtos = [{
        id : "2",
        nome : 'Celular',
        quantidade : "2",
        valor_uni : "1200",
        preco_total: null,
        preco_venda: null,
        lucro: null,
        situacao: null
    }
    ]

app.use((request, response, next) => {
    console.log("Controle de Estoque da Empresa Pichau")
    return next()
})

const checkUserExist = (request, response, next) => {
    if (!request.body.nome || !request.body.id || !request.body.quantidade || !request.body.valor_uni  ) {
        return response
              .status(400)
              .json({error:' O campo id do produto ou nome do produto ou quantidade ou valor unitario não existe no corpo da requisição.'})
    }
    return next()
}

const checkUserinArray = (request, response, next) => {
    const { id } = request.params

    if (!produtos[id]) {
        return response
              .status(400)
              .json({error:'Não existe Produto com este ID'})    
    }
    return next()
}

const checkUserExistID = (request, response, next) => {
    const { id } = request.body

    if(!produtos[id]){
        return response
        .status(400)
        .json({error:'Não existe Produto com este ID'})    
    }
    return next()
}

app.get('/produtos', (request, response) =>{
    return response.json(produtos)
})

app.get('/produtos/:id', checkUserinArray , (request, response) => {
    const {id} = request.params
    return response.json(produtos[id])
})

app.post('/produtos', checkUserExist, (request, response) => {
    const {id} = request.body
    const {nome} = request.body
    const {quantidade} = request.body
    const {valor_uni} = request.body
    const {complemento} = request.body
    produtos.push({id, nome, quantidade, valor_uni, complemento})
    
    preco_total = quantidade * valor_uni
    preco_venda = valor_uni * 1.2
    lucro = preco_venda - valor_uni

    if(quantidade < 50) {
        situacao = "Estável"
    }else if (quantidade > 50 && quantidade < 100) {
        situacao = "Boa"
    }else situacao = "Excelente"
    
    return response.json({id, nome, quantidade, valor_uni, preco_total, preco_total, lucro, situacao ,complemento})
})

app.put("/produtos", checkUserExistID, checkUserExist, (request, response) => {
    const {id, nome, quantidade, valor_uni} = request.body
    
    preco_total = quantidade * valor_uni
    preco_venda = valor_uni * 1.2
    lucro = preco_venda - valor_uni

    if(quantidade < 50) {
        situacao = "Estável"
    }else if (quantidade > 50 && quantidade < 100) {
        situacao = "Boa"
    }else situacao = "Excelente"
    
    produtos[id] = {id, nome, quantidade, valor_uni, preco_total, preco_total, lucro, situacao}
    return response.json(produtos[id])
})

app.put("/produtos/:id/complemento", (request, response) => {
    const{ id } = request.params
    const { complemento } = request.body
    produtos[id].complemento.push(complemento)
    return response.json(produtos[id])
})

app.delete("/produtos/:id", checkUserinArray, (request, response) => {
    const {id} = request.params
    console.log(produtos[id])
    produtos.splice(id, 1)
    return response.json(produtos)
})


app.listen(3333, () => {
    console.log("Servidor Rodando")
})

