import React from 'react';
import {Button, Col, Container, Jumbotron, Row} from "react-bootstrap";

import NavigationHeader from '../shared/NavigationHeader';
import background from './splash.jpg';

const LaunchPage: React.FC = () => {
    return (
        <div>
            <NavigationHeader onClickHandler={null}/>

            <div style={{backgroundImage: `url(${background})`}} className='fullScreen' id='welcomePage'>
                <Container className='h-100'>
                    <Row className='align-items-center h-100'>
                        <Col xl={6} lg={6} md={8} sm={12} className='mx-auto'>
                            <Jumbotron className='text-center jumbo-center'
                                       style={{backgroundColor: 'rgba(255,255,255,0.8)'}}>
                                <span className='welcome-banner'>Welcome!</span>
                                <Row>
                                    <Col className='mt-5'>
                                        <p>
                                            Choosing where to go after graduation is a complicated decision. Let us take
                                            all the hassle out of it. With Costly Commute, you can compare and sort
                                            cities by housing, commutes, and crime rates.
                                        </p>
                                        <p>
                                            Find your new home today.
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='mb-5 mt-5 text-center'>
                                        <Button variant='primary' size='lg' href='/Model?type=Cities'>Let's go</Button>
                                    </Col>
                                </Row>
                            </Jumbotron>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default LaunchPage;
