import React from 'react';
import { Card } from 'semantic-ui-react';


const CampaignsCards = ({campaigns}) => {

    const items = campaigns.map((address)=> {
        return {
            header : address,
            description : <a>View Campaign</a>,
            fluid: true  // =>  to stretch the card
        };
    });

    return (
        <Card.Group items={items} />
    )
}


export default CampaignsCards;




