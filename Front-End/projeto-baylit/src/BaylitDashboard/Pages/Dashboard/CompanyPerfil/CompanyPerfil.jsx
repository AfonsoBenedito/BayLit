import React, { Component } from "react";
import "./CompanyPerfil.css";
//import EditButton from "../../../Components/EditButton/EditButton";
import ExpandButton from "../../../Components/ExpandButton/ExpandButton";
import CloseDivButton from "../../../Components/CloseDivButton/CloseDivButton";
import {
  getFornecedor,
  getTransportador,
  mudarDadosFornecedor,
  mudarDadosTransportador,
} from "../../../../Helpers/UserHelper";

import ReactDOM from "react-dom";
import {
  getProdutosByFornecedor,
  getArmazensByFornecedor,
} from "../../../../Helpers/FornecedorHelper";

class CompanyPerfil extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
    //this.perfilFill = this.perfilFill.bind(this);
    this.refEditProfile = React.createRef();
  }

  async displayMSProducts() {
    let baylitInfo = JSON.parse(localStorage.getItem("baylitInfo"));
    let fornecedorID = baylitInfo.id;
    let produtosResultado = await getProdutosByFornecedor(fornecedorID);
    if (produtosResultado != false) {
      let listOfProducts = [];
      for (let produto in produtosResultado) {
        listOfProducts.push(<div className="mainCompanyMSProduct"></div>);
      }
      ReactDOM.render(
        listOfProducts,
        document.getElementsByClassName("mostSoldProductsDiv")[0]
      );
    }
  }

  expandDiv() {
    var expandBox = document.getElementById("expandBox");
    var expandButton = document.getElementById("expandButton");

    if (expandBox.style.display === "block") {
      expandBox.style.display = "none";
    } else {
      expandBox.style.display = "block";
    }

    if (expandButton.innerHTML === "Expandir") {
      expandButton.innerHTML = "Diminuir";
    } else {
      expandButton.innerHTML = "Expandir";
    }
  }

  handler() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let tipo = data.tipo;
      let a;
      if (tipo == "Transportador") {
        a = [
          <div className="editProfile_Inputs" id="editProfile_Inputs">
            <form
              action=""
              id="form_update_info1"
              
            >
              <div className="div_do_pessoal">
                <h3 id="titulo_pessoal">Pessoal</h3>
                <div className="">
                  <div className="" id="div_nome">
                    <p>Nome</p>
                    <input
                      type="text"
                      placeholder="Nome de utilizador"
                      name="name1"
                      id="name1"
                      className="editProfileInputColor"
                    />
                  </div>
                </div>
                <div id="div_morada">
                  <p>Morada</p>
                  <input
                    type="text"
                    placeholder="Morada"
                    name="morada1"
                    id="morada1"
                    className="editProfileInputColor"
                  />
                </div>
                <div id="div_nif">
                  <p>NIF</p>
                  <input
                    type="text"
                    placeholder="Número de Identificação Fiscal"
                    name="nif1"
                    className="editProfileInputColor"
                    id="nif1"
                  />
                </div>
                <div id="div_telemovel">
                  <p>Telemóvel</p>
                  <input
                    type="text"
                    placeholder="Número de Telemóvel"
                    name="telemovel1"
                    id="telemovel1"
                    className="editProfileInputColor"
                  />
                </div>
              </div>

              <div className="div_do_pessoal">
                <h3 id="titulo_empresa">Empresa</h3>
                <div id="div_sede">
                  <p>Portes</p>
                  <input
                    type="number"
                    min="0.00"
                    step="0.01"
                    placeholder="Portes"
                    name="portes1"
                    id="portes1"
                    className="editProfileInputColor"
                  />
                </div>
              </div>

              <button className="btnUpdate1" type="button" onClick={async () => {await this.submitProfiles()}}>Atualizar Dados</button>
            </form>
            <p id="erro"></p>
            <p id="erroB"></p>
          </div>
        ];
      } else if (tipo == "Fornecedor") {
        a = [
          <div className="editProfile_Inputs" id="editProfile_Inputs">
            <form
              action=""
              id="form_update_info2"
              
            >
              <div className="div_do_pessoal">
                <h3 id="titulo_pessoal2">Pessoal</h3>
                <div className="">
                  <div className="" id="div_nome2">
                    <p>Nome</p>
                    <input
                      type="text"
                      placeholder="Nome de utilizador"
                      name="name"
                      id="name2"
                      className="editProfileInputColor"
                    />
                  </div>
                </div>
                <div id="div_morada2">
                  <p>Morada</p>
                  <input
                    type="text"
                    placeholder="Morada"
                    name="morada"
                    id="morada2"
                    className="editProfileInputColor"
                  />
                </div>
                <div id="div_nif2">
                  <p>NIF</p>
                  <input
                    type="text"
                    placeholder="Número de Identificação Fiscal"
                    name="nif"
                    id="nif2"
                    className="editProfileInputColor"
                  />
                </div>
                <div id="div_telemovel2">
                  <p>Telemóvel</p>
                  <input
                    type="text"
                    placeholder="Número de Telemóvel"
                    name="telemovel"
                    id="telemovel2"
                    className="editProfileInputColor"
                  />
                </div>
              </div>

              <button className="btnUpdate1" type="button" onClick={async () => {await this.submitProfiles()}}>Atualizar Dados</button>
            </form>
            <p id="erro"></p>
            <p id="erroB"></p>
          </div>
        ];
      }
      ReactDOM.render(a, this.refEditProfile.current);
    }
  }

  functionEditProfile() {
    var editProfileDiv = document.getElementById("editProfile_Inputs");

    if (editProfileDiv.style.display === "block") {
      editProfileDiv.style.display = "none";
    } else {
      editProfileDiv.style.display = "block";
      // editProfileDiv.style.scrollBehavior = "smooth";
    }
  }

  closeDivButton() {
    var editProfileDiv = document.getElementById("companyPerfilEdit");

    if (editProfileDiv.style.display === "none") {
      editProfileDiv.style.display = "block";
    } else {
      editProfileDiv.style.display = "none";
    }
  }

  async submitProfiles() {
    
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let tipo = data.tipo;
      let id = data.id;
      if (tipo == "Transportador") {

        let formdata = new FormData(document.getElementById("form_update_info1"))
       
        let nome = formdata.get("name1")
        let morada = formdata.get("morada1")
        let nif = formdata.get("nif1")
        let telemovel = formdata.get("telemovel1")
        let portes = formdata.get("portes1")



        let res1 = await mudarDadosTransportador(id, data.token, nome,morada,nif,telemovel,portes);
        if (res1 == true) {
          document.getElementById("erroB").innerHTML =
            "Os seus dados foram corretamente atualizados";

          setTimeout(
            function() {
                window.location.href = "/Dashboard/PerfilCompany"
            }
            .bind(this),
            1500
          );
        } else {
          document.getElementById("erro").innerHTML =
            "Algo correu mal na alteração dos seus dados, verifique o preenchimento da totalidade dos campos e tente novamente";
        }
      } else if ((tipo = "Fornecedor")) {
        let formdata = new FormData(document.getElementById("form_update_info2"))
       
        let nome = formdata.get("name")
        let morada = formdata.get("morada")
        let nif = formdata.get("nif")
        let telemovel = formdata.get("telemovel")



        let res1 = await mudarDadosFornecedor(id, data.token, nome,morada,nif,telemovel);
        if (res1 == true) {
          document.getElementById("erroB").innerHTML =
            "Os seus dados foram corretamente atualizados";

          setTimeout(
            function() {
                window.location.href = "/Dashboard/PerfilCompany"
            }
            .bind(this),
            1500
          );
        } else {
          document.getElementById("erro").innerHTML =
            "Algo correu mal na alteração dos seus dados, verifique o preenchimento da totalidade dos campos e tente novamente";
        }
      }
    }
  }

  async inputFillGeneral() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let tipo = data.tipo;
      let id = data.id;
      if (tipo == "Transportador") {
        let res = await getTransportador(id);
        document.getElementById("name1").value = res.nome;
        document.getElementById("morada1").value = res.morada;
        document.getElementById("nif1").value = res.nif;
        document.getElementById("telemovel1").value = res.telemovel;
        document.getElementById("portes1").value = res.portes_encomenda;
      } else if (tipo == "Fornecedor") {
        let res = await getFornecedor(id);
        document.getElementById("name2").value = res.nome;
        document.getElementById("morada2").value = res.morada;
        document.getElementById("nif2").value = res.nif;
        document.getElementById("telemovel2").value = res.telemovel;
      }
    }
  }

  async perfilFill() {
    let data = JSON.parse(localStorage.getItem("baylitInfo"));
    if (data != null) {
      let tipo = data.tipo;
      let id = data.id;
      let token = data.token;
      if (tipo == "Transportador") {
        let res = await getTransportador(id);
        if (res != false) {
          let nome = res.nome;
          let sede = res.sede;
          let numero_veiculos = 10; //MUDAR
          //let dataT = await getTransportes(id);
          //let numeroVeiculos = dataT.length;
          let viagens_realizadas = 12; //MUDAR
          //let dataT1 = await getViagens(id)
          //let viagens_realizadas = dataT1.length;
          document.getElementsByClassName(
            "navPerfilCompanyDescription"
          )[0].innerHTML =
            "Somos uma empresa sediada em " +
            sede +
            ". O nosso objetivo enquanto transportadores é efetuar o transporte dos produtos desde os armazéns onde estão contidos até à morada do consumidor final. Neste momento possuimos " +
            numero_veiculos +
            " veiculos para efetuar os nossos transportoes, tendo efetuado um total de " +
            viagens_realizadas +
            " entegas com sucesso";

          document.getElementById("nome_empresa").innerHTML = nome;
          document.getElementById("localizacao").innerHTML = sede;
          document.getElementsByClassName(
            "navImagePerfilCompany"
          )[0].style.backgroundColor = "green";
          let a = document.getElementsByClassName("navImagePerfilCompany")[0];
          let letra_nome = nome.charAt(0);
          a.append(letra_nome);

          a.style.fontSize = "50px";

          a.style.color = "white";
        } else {
          document.getElementsByClassName("erro")[0].innerHTML =
            "Algo correu mal na conexão, experimente mais tarde";
        }
      } else if (tipo == "Fornecedor") {
        let res = await getFornecedor(id);
        // console.log(res);
        if (res != false) {
          let nome = res.nome;
          let morada = res.morada;
          let nmr_produtos = 20; // MUDAR F
          let nmr_armazens = 5; //MUDAR F
          // let ress = await getArmazensByFornecedor(id, token);
          // let nmr_armazens1 = ress.length;
          // console.log(nmr_armazens1);

          document.getElementsByClassName(
            "navPerfilCompanyDescription"
          )[0].innerHTML =
            "Somos uma empresa com morada em " +
            morada +
            ". O nosso objetivo enquanto fornecedores é vender os melhores produtos do mercado com vista à sustentabilidade. Possuimos atualmente um total de " +
            nmr_produtos +
            " produtos e  " +
            nmr_armazens +
            " armazens.";
          document.getElementById("nome_empresa").innerHTML = nome;
          document.getElementById("localizacao").innerHTML = morada;

          document.getElementsByClassName(
            "navImagePerfilCompany"
          )[0].style.backgroundColor = "var(--corUtilizador)";
          let a = document.getElementsByClassName("navImagePerfilCompany")[0];

          let letra_nome = nome.charAt(0);
          a.append(letra_nome);
          a.style.fontSize = "50px";
          a.style.color = "white";
        }
      }
    }
  }

  changePerfilCompanyInside(){
    document.getElementById("btnPerfilCompany").style.backgroundColor =
      "rgba(96, 96, 96, 0.7)";
    document.getElementById("btnPromotions").style.backgroundColor =
      "transparent";
    document.getElementById("btnSustainability").style.backgroundColor =
      "transparent";
  }

  async componentDidMount() {
    await this.perfilFill();
    this.changePerfilCompanyInside();

    /* await this.displayProducts(); */
    this.handler();
    document
      .getElementById("btn_edit")
      .addEventListener("click", this.functionEditProfile);
    document
      .getElementById("btn_edit")
      .addEventListener("click", this.inputFillGeneral);
  }

  render() {
    return (
      <div className="mainCompanyPerfil">
        <div className="navImagePerfilCompany"></div>

        <h4 id="nome_empresa"></h4>
        <p id="localizacao"></p>

        <p className="navPerfilCompanyDescription" id="ola"></p>
        <p id="erro"></p>
        <div>
          <button id="btn_edit">Editar Perfil</button>
        </div>
        <div className="companyPerfilEdit" id="companyPerfilEdit">
          <CloseDivButton
            name="X"
            theme="light"
            closeDivButton={this.closeDivButton}
          />
        </div>

        <div ref={this.refEditProfile} className="editProfile_Inputs5" id="editProfile_Inputs5"></div>

        {/* <ExpandButton
          class="asdasdad"
          id="expandButton"
          name="Expandir"
          theme="light"
          expandMinimizePromotions={this.expandDiv}
        /> */}

        <div id="expandBox" className="expandBox">
          <p id="mainCompanyMostSold" className="mainCompanyMostSold">
            Produtos mais vendidos
          </p>{" "}
          {/*Meter seta*/}
          {/* <i className="bi bi-arrow-bar-down iconSetaBaixo"></i> */}
          <div id="mostSoldProductsDiv" className="mostSoldProductsDiv">
            <div className="mainCompanyMSProduct"></div>
            <div className="mainCompanyMSProduct"></div>
            <div className="mainCompanyMSProduct"></div>
            <div className="mainCompanyMSProduct"></div>
            <div className="mainCompanyMSProduct"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyPerfil;
