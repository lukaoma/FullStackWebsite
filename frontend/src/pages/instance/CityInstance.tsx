import React from 'react';
import { Card, CardGroup } from "react-bootstrap";
import { AttributeList } from "./Attribute";
export const CityInstance = ({ element }: {
    element: any;
}) => {
    const title = element.name;
    return (<CardGroup>
        <Card style={{
            maxWidth: '50%'
        }}>
            <div style={{
                backgroundImage: `url(${element.image})`
            }} className='cardImg2'></div>
            <Card.Body>
                <AttributeList title={title} modelName={"Cities"} // TODO: REMOVE
                    element={element} />
            </Card.Body>
        </Card>
    </CardGroup>);
};
