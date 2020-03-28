import React from 'react';
import { Card, CardGroup } from "react-bootstrap";
export const CommuteInstance = ({ element }: {
    element: any;
}) => {
    return (<CardGroup>
        <Card style={{
            maxWidth: '50%'
        }}>
            <div style={{
                backgroundImage: `url(${element.image})`
            }} className='cardImg2'></div>
            <Card.Body>
                COMMUTE
                </Card.Body>
        </Card>
    </CardGroup>);
};
