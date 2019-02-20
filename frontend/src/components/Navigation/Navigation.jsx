import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import sections from './sections';
import styled from 'styled-components';
import _ from 'lodash';

const PATH = window.location.pathname;
const urlValue = _.find(sections, ['section', PATH.includes('id') ? 'id' : PATH.slice(1)]).value;

class Navigation extends React.Component {
  state = { value: urlValue };

  handleChange = (event, value) => this.setState({ value });

  render() {
    const { value } = this.state;
    const user = this.props;

    return (
      <Wrapper>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            centered
          >
            {sections.map((section, i) =>
              <Tab
                key={i}
                label={section.label}
                onClick={() => user.handleChangeSection(section.section !== 'id' ? section.section : `id${user.user_logged_id}`)}
                component={Link}
                to={section.section !== 'id' ? section.section : `id${user.user_logged_id}`}
                icon={section.img}
              />
            )}
          </Tabs>
        </AppBar>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  background-color: #ffffff;
  margin-bottom: 4px;

  a {
    width: ${100 / sections.length}%
  }
  svg {
    color: #1976d2;
  }
`;

export default Navigation;