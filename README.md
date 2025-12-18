# BayLit

![BayLit_logo](https://user-images.githubusercontent.com/78313327/161591852-d87685d7-109e-4269-944b-f7d8c6707a84.jpeg)

[PT]

BayLit é um projeto que pretende desenvolver uma plataforma de comércio online (como a Amazon ou o Ebay) amiga do ambiente.

O objetivo do projeto é dar informação ao consumidor sobre os recursos gastos e poluição gerada na produção, transporte e armazenamento dos produtos que está a adquirir. Com recurso a esta informação a plataforma tentará ajudar os consumidores a tomarem a decisão mais ecológica, ao mesmo tempo que encoraja as empresas a reduzirem as suas emissões de forma a tornarem-se mais atractivas para os consumidores da plataforma.

O projeto está a ser desenvolvido no âmbito de um projeto final de licenciatura por um grupo de 6 alunos da Licenciatura em Tecnologias de Informação da Faculdade de Ciências da Universidade de Lisboa, estes são:
* Afonso Coelho
* Afonso Silva
* Gonçalo Cruz
* Renato Ramires
* Tiago Teodoro
* Tomás Ndlate

O projeto foi desenvolvido com a stack MERN, sendo que toda a sua informação flui em objetos JSON.

Um diagrama descritivo da arquitetura do sistema pode ser observado em baixo:

![Diagrama de Implementação](https://user-images.githubusercontent.com/78313327/161817862-9bf6117a-e9e6-42ca-b1de-2f2cf51d95a9.jpg)

O repositório está dividido em duas pastas principais, que correspondem à divisão entre o front-end da aplicação e o seu back-end.

Na pasta de front-end encontram-se as páginas da aplicação, desenhadas com recurso à framework ReactJS.

Na pasta de back-end existem 3 pastas principais que representam 3 camadas diferentes da aplicação:
* API: onde se encontra o código da API escrito utilizando a framework ExpressJS e a especificação da mesma num ficheiro .yaml
* Camada Lógica: onde se encontra a camada lógica da aplicação, distribuída em vários handlers que lidam com diferentes funcionalidades 
* Camada de Dados: onde se encontram os scripts relacionados com a BD, incluindo os models descritos com a framework mongoose e as gateways que abstraem o acesso aos dados

A documentação da API pode ser consultada em: https://app.swaggerhub.com/apis-docs/tiaguu/bay-lit_api/2.0.0#/

Qualquer developer interessado em contribuir para o projeto poderá fazê-lo ao resolver um dos open issues do projeto, fazendo depois um pull request da sua solução para o repositório. Esta proposta de solução será analisada pela equipa autora do projeto, podendo vir a ser aceite.

O projeto é licenseado por uma MIT License.





[EN]

BayLit is a project that aims to develop a green e-commerce platform (like Amazon or Ebay).

The purpose of this project is to give information to the consumer about the resources used and the generated polution in the production, transportation and storage of the product he is purchasing. By making use of this information the platform will try to help consumers making the best ecological decision at the same time it drives companies to take action and reduce their emissions, in order to make themselves more atractive to BayLit users.

This project is being developed by 6 students at Faculdade de Ciências da Universidade de Lisboa in their Bachelors final project. The authors:
* Afonso Coelho
* Afonso Silva
* Gonçalo Cruz
* Renato Ramires
* Tiago Teodoro
* Tomás Ndlate

The project was developed using the MERN stack, with all its information flowing in JSON objects.

The system architecture diagram:

![Diagrama de Implementação](https://user-images.githubusercontent.com/78313327/161817899-e45ce96e-e413-4fac-b284-293d81cceb9c.jpg)

The repository has two main folders, one for front-end related code and another for back-end related code.

In the front-end folder you can find the application pages written with ReactJS.

In the back-end folder there are 3 main folders that represent 3 different application layers:
* API: where you can find the ExpressJS API and an .yaml filme with its specification
* Logic Layer: the logic layer of the application is divided between multiple handlers that deal with different functionalities
* Data Layer: contains the database related scripts, including mongoose models and the gateways that create an abstraction to interact with the data layer

API documentation can be consulted at: https://app.swaggerhub.com/apis-docs/tiaguu/bay-lit_api/2.0.0#/

Any developer interested in contributing to the project can do so by solving any project open issue and making a pull request with bis solution. This solution proposal will be evaluated by the authors of the project, and they’ll deliber whether to implement it or not.

This project has an MIT License.


