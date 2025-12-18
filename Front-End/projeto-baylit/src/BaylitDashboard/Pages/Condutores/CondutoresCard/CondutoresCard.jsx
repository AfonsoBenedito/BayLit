import React, { Component } from "react";
import "./CondutoresCard.css";

class CondutoresCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      nome: this.props.nome,
      idade: this.props.idade,
      condutorId: this.props.condutorId,
      backgroundCard: this.props.backgroundCard,

      deleteCondutorQuestion: this.props.deleteCondutorQuestion,
    };
  }
  render() {
    return (
      <div className={"mainEmployeesCard " + this.state.backgroundCard}>
        <div className="detailsProductDiscountCard">
          <div className="photoNameEmployee">
            {/* <div className="photoEmployeeCard"></div> */}
            <h4 className="nameEmployeeCard">{this.state.nome}</h4>
          </div>
          {/* <i className="bi bi-three-dots"></i> */}
          {/* <button className="employeeCardButton"> */}
          <i id={this.state.condutorId} class="bi bi-x-circle closeEmployeeCardButton"
          onClick={(e) => {
          this.state.deleteCondutorQuestion(e);
          }}></i>
          
        </div>
        <hr />
        <div className="aboutPromotion">
          <div className="blockDatesPromotions">
            <div className="employeesInfo">
              <i class="bi bi-heart-fill"></i>
              <h5 className="employeesInfoText">{this.state.idade} anos</h5>
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

export default CondutoresCard;
