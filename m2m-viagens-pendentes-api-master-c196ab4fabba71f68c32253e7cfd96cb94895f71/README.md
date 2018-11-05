# O Projeto
O projeto m2m-viagens-pendentes-api, é o projeto de viagens pendentes e viagens sem motoristas feito em NodeJS
> O projeto m2m-viagens-pendentes-api integra a arquitetura
> de micro-serviços utilizada na M2M Solutions
> afim de escalar e diminuir o bloco monol�tico
> geralmente usada em projetos de grande porte.
> 
> M2M Solutions

# Instalação
O projeto m2m-viagens-pendentes-api precisa do [Node.js](https://nodejs.org/) v6+ para rodar.
Para instalação em desenvolvimento
```sh
npm install
```
# Configuração
Para a execução do projeto é necessário definir o arquivo de configuração 
utilizado no projeto através da variável de ambiente `NODE_ENV` 
que o valor  default � `development`, sendo aplicada a configuração `app/env/develoment.js`

# Testes
O framework usado para execução dos testes é o [Mocha](https://mochajs.org/)
## Instalação
```sh
npm install -g mocha
```
#### Execução dos testes
```sh 
npm test
```
## Licença
ISC