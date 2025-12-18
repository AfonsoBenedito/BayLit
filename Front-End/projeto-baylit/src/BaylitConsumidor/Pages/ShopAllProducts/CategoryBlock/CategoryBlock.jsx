import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./CategoryBlock.css";

class CategoryBlock extends Component {
  
  constructor(props){

    super(props)
    
    this.state = {
      name: this.props.name,
      id: this.props.id,
      subcategorias: this.props.subcategorias,
      fotografia: this.props.fotografia
    };
  }

  addSubcategorias(){
    var res = []
    for (let i = 0; i < this.state.subcategorias.length; i++){
      
      var newP = <a href={"/Shop/" + this.state.id + "/" + this.state.subcategorias[i]._id} class='subCategoryBlock' key={i} > {this.state.subcategorias[i].nome} </a>;
      res.push(newP);
      
    }

    return res;
  }

  render() {
    
    return (
      <div class="categoryBlock">
        <a href={"/Shop/" + this.state.id}>
          <div class="positionImageCategoryBlock">
            <img src={this.state.fotografia} alt={this.state.name} loading="lazy" />
          </div>
          <h3 class="titleCategoryBlock">{this.state.name}</h3>
        </a>
        {this.addSubcategorias()}
      </div>
      
    );
  }
}

export default CategoryBlock;
