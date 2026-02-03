# Currency Converter App

Aplicação web para conversão de moedas em tempo real, com seleção de usuário e histórico de transações. Interface construída com Vue 3 e Vite, consumindo uma API REST.

## Funcionalidades
- Seleção de usuário cadastrado
- Conversão entre moedas (BRL, USD, EUR, JPY)
- Exibição do resultado da conversão
- Histórico de transações com expansão/retração
- Estados de carregamento e mensagens de erro/sucesso

## Tecnologias
- Vue 3
- Vite
- Tailwind CSS
- Axios

## Requisitos
- Node.js 18+ (recomendado)
- API backend em execução (ver configuração)

## Configuração
1) Instale as dependências:

```bash
npm install
```

2) Configure a URL da API no arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

> Ajuste para o endereço onde a API estiver rodando.

## Como rodar
- Ambiente de desenvolvimento:

```bash
npm run dev
```

- Build de produção:

```bash
npm run build
```

- Pré-visualização do build:

```bash
npm run preview
```

## Estrutura do projeto
- `src/App.vue`: fluxo principal (seleção de usuário, conversão e histórico)
- `src/components/`: componentes de UI
- `src/services/api.js`: cliente HTTP e chamadas à API
- `src/style.css`: estilos globais

## Endpoints esperados
A aplicação espera que a API forneça os seguintes endpoints:
- `GET /api/v1/users`: lista de usuários
- `POST /api/v1/convert`: conversão de moedas
- `GET /api/v1/transactions`: histórico por usuário (query `user_id`)

## Licença
Projeto para fins de estudo.
