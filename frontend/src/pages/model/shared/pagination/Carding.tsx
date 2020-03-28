import React from 'react';
import CityComponent from '../../models/City';
import HomeComponent from '../../models/Home';
import CommuteComponent from '../../models/Commute';

export class MyCards extends React.Component<{ [name: string]: any }, {}> {

    state = {
        pageNum: 1,
        queryString: null,
    };

    updateCards(num: number, query: string) {
        this.setState({
            pageNum: num,
            queryString: query,
        });
    }

    render() {
        console.log("rendering cards for "  + this.props.modelName + " with query " + this.props.queryString);

        switch (this.props.modelName) {
            case "Cities":
                return (
                    <div className='row'>
                        <CityComponent pageNum={this.state.pageNum} handler={this.props.handler}
                                       query={this.props.queryString} highlight={this.props.highlight}/>
                    </div>
                );
            case "Commutes":
                return (
                    <div className='row'>
                        <CommuteComponent pageNum={this.state.pageNum} handler={this.props.handler}
                                          query={this.props.queryString} highlight={this.props.highlight}/>
                    </div>
                );
            case "Homes":
                return (
                    <div className='row'>
                        <HomeComponent pageNum={this.state.pageNum} handler={this.props.handler}
                                       query={this.props.queryString} highlight={this.props.highlight}/>
                    </div>
                );
            default:
                console.log("ERROR: " + this.props.modelName);
                return (<div/>);
        }
    }
}
