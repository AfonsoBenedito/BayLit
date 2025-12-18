import React, { Component } from "react";

import "./FilterButton.css";

class FilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      addClass: this.props.addClass,
      name: this.props.name,
      rightIcon: this.props.rightIcon,
      leftIcon: this.props.leftIcon,
    };
  }
  displayLeftIcon = (allClasses) => {
    if (allClasses != "") {
      return <i className={allClasses}></i>;
    } else {
      return;
    }
  };
  displayRightIcon = (allClasses) => {
    if (allClasses != "") {
      return <i className={allClasses + " " + "smallIcon"}></i>;
    } else {
      return;
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.setState({
        rightIcon: this.props.rightIcon,
      });
    }
  }

  render() {
    return (
      <div id={this.state.id} className={"filterButton " + this.state.addClass}>
        {this.displayLeftIcon(this.state.leftIcon)}
        <h6>{this.state.name}</h6>
        {this.displayRightIcon(this.state.rightIcon)}
      </div>
    );
  }
}

export default FilterButton;
