import React from "react";
import ModelPage from "./Base"

function AllModels({...props}) {
    const queryString = require('query-string');
    const parsedString = queryString.parse(props.location.search);
    let name: string = parsedString["type"];
    let search: string = parsedString["search"]

    return (
        <div>
            <ModelPage modelName={name} search={search}/>
        </div>
    );
}

export default AllModels
