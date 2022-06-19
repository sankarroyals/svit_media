import React from 'react'
// import grid from sematic-ui-css
import { Grid, Button, Popup, Header, Modal } from 'semantic-ui-react'
import Image from "semantic-ui-react/dist/commonjs/elements/Image";

function welcome() {
  return (
    <div style={{marginTop:"2rem"}}>
        <h1>Welcome to Svit</h1>
        
        <Grid columns={2}>
            <Grid.Column>
                <h2>What is Svit?</h2>
                <p>
                    Svit is a social network for students and teachers.
                    It is a place where you can share your knowledge,
                    find new friends, and connect with your teachers.
                </p>
            </Grid.Column>
            <Grid.Column>
                <Image src='/tlogo.png' 
                    size='medium'
                 />
            </Grid.Column>
        </Grid>


    </div>
  )
}

export default welcome