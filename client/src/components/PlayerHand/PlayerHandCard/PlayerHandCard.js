import React from 'react';
import { Button, Card } from 'react-bootstrap'

import './PlayerHandCard.css';
const cardFolder= '/cards/'



const PlayerHandCard = ({card, index}) => (
    <div className="PlayerHandCard">
        {card ? (

            <Card className="ml-3 mb-3 border-secondary text-center">
                <Card.Img variant="top" src={process.env.PUBLIC_URL + `${cardFolder}${card}.png`} />
                <Card.Body>
                    <Button className="center" variant="primary">Play</Button>
                </Card.Body>
            </Card>
            


        ) : null }
        
    </div>
);
    
    
export default PlayerHandCard;

