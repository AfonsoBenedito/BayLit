import React, { Component } from "react";
import { getCategorias, getSubCategoriasByCategoria, getRecursos, getTiposPoluicao } from "../../../Helpers/CategoryHelper";
import { AuthVerificationDashboard } from "../../../Helpers/AuthVerification";

import ReactDOM from "react-dom"

class AddProducts extends Component {
    constructor(props){
        super(props)

        this.state = {
            categoriasHtml: [],
            subcategoriasHtml: {},
            tipoRecursoHtml: [],
            recursoHtml: {},
            quantidadeRecurso: {},
            quantidadeAtual: "",
            recursosAdicionados: []
        }

        this.refCategoria = React.createRef()
        this.refSubcategoria = React.createRef()

        this.refNome = React.createRef()
        this.refDescricao = React.createRef()
        this.refFotografias = React.createRef()
        this.refPais = React.createRef()
        this.refLocalidade = React.createRef()
        this.refMorada = React.createRef()
        this.refCodigo = React.createRef()

        this.refRecurso = React.createRef()
        this.refTipoRecurso = React.createRef()
        this.quantidadeRecurso = React.createRef()
        this.refRecursosAdicionados = React.createRef()

        this.changeCategoria = this.changeCategoria.bind(this)
        this.getStartInfoRecursos = this.getStartInfoRecursos.bind(this)
        this.changeTipoRecurso = this.changeTipoRecurso.bind(this)
        this.changeRecurso = this.changeRecurso.bind(this)
        this.adicionarRecurso = this.adicionarRecurso.bind(this)
    }

    async getStartInfoCategorias(){

        let categorias = await getCategorias()

        let listaIdsCategorias = []


        let resultOptionsCategorias = []

        let resultOptionsSubcategorias = {}

        let primeiroValorCategoria;

        for (let i = 0; i < categorias.length; i++){

            if (i == 0){
                primeiroValorCategoria = categorias[i]._id
            }

            listaIdsCategorias.push(categorias[i]._id)

            resultOptionsCategorias.push(<option value={categorias[i]._id}>{categorias[i].nome}</option>)

            let subcategorias = await getSubCategoriasByCategoria(categorias[i]._id)

            resultOptionsSubcategorias[categorias[i]._id] = []

            for (let k = 0; k < subcategorias.length; k++){

                resultOptionsSubcategorias[categorias[i]._id].push(<option value={subcategorias[k]._id}>{subcategorias[k].nome}</option>)

            }

        }

        this.setState({
            categoriasHtml: resultOptionsCategorias,
            subcategoriasHtml: resultOptionsSubcategorias
        })


        ReactDOM.render(resultOptionsCategorias, this.refCategoria.current)
        ReactDOM.render(resultOptionsSubcategorias[primeiroValorCategoria], this.refSubcategoria.current)

    }

    changeCategoria(){

        ReactDOM.render(this.state.subcategoriasHtml[this.refCategoria.current.value], this.refSubcategoria.current)

    }

    async getStartInfoRecursos(){
        let tipoRecursos = await getRecursos()

        let resultOptionsTipoRecurso = []
        let resultOptionsRecurso = {}
        let resultQuantidades = {}

        let primeiroRecurso = false
        
        for (let tipo in tipoRecursos){

            if (primeiroRecurso == false){
                primeiroRecurso = tipo
            }

            resultOptionsTipoRecurso.push(<option value={tipo}>{tipo}</option>)

            resultOptionsRecurso[tipo] = []

            for (let recurso in tipoRecursos[tipo]){

                resultOptionsRecurso[tipo].push(<option value={recurso}>{recurso}</option>)

                resultQuantidades[recurso] = tipoRecursos[tipo][recurso]
                
            }

        }

        this.setState({
            tipoRecursoHtml: resultOptionsTipoRecurso,
            recursoHtml: resultOptionsRecurso,
            quantidadeRecurso: resultQuantidades
        })

        ReactDOM.render(resultOptionsTipoRecurso, this.refTipoRecurso.current)
        ReactDOM.render(resultOptionsRecurso[primeiroRecurso], this.refRecurso.current)

        this.setState({
            quantidadeAtual: this.state.quantidadeRecurso[this.refRecurso.current.value]
        })
        
    }

    changeTipoRecurso(){


        ReactDOM.render(this.state.recursoHtml[this.refTipoRecurso.current.value], this.refRecurso.current)

        this.setState({
            quantidadeAtual: this.state.quantidadeRecurso[this.refRecurso.current.value]
        })


    }

    changeRecurso(){
        this.setState({
            quantidadeAtual: this.state.quantidadeRecurso[this.refRecurso.current.value]
        })
    }

    adicionarRecurso(){
        let novosRecursos = this.state.recursosAdicionados

        novosRecursos.push([this.refTipoRecurso.current.value, this.refRecurso.current.value, this.state.quantidadeAtual])

        this.setState({
            recursosAdicionados: novosRecursos
        })

        ReactDOM.render(this.state.recursoHtml[this.refTipoRecurso.current.value], this.refRecurso.current)

        this.setState({
            quantidadeAtual: this.state.quantidadeRecurso[this.refRecurso.current.value]
        })

    }


    async componentDidMount(){
        await AuthVerificationDashboard();
        await this.getStartInfoCategorias()
        await this.getStartInfoRecursos()
    }

    render(){

        return(
        <div className="mainProducts">
            <span>Adicionar aqui Produto</span>
            <input ref={this.refNome} name="Nome Produto" placeholder="Nome" />
            <select onChange={this.changeCategoria} ref={this.refCategoria} name="Categoria" placeholder="Categoria" />
            <select ref={this.refSubcategoria} name="Subcategoria" placeholder="Subcategoria" />
            <input ref={this.refDescricao} name="Descricao" placeholder="Descricao" />
            <input ref={this.refFotografias} name="Fotografia" placeholder="Fotografias" />
            <input ref={this.refPais} name="Pais" placeholder="Pais"/>
            <input ref={this.refLocalidade} name="Localidade" placeholder="Localidade"/>
            <input ref={this.refMorada} name="Morada" placeholder="Morada"/>
            <input ref={this.refCodigo} name="Codigo_Postal" placeholder="Codigo Postal"/>

            <select onChange={this.changeCategoria} ref={this.refTipoProducao} name="Tipo_Producao" placeholder="Tipo de Producao">
                <option value="Biologica">Biologica</option>
                <option value="Organica">Organica</option>
                <option value="Intensiva">Intensiva</option>
            </select>

            <select onChange={this.changeTipoRecurso} ref={this.refTipoRecurso} name="Tipo_Recurso" placeholder="Tipo de Recurso"/>
            <select onChange={this.changeRecurso} ref={this.refRecurso} name="Recurso" placeholder="Recurso"/>
            <div >{this.state.quantidadeAtual}</div>

            <button onClick={this.adicionarRecurso} type="button">Adicionar este Recurso</button>
            <div>Recursos adicionados:{this.state.recursosAdicionados}</div>

        </div>
        )
    }
}

export default AddProducts