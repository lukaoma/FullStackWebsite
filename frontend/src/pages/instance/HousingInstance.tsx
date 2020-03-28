import React from 'react';
import { Card, CardGroup } from "react-bootstrap";
import { AttributeList } from "./Attribute";
export const HousingInstance = ({ element }: {
    element: any;
}) => {
    const title = element.address_modified;
    return (<CardGroup>
        <Card style={{
            maxWidth: '50%'
        }}>
            <div style={{
                backgroundImage: `url(${element.image})`
            }} className='cardImg2'></div>
            <Card.Body>
                <AttributeList title={title} modelName={"Homes"} // TODO: REMOVE
                    element={element} />
            </Card.Body>
        </Card>
    </CardGroup>);
};
