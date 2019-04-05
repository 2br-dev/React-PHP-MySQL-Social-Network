import React, { useState } from 'react';
import styled from 'styled-components';
import ResponsiveHeader from '../ResponsiveHeader/ResponsiveHeader';
import Cards from './Container';
import Materials from './Materials';
import Tests from './Tests';

function Learnings() {
  const [opened, setOpened] = useState(false);

  function changeSection(section) {
    setOpened(section);
  }

  return (
    <Wrapper>
      {window.innerWidth < 600 ? <ResponsiveHeader title='Обучение' /> : null}

      {!opened 
        ? <Cards 
            class='learnings-container' 
            changeSection={changeSection} 
          />
        : opened === 'tests' 
          ? <Tests />
          : <Materials />
      }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .learnings-container {
    display: flex;
  }
  @media all and (max-width: 600px) {
    .learnings-container {
      flex-direction: column;
      padding-bottom: 50px;
      & > div {
        margin: 0 auto 25px;
      }
    }
  }
`;

export default Learnings;