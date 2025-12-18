import { waitForElementToBeRemoved } from "@testing-library/react";
import React, {Component} from "react";
import './ViewOrder.css';

class ViewOrder extends Component{
    state ={};

    render(){
        return(
            <div className = "tabsMenu">
                <ul className="nav nav-tabs">
                    {
                        this.props.tabs.map(tab => {
                            const active = (tab === this.props.selected ? 'active ' : '' );

                            return(
                                <li className="nav-item" key={ tab }>
                                <a className={"nav-link " + active } onClick={ () => this.props.setSelected(tab) }>
                                { tab }
                                </a>
                                </li>
                            );

                        })
                    }
                </ul>
                { this.props.children }
            </div>
        )
    }
}

export default ViewOrder;

// + styles.tab