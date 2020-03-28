import React from 'react';
import {FormControl} from "react-bootstrap";


export class FormControlPlus extends React.Component<{ [name: string]: any }, {}> {

    state = {
        val: ""
    };

    updateState(str: string) {
        this.setState({
            val: str
        });
        
        if (this.props.onChange != null) this.props.onChange();
    }


    render() {
        return (
            <div>
                <FormControl
                    id={this.props.id}
                    autoComplete="off"
                    type='text'
                    disabled={this.props.disabled}
                    name={this.props.name}
                    value={this.state.val}
                    className={"myForm"}
                    placeholder={this.props.placeholder}
                    onChange={(e) => this.updateState(e.target.value)}
                />
                <button className='formResetButton' onClick={() => this.updateState("")}></button>
            </div>
        );
    }
}


