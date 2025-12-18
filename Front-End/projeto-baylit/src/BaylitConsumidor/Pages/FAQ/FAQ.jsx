import React, { Component } from "react";

import "./FAQ.css";

import BackgroundImage from "../../Images/FAQImages/backgroundAjuda.jpg";
import FAQComponent from "./FAQComponent/FAQComponent";

class FAQ extends Component {
  state = {};
  render() {
    return (
      <div className="mainFAQ">
        <div className="blockTitleFAQ">
          <img src={BackgroundImage} alt="" />
          <h5 className="subTitleFAQ">Perguntas frequentes</h5>
          <h1 className="titleFAQ">Como podemos ajudar?</h1>
        </div>
        <div className="blocoAllFAQ">
          <FAQComponent
            titulo="O que posso fazer enquanto Consumidor?"
            texto="Enquanto Consumidor posso navegar entre os mais variados produtos, pertencentes a várias categorias e subcategorias, analisar a sua sustentabilidade e aquando a compra do(s) mesmo(s) poder efetuar uma compra consciente."
          />
          <FAQComponent
            titulo="Como posso verificar se um produto é mais sustentável que outro?"
            texto="Pode efetuar essa comparação usando a ferramenta *Comparar*, escolhe os produtos a comparar e nós tratamos de lhe mostrar o que mais sobressai."
          />
          <FAQComponent
            titulo="Como funcionam os Favoritos?"
            texto="Após a autenticação da sua conta, pode navegar pelos produtos e se achar que esse mesmo produto é relevante para si, pode simplesmente adicioná-lo aos favoritos e consultá-lo sempre que quiser."
          />
          <FAQComponent
            titulo="Como funciona a Autenticação e quais são as suas vantagens?"
            texto="Pode efetuar a sua autenticação no canto superior direito, introduzindo o seu email e palavra-passe correspondente, caso não tenha conta pode criá-la na opção *Junta-te a nós*.
            Pode efetuar também a sua autenticação via Google.
            Sendo um utilizador registado, pode adicionar produtos aos favoritos e efetuar compras."
          />
          <FAQComponent
            titulo="Como funciona a Sustentabilidade na Baylit?"
            texto="A Sustentabilidade é calculada tendo em conta vários aspetos, todo esse processo pode ser consultado na página da Sustentabilidade, acessível no topo da página. ."
          />
          <FAQComponent
            titulo="Os meus dados estão seguros?"
            texto="Todos os dados que nos dispõe, necessários para o correto funcionamento das funcionalidades que temos disponiveis para si estão seguros nas nossas base de dados.
            De notar que NUNCA armazenamos os seus dados de pagamento nem a sua palavra-passe em claro"
          />
        </div>
      </div>
    );
  }
}

export default FAQ;
