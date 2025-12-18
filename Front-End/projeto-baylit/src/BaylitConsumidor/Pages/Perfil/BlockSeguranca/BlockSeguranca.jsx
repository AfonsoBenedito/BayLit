import React, { Component } from "react";
import { apagarContaUtilizador, mudarPasswordConsumidor } from "../../../../Helpers/UserHelper";

import "./BlockSeguranca.css";

class BlockSeguranca extends Component {
  constructor(props){
    super(props)

    this.state = {}

    this.refAtualPassword = React.createRef()
    this.refNovaPassword = React.createRef()
    this.refPasswordConfirm = React.createRef()
  }

  async alterarPassword(){

    let passAtual = this.refAtualPassword.current.value
    let passNova = this.refNovaPassword.current.value
    let passConfirm = this.refPasswordConfirm.current.value

    if (passAtual != "" && passNova != "" && passConfirm != ""){

      if (passNova == passConfirm){

        let info = JSON.parse(localStorage.getItem('baylitInfo'))

        let res = await mudarPasswordConsumidor(info.id, info.token, passAtual, passNova)

        if (res){
          console.log("Trocou")
        } else {
          console.log("Erro: " + res)
        }

      }

    }else {
      console.log("Erro tem preencher todos os campos")
    }

  }

  async apagarConta(){
    let passDelete = this.refPasswordDelete
    let passDeleteConfirm = this.refPasswordDeleteConfirm

    if(passDelete != "" && passDeleteConfirm != ""){

      if (passDelete == passDeleteConfirm){

        let info = JSON.parse(localStorage.getItem('baylitInfo'))

        let res = await apagarContaUtilizador(info.id, info.token)

        if (res){
          console.log("Conta Apagada")
        } else {
          console.log("Erro a apagar conta")
        }

      }
    }
  }

  render() {
    return (
      <div className="mainBlockSeguranca">
        <h2 className="titlePageBlockSeguranca">Segurança</h2>
        <div className="alignAllBlocksSeguranca">
          <div className="blocoSegurancaAlterar">
            <div className="titleBlocoSeguranca">
              <i class="bi bi-person"></i>
              <h3>Nova palavra-passe</h3>
            </div>
            <form className="blocoInputsBlockSeguranca">
              <h6>Palavra-passe atual</h6>
              <input
                ref={this.refAtualPassword}
                type="password"
                name="passwordAtual"
                
                placeholder="Palavra-passe"
              />
              <h6>Nova palavra-passe</h6>
              <input
                ref={this.refNovaPassword}
                type="password"
                name="passwordNova"
                
                placeholder="Nova palavra-passe"
              />
              <h6>Confirmar palavra-passe</h6>
              <input
                ref={this.refPasswordConfirm}
                type="password"
                name="passwordNovaConfirmar"
                
                placeholder="Confirmar palavra-passe"
              />

              <button onClick={async () => {await this.alterarPassword()}} className="btnSubmitChangesSeguranca" type="button">
                Guardar alterações
              </button>
            </form>
          </div>
          <div className="blocoSegurancaAlterar">
            <div className="titleBlocoSeguranca">
              <i class="bi bi-person"></i>
              <h3>Apagar Conta</h3>
            </div>
            <form className="blocoInputsBlockSeguranca">
              <h6>Palavra-passe</h6>
              <input
                ref={this.refPasswordDelete}
                type="password"
                name="passwordDelete"
                
                placeholder="Palavra-passe"
              />
              <h6>Confirmar Palavra-passe</h6>
              <input
                ref={this.refPasswordDeleteConfirm}
                type="password"
                name="passwordDeleteConfirm"
                
                placeholder="Palavra-passe"
              />

              <button onClick={async () => {}} className="btnSubmitChangesSeguranca" type="button">
                Apagar Conta
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default BlockSeguranca;
