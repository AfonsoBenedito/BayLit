import { waitForElementToBeRemoved } from "@testing-library/react";
import React, {Component} from "react";
import './FooterCss.css';
/*
import {
  Box,
  Container,
  Row,
  Column,
  FooterLink,
  Heading,
} from "./FooterStyles.js";
*/

class Footer extends Component{
  state ={};

  render(){
    return(
      <footer>
        <div className="categoriaFooter">
          <p className="categoriaTituloFooter">Sobre nós</p>
          <p className="categoriaTextFooter">Quem somos?</p>
          <p className="categoriaTextFooter">Objetivos</p>
          <p className="categoriaTextFooter">Membros da equipa</p>
          <p className="categoriaTextFooter">Perguntas frequentes</p>
        </div>
        <div className="categoriaFooter">
          <p className="categoriaTituloFooter">Ajudas</p>
          <p className="categoriaTextFooter">Consumidor</p>
          <p className="categoriaTextFooter">Transportador</p>
          <p className="categoriaTextFooter">Fornecedor</p>
          <p className="categoriaTextFooter">Gerais</p>
        </div>
        <div className="categoriaFooter">
          <p className="categoriaTituloFooter">Contactos</p>
          <p className="categoriaTextFooter">BayLitGeral@gmail.com</p>
          <p className="categoriaTextFooter">BayLitSuporte@gmail.com</p>
          <p className="categoriaTextFooter">BayLitParcerias@gmail.com</p>
        </div>
        <div className="categoriaFooter">
          <p className="categoriaTituloFooter">Social Media</p>
          <p className="categoriaTextFooter">Facebook</p>
          <p className="categoriaTextFooter">Instagram</p>
          <p className="categoriaTextFooter">Twitter</p>
          <p className="categoriaTextFooter">Youtube</p>
        </div>
      </footer>
    )
  }
}

export default Footer;

/*
const Footer = () => {
  return (
    <Box>
      <Container>
        <Row>
          <Column>
            <Heading>Sobre nós</Heading>
            <FooterLink href="#">Quem somos?</FooterLink>
            <FooterLink href="#">Objetivos</FooterLink>
            <FooterLink href="#">Membros da equipa</FooterLink>
            <FooterLink href="#">Perguntas frequentes</FooterLink>
          </Column>
          <Column>
            <Heading>Ajudas</Heading>
            <FooterLink href="#">Consumidor</FooterLink>
            <FooterLink href="#">Transportador</FooterLink>
            <FooterLink href="#">Fornecedor</FooterLink>
            <FooterLink href="#">Gerais</FooterLink>
          </Column>
          <Column>
            <Heading>Contactos</Heading>
            <FooterLink href="#">BayLitGeral@gmail.com</FooterLink>
            <FooterLink href="#">BayLitSuporte@gmail.com</FooterLink>
            <FooterLink href="#">BayLitParcerias@gmail.com</FooterLink>
            <FooterLink href="#"></FooterLink>
          </Column>
          <Column>
            <Heading>Social Media</Heading>
            <FooterLink href="#">Facebook</FooterLink>
            <FooterLink href="#">Instagram</FooterLink>
            <FooterLink href="#">Twitter</FooterLink>
            <FooterLink href="#">Youtube</FooterLink>
          </Column>
        </Row>
      </Container>
    </Box>
  );
};
export default Footer;
*/