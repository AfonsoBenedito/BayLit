import React, { Component } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import "./Support.css";

class Support extends Component {
  state = {};

  openQuestion(click) {
    var answer = document.getElementById(
      "faqsQuestionAnswer" + click.target.id.charAt(15)
    );
    if (answer.style.display === "block") {
      answer.style.display = "none";
    } else {
      answer.style.display = "block";
    }
  }

  render() {
    return (
      <div className="mainSupport">
        <div className="topBlockSupport">
          <h2 className="mainPath">Suporte</h2>
          <p className="faqsTitle" id="faqstitle">
            FAQ's
          </p>
          <p className="faqsTitle" id="faqstitle">
            Informação Geral
          </p>

          <div
            id="faqsQuestionDiv1"
            className="faqsQuestionsDiv"
            onClick={this.openQuestion}
          >
            Quem somos?
            <div className="rightArrowSupport">
            </div>
          </div>
          <p className="faqsQuestionAnswer" id="faqsQuestionAnswer1">
            Somos uma empresa chamada Baylit cujo objetivo é a venda de inúmeros
            produtos presentes na nossa plataforma com foco na sustentabilidade.
          </p>

          <div
            id="faqsQuestionDiv2"
            className="faqsQuestionsDiv"
            onClick={this.openQuestion}
          >
            Como é que a Baylit surgiu?
            <div className="rightArrowSupport">
            </div>
          </div>
          <p className="faqsQuestionAnswer" id="faqsQuestionAnswer2">
            A Baylit nasce no seguimento de uma cadeira da faculdade em que
            todos os membros da empresa pertencem, sendo esta plataforma o nosso
            projeto final de curso.
          </p>

          <div
            id="faqsQuestionDiv3"
            className="faqsQuestionsDiv"
            onClick={this.openQuestion}
          >
            Quais são os nossos grandes objetivos?
            <div className="rightArrowSupport">
            </div>
          </div>
          <p className="faqsQuestionAnswer" id="faqsQuestionAnswer3">
            Temos duas grandes metas para a nossa aplicação que passam por:
            controlo da sustentabilidade ambiental aquando da produção e
            transporte das mercadorias e satisfação de todos os utilizadores
            envolvidos com a Baylit.
          </p>
          <p className="faqsTitle" id="faqstitle">
            Armazenamento de Dados
          </p>
          <div
            id="faqsQuestionDiv4"
            className="faqsQuestionsDiv"
            onClick={this.openQuestion}
          >
            Os dados estão seguros ?
            <div className="rightArrowSupport">
            </div>
          </div>
          <p className="faqsQuestionAnswer" id="faqsQuestionAnswer4">
            Enquanto Baylit fazemos o nosso melhor para que os seus dados
            estejam seguros connosco. Estes só serão divulgados em raras
            expeções que podem ser consultadas nos Termos de Utilização.
          </p>
          <p className="faqsTitle" id="faqstitle">
            Utilizadores
          </p>
          <div
            id="faqsQuestionDiv5"
            className="faqsQuestionsDiv"
            onClick={this.openQuestion}
          >
            O que posso fazer enquanto utilizador desta plataforma?
            <div className="rightArrowSupport">
            </div>
          </div>
          <p className="faqsQuestionAnswer" id="faqsQuestionAnswer5">
            Enquanto Fornecedor poderá adicionar os seus produtos à plataforma,
            consultar os seus produtos e contactar outros Utilizadores. Enquanto
            Transportador poderá adicionar funcionários e os seus veiculos ,
            consultar os mesmos e contactar outros Utilizadores.
          </p>

          <div
            id="faqsQuestionDiv6"
            className="faqsQuestionsDiv"
            onClick={this.openQuestion}
          >
            Existe alguma restrição para os Utilizadores?
            <div className="rightArrowSupport">
            </div>
          </div>
          <p className="faqsQuestionAnswer" id="faqsQuestionAnswer6">
            Os utilizadores, independentemente do seu tipo, têm ao seu dispor um
            conjunto de funcionalidades possíveis essenciais para o correto
            funcionamento da plataforma. Estes estaram limitados, se e só se,
            infringirem os nossos Termos de Utilização que levará ao bloqueio
            (Temporário ou Permanente) da conta e funcionalidades do próprio por
            parte dos Adminitradores da Baylit.
          </p>
        </div>
      </div>
    );
  }
}

export default Support;
