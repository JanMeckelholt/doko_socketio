import React from 'react';
import { Button, Card } from 'react-bootstrap'

import './PlayerHandCard.css';
const cardFolder= '/cards/'



const PlayerHandCard = ({card, index, setTrick}) => {
    const playCard = (card) =>{
        console.log(card);
    }
    
    const handleClick = (e) =>{
        e.preventDefault();
        console.log(e.target.id);
        setTrick(['back', 'back', 'back', `${e.target.id}`]) 
    }

    return(
        <div className="PlayerHandCard">
            {card ? (

                <Card className="ml-3 mb-3 border-secondary text-center">
                    <Card.Img variant="top" src={process.env.PUBLIC_URL + `${cardFolder}${card}.png`} />
                    <Card.Body>
                        <Button id={`${card}`} onClick={handleClick} className="center" variant="primary">Play</Button>
                    </Card.Body>
                </Card>
                


            ) : null }
            
        </div>
    )
};

    
    
export default PlayerHandCard;

