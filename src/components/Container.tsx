import React from 'react';
import {styled} from 'linaria/react';


// ----- Styles ----------------------------------------------------------------

const Container = styled.div`
  width: auto;
  margin-left: auto;
  margin-right: auto;

  /* Small devices (landscape phones, 576px and up) */
  @media (min-width: 576px) {
    width: 540px;
  }

  /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) {
    width: 720px;
  }

  /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    width: 960px;
  }

  /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200px) {
    width: 1140px;
  }
`;


// ----- Component -------------------------------------------------------------

const ContainerComponent: React.FunctionComponent = props => {
  return (
    <Container>
      {props.children}
    </Container>
  );
};


export default ContainerComponent;
