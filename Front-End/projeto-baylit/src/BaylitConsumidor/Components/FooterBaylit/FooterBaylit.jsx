import React, { Component } from "react";
import "./FooterBaylit.css";

class Footer extends Component {
  state = {};

  render() {
    return (
      <footer>
        <div className="categoriaFooter">
          <h5>Aceder</h5>
          <a href="/">
            <p>Home</p>
          </a>
          <a href="/Shop">
            <p>Loja</p>
          </a>
          <a href="/sustentabilidade">
            <p>Sustentabilidade</p>
          </a>
          <a href="/perfil">
            <p>Perfil</p>
          </a>
        </div>
        <div className="categoriaFooter">
          <h5>Atalhos</h5>
          <a href="/ShoppingCar">
            <p>Carrinho</p>
          </a>
          <a href="/Compare">
            <p>Comparar</p>
          </a>
          <a href="/Perfil/Favoritos">
            <p>Favoritos</p>
          </a>
          <a href="/perfil">
            <p>Encomendas</p>
          </a>
        </div>
        <div className="categoriaFooter">
          <h5>Apoio cliente</h5>
          <a href="/faq">
            <p>FAQ</p>
          </a>
          <a href="/aboutus">
            <p>Equipa</p>
          </a>
        </div>
        <div className="categoriaFooter">
          <h5>Contactos</h5>
          <p>+351 9-- --- ---</p>
          <p>baylitstore@gmail.com</p>
        </div>
        <div className="categoriaFooter">
          <h5>Redes sociais</h5>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
          <p>Youtube</p>
        </div>
      </footer>
    );
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
