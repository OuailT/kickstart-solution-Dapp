import React from "react";
import factory from "../ethereum/Factory";
import CampaignsCards from "./components/CampaignsCards";


// Main Page component
const index = ({campaigns}) => {
    return(
        <>
        <link
    async
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
  />
            <h1>Welcome Home sweet Darling </h1>
            <CampaignsCards campaigns={campaigns}/>
        </>
    )
}

// To get the initial Data from the next server
index.getInitialProps = async () => {
    const campaigns = await factory.methods.getAllCampaignsAddress().call();
    return {campaigns : campaigns};
}


// function component to create an array of objects for each campaigns





// Components life cycle rendering 1 on the server and then on the browser
/* When se send our code to the "next server",
1-the server look at the component that we want to render.
2-look at the getInitialsProps function and execute this only
3-SERVER give us back the inital DATA 
4-SERVER take the inital DATA and pass it as props to the component
5- then THE SERVER render this components and send it the HTML to the browser
## WITH NEXT WE FETCH THE DATA ON THE SERVER SO EVEN WHEN THE INTERNET IS SLOW OR WE DON'T have metamsk we still see some content
*/



export default index;