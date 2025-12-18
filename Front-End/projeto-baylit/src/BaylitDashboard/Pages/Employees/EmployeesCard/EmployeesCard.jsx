import React, { Component } from "react";
import "./EmployeesCard.css";

class EmployeesCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      nome: this.props.nome,
      localidadeCard: this.props.localidadeCard,
      idade: this.props.idade,
      employeeID: this.props.employeeID,

      srcPhotoProduto: this.props.srcPhotoProduto,
      dataInicio: this.props.dataInicio,
      dataFim: this.props.dataFim,
      backgroundCard: this.props.backgroundCard,

      removeEmployee: this.props.removeEmployee,
    };
  }
  render() {
    return (
      <div className={"mainEmployeesCard " + this.state.backgroundCard}>
        <div className="detailsEmployeeDiscountCard">
          <div className="photoNameEmployee">
            {/* <div className="photoEmployeeCard"></div> */}
            <h4 className="nameEmployeeCard">{this.state.nome}</h4>
          </div>
          {/* <i className="bi bi-three-dots"></i> */}
          {/* <button className="employeeCardButton"> */}
          <i id={this.state.employeeID} class="bi bi-x-circle closeEmployeeCardButton"
          onClick={(e) => {
          this.state.removeEmployee(e);
          }}></i>
          
        </div>
        <hr />
        <div className="aboutPromotion">
          <div className="blockDatesPromotions">
            <div className="employeesInfo">
              <i class="bi bi-heart-fill"></i>
              <h5 className="employeesInfoText">{this.state.idade} anos</h5>
            </div>
            <div className="employeesInfo">
              <i className="bi bi-building"></i>
              <h5 className="employeesInfoText">{this.state.localidadeCard}</h5>
            </div>
          </div>
          {/* <div className="blockPricePromotions">
            <p>Hora de entrada</p>
            <h6>8:00h</h6>
            <p>Hora de saída</p>
            <h6>17:00h</h6>
            <p>Salário</p>
            <div className="remainingTime">
            <i class="bi bi-bank"></i>
              <h5>{this.props.salario}</h5>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default EmployeesCard;
