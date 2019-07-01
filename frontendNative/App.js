import React, {Component} from 'react';
import { 
  Container, 
  Header, 
  Content, 
  Form, 
  Item, 
  Input, 
  Label,
  Footer,
  Button,
  Text,
  Left,
  Body,
  Title,
  Subtitle,
  Right,
  Icon
} from 'native-base';
import { StyleSheet } from 'react-native';


export default class App extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Icon 
              name="arrow-back"
              color="white"/>
          </Left>
          <Body>
            <Title>Title</Title>
            <Subtitle>Subtitle</Subtitle>
          </Body>
          <Right>
            
          </Right>
        </Header>        
        <Content>
          <View>
            <Button
              onPress={}
            />
          </View>
        </Content>
        <Footer/>
      </Container>
       
    );
  }
}

const styles = StyleSheet.create({
  
});
