
# BDM Skins Shop

BDM Skins Shop é um marketplace de skins para CS2. Ele permite aos administradores adicionar, editar e deletar skins, e aos usuários pesquisar e visualizar skins disponíveis para compra.

## Configurando o Projeto

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado (recomenda-se a versão 14 ou superior).
- **PostgreSQL**: Certifique-se de ter o PostgreSQL configurado e rodando.

### Configurando Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bdm_skins_db
```

Substitua `user`, `password`, `localhost`, `5432` e `bdm_skins_db` pelos detalhes da sua configuração de banco de dados.

### Instalando Dependências

Instale as dependências do projeto com o comando:

```bash
npm install
```

### Migrando o Banco de Dados

Para configurar o banco de dados e aplicar o schema, use o Prisma:

```bash
npx prisma migrate dev
```

Este comando criará as tabelas necessárias no banco de dados.

### Iniciando o Servidor

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

- **pages**: Contém as páginas principais do sistema, como a página de administração (`AdminPage`) e a loja.
- **components**: Contém componentes reutilizáveis, como botões e cartões de exibição de skins.
- **lib**: Configuração do Prisma e conexão com o banco de dados.
- **public**: Imagens e outros arquivos públicos.
- **prisma**: Arquivos de schema e migrações do banco de dados.

## API Endpoints

1. **/api/skinitem**: Endpoints para operações de CRUD de itens de skin.
2. **/api/skins**: Pesquisa de skins associadas a uma `weaponId`.
3. **/api/skinweapon**: Valida e retorna `skinWeaponId` para combinações de skin e arma.
4. **/api/wears**: Lista os tipos de wear disponíveis.

## Scripts Disponíveis

- `npm run dev`: Inicia o projeto em modo de desenvolvimento.
- `npm run build`: Cria o build otimizado para produção.
- `npm run start`: Inicia o servidor em modo de produção após o build.
- `npx prisma studio`: Abre o Prisma Studio para inspeção do banco de dados.
- `npx prisma migrate dev`: Aplica as migrações do banco de dados conforme o schema Prisma.

## Funcionalidades Principais

### Adicionar Skin

A interface de administrador permite ao usuário inserir os seguintes campos:

- **Weapon**: Seleciona a arma relacionada à skin.
- **Skin**: Seleciona a skin da arma.
- **Float**: Define o float value da skin e automaticamente determina o tipo de wear associado.
- **Price**: Define o preço da skin.
- **Image URL**: Link da imagem da skin.
- **Inspect URL**: Link de inspeção no Steam.

### Estrutura de Banco de Dados

O banco de dados é modelado com Prisma, com as principais tabelas e relacionamentos:

- **WeaponType**: Armazena tipos de armas (rifles, pistolas, etc.).
- **Weapon**: Armazena cada arma e está relacionada a `WeaponType`.
- **Skin**: Define cada skin disponível no sistema.
- **SkinWeapon**: Tabela associativa entre `Skin` e `Weapon`.
- **SkinItem**: Itens de skins específicos com preço, float e wear.

## Licença

Este projeto é licenciado sob a MIT License.
