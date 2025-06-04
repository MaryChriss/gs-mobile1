# futureStack - ClimaESP ☁️🌡️

Plataforma de monitoramento climático inteligente com integração via API, interface mobile amigável e controle de favoritos e histórico por usuário.

## 📋 Descrição da Solução

O ClimaESP é uma solução tecnológica que permite o monitoramento e a consulta de dados climáticos como temperatura, umidade, chuva, vento etc.., com base nas cidades pesquisadas pelos usuários.

Utilizando dispositivos IoT para coleta em tempo real, os dados são armazenados em um banco de dados e apresentados de forma acessível, contribuindo para a conscientização ambiental, planejamento de atividades e prevenção de riscos climáticos como enchentes ou ondas de calor.

Cada cidade pesquisada é registrada em um histórico e pode ser favoritada, facilitando o acompanhamento contínuo por parte de agricultores, moradores e gestores públicos. O ClimaESP combina tecnologia e boas práticas para ajudar pessoas, proteger o meio ambiente e antecipar problemas causados por mudanças climáticas.

## 🚀 Tecnologias Utilizadas

📱 Mobile (Front-End)
- React Native
- TypeScript
- React Native Paper
- Expo
- Axios e fetch
- react-navigation
- AsyncStorage

🌐 Backend
- Java 17 + Spring Boot
- Spring Web, JPA e Validation
- Banco de dados relacional
- Autenticação com JWT
- Swagger (documentação)

## 🖥️ Funcionalidades Principais

- 🔎 Busca por cidade com resultados em tempo real
- 📌 Mapa com marcador da localização pesquisada
- ❤️ Sistema de favoritos com persistência por usuário
- 🕒 Histórico de pesquisas ordenado com data/hora
- 👤 Edição de perfil e exclusão de conta
- 🗑️ Remoção de favoritos com atualização imediata
- 🔒 Controle de autenticação e navegação protegida

## 📱 Estrutura Visual do App
- Tela de Login
- Tela de Cadastro
- Tela Home com busca, mapa e card climático
- Tela de Histórico com ícones de favoritos
- Tela de Perfil com dados do usuário e favoritos

## 🛠️ Como Rodar o Projeto Localmente

1. **Clone o repositório:**

```bash
https://github.com/MaryChriss/gs-mobile1.git
cd gs-mobile1
```

2. **Baixar dependecias**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo chamado .env na raiz do projeto e ajuste o IP de acordo com o IP da nuvem:

```bash
API_URL_BACK=http://191.232.36.235:8080
```

4. **Execute o app em ambiente de desenvolvimento:**

```bash
npx expo start -c
```

## 📌 Observações

- O sistema de favoritos e histórico é sincronizado com backend e refletido no AsyncStorage.

- Os dados exibidos no mapa são baseados na latitude e longitude retornadas pela API.

- O app possui controle de sessão: se o usuário não estiver autenticado, será redirecionado para o login.

- As cidades disponiveis no banco de dados para pesquisa no momento são:
Cidades com dados climáticos disponíveis:
São Paulo
Curitiba
Porto Alegre
Florianópolis
Belo Horizonte
Rio de Janeiro
Campinas
Santos
Londrina
Maringá

## 👥 Integrantes

- Mariana Christina RM: 554773
- Gabriela Moguinho RM: 556143
- Henrique Maciel RM: 556480
