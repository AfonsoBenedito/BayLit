import React, {Component} from "react"

class Logout extends Component{
    constructor(props){
        super(props)

        localStorage.removeItem('baylitInfo')

        window.location.href = "/"
    }

    render(){
        return(<div>Página só para Logout</div>)
    }

}

export default Logout