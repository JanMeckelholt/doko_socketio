import React from 'react';
import { Button, Card } from 'react-bootstrap'

import './TrickCard.css';
const cardFolder= '/cards/'



const TrickCard = ({card, player}) => (
    <div className="TrickCard">
        {card ? (

            <Card className="ml-3 mb-3 mt-3 border-secondary text-center">
                <Card.Img variant="top" src={process.env.PUBLIC_URL + `${cardFolder}${card}.png`} />
                <Card.Body>

                    <Card.Text>{player}</Card.Text>
                </Card.Body>
            </Card>


        ) : null }
    </div>
);
    
    
export default TrickCard;

