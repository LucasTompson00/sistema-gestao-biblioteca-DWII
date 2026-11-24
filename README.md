# BiblioTech — Sistema de Gestão de Biblioteca

Projeto desenvolvido para a disciplina de **Desenvolvimento Web II (DWII)**. O BiblioTech é uma aplicação web para gerenciamento de uma biblioteca, permitindo administrar o catálogo de livros, autores, gêneros, exemplares físicos, usuários, empréstimos e devoluções.

A aplicação utiliza uma arquitetura separada: **React** no front-end, **Laravel** no back-end, uma API REST para a comunicação entre as partes e **PostgreSQL** para persistência dos dados.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura e estrutura do projeto](#arquitetura-e-estrutura-do-projeto)
- [Modelo de dados](#modelo-de-dados)
- [Perfis e permissões](#perfis-e-permissões)
- [Autenticação e segurança](#autenticação-e-segurança)
- [Integração com a Open Library](#integração-com-a-open-library)
- [Armazenamento de capas](#armazenamento-de-capas)
- [Instalação e execução local](#instalação-e-execução-local)
- [Endpoints principais](#endpoints-principais)
- [Comandos úteis](#comandos-úteis)
- [Solução de problemas](#solução-de-problemas)

## Funcionalidades

| Módulo | Funcionalidades |
|---|---|
| Autenticação | Cadastro de usuários, login, consulta e atualização do próprio perfil e logout |
| Controle de acesso | Permissões separadas para os perfis `usuario` e `bibliotecario` |
| Livros | Cadastro, consulta, edição e exclusão de livros |
| Autores | Cadastro, consulta, edição e exclusão de autores |
| Gêneros | Cadastro, consulta, edição e exclusão de gêneros literários |
| Exemplares | Gerenciamento das cópias físicas, com código e situação de disponibilidade |
| Empréstimos | Registro, consulta, alteração da previsão de devolução e exclusão conforme as regras do sistema |
| Devoluções | Registro da devolução e liberação do exemplar |
| API externa | Busca de informações de livros na Open Library pelo ISBN |
| Capas | Envio, visualização e download de capas de livros |
| Interface | Páginas React, formulários controlados, navegação e consumo da API por Axios |

## Tecnologias

### Back-end

| Tecnologia | Versão declarada/resolvida |
|---|---|
| PHP | 8.3 ou superior |
| Laravel | 13.31.0 (versão registrada no `composer.lock`) |
| Laravel Sanctum | 4.5.0 |
| PostgreSQL | Banco de dados relacional |
| Composer | Gerenciador de dependências PHP |

### Front-end

| Tecnologia | Versão registrada no `package-lock.json` |
|---|---|
| React | 19.3.0 |
| React DOM | 19.3.0 |
| Vite | 8.3.0 |
| React Router DOM | 7.18.4 |
| Axios | 1.21.1 |
| Lucide React | 1.48.0 |
| Node.js | 20.19.0 ou superior, ou 22.12.0 ou superior |
| npm | Instalado junto com o Node.js |

As dependências do Laravel são instaladas pelo Composer. As dependências do React são instaladas pelo npm; não é necessário instalar React, Vite, Axios ou Lucide React globalmente.

## Arquitetura e estrutura do projeto

O projeto possui duas aplicações independentes:

- **`biblioteca-api`**: aplicação Laravel responsável pelas rotas, autenticação, validação, regras de negócio e acesso ao banco de dados.
- **`biblioteca-front`**: aplicação React responsável pelas telas, formulários, navegação e interação com a API.

O front-end envia requisições HTTP para o back-end utilizando Axios. O Laravel valida e processa cada requisição, consulta ou altera os dados por meio do Eloquent ORM e retorna respostas JSON.

```text
sistema-gestao-biblioteca-DWII/
├── biblioteca-api/
│   ├── app/
│   │   ├── Exceptions/       # Exceções de regras de empréstimo
│   │   ├── Http/
│   │   │   ├── Controllers/  # Endpoints e operações da API
│   │   │   ├── Middleware/   # Controle de acesso por perfil
│   │   │   └── Requests/     # Validação dos dados recebidos
│   │   ├── Models/           # Entidades e relacionamentos Eloquent
│   │   ├── Providers/
│   │   └── Services/         # Regras de negócio dos empréstimos
│   ├── config/               # Configurações do Laravel
│   ├── database/
│   │   ├── migrations/       # Estrutura e alterações do banco
│   │   └── seeders/          # Dados iniciais, incluindo bibliotecário
│   ├── routes/api.php        # Rotas da API REST
│   └── .env.example          # Exemplo de configuração do back-end
├── biblioteca-front/
│   ├── src/
│   │   ├── api/              # Comunicação com o Laravel e Open Library
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── context/          # Contexto de autenticação
│   │   └── pages/             # Páginas da aplicação
│   └── package.json
└── README.md
```

### Fluxo de uma requisição

1. O usuário interage com uma tela ou formulário React.
2. O front-end envia os dados para a rota correspondente por meio do Axios.
3. O Laravel verifica a autenticação e as permissões exigidas pela rota.
4. O Form Request ou a validação do endpoint verifica os dados recebidos.
5. O Controller executa a operação e, quando necessário, utiliza uma Service para as regras de negócio.
6. Os Models Eloquent consultam ou atualizam o PostgreSQL.
7. O Laravel retorna uma resposta JSON e o React atualiza a interface.

## Modelo de dados

As principais entidades do sistema são:

| Entidade | Descrição |
|---|---|
| `usuarios` | Dados cadastrais, credenciais e perfil de acesso |
| `livros` | Informações bibliográficas, como título, ISBN, sinopse, capa e ano de publicação |
| `autores` | Autores associados às obras |
| `generos` | Gêneros literários |
| `exemplares` | Cópias físicas dos livros, com código e situação |
| `emprestimos` | Usuário, exemplar, datas e situação do empréstimo |

O projeto também possui as tabelas intermediárias `autor_livro` e `genero_livro`, utilizadas nos relacionamentos muitos-para-muitos.

### Principais relacionamentos

- Um livro possui vários exemplares; cada exemplar pertence a um livro.
- Um usuário pode possuir vários empréstimos; cada empréstimo pertence a um usuário.
- Um exemplar pode aparecer em diferentes empréstimos ao longo do tempo; cada empréstimo referencia um exemplar.
- Um livro pode possuir vários autores, e um autor pode estar associado a vários livros.
- Um livro pode possuir vários gêneros, e um gênero pode classificar vários livros.

As migrations definem e versionam a estrutura das tabelas. Os Models representam as entidades e declaram os relacionamentos utilizados pelo Eloquent ORM.

## Perfis e permissões

O sistema possui dois perfis autenticados:

### Usuário (`usuario`)

- Consultar o catálogo, livros, autores, gêneros e exemplares.
- Consultar e atualizar somente o próprio perfil.
- Consultar somente os próprios empréstimos.
- Registrar empréstimos somente para si.

### Bibliotecário (`bibliotecario`)

- Gerenciar livros, autores, gêneros e exemplares.
- Consultar empréstimos e usuários ativos.
- Registrar empréstimos para usuários cadastrados.
- Alterar a previsão de devolução.
- Registrar devoluções.
- Excluir empréstimos somente quando já estiverem devolvidos.
- Enviar ou substituir capas de livros.

O cadastro público cria exclusivamente usuários com perfil `usuario`. O bibliotecário inicial é criado pelo seeder do back-end usando os dados configurados no `.env`.

## Autenticação e segurança

A autenticação atual utiliza **Laravel Sanctum com tokens Bearer**:

1. O usuário informa e-mail e senha no login.
2. O back-end verifica se o usuário existe, está ativo e se a senha corresponde ao hash armazenado.
3. Em caso de sucesso, o Laravel Sanctum gera um token de acesso.
4. O front-end mantém o token no `localStorage` e o Axios o envia no cabeçalho `Authorization: Bearer` nas requisições protegidas.
5. No logout, o back-end revoga o token utilizado na sessão atual.

Outras medidas implementadas:

- **Hash de senhas:** o atributo `senha` do Model `Usuario` utiliza o cast `hashed` do Laravel. O campo de senha e o `remember_token` são ocultados na serialização do Model. O salt é gerenciado pelo mecanismo de hashing.
- **Autorização por perfil:** o middleware `VerificarPerfil` verifica se o usuário autenticado pode executar operações restritas ao perfil de bibliotecário.
- **Proteção de dados pessoais:** usuários comuns consultam somente seus próprios empréstimos e dados cadastrais.
- **Validação no back-end:** Form Requests e validações dos endpoints verificam formatos, obrigatoriedade, unicidade e existência de registros relacionados.
- **Prevenção contra SQL Injection:** as consultas realizadas com Eloquent e Query Builder utilizam vinculação de parâmetros, evitando concatenar entradas de usuários diretamente ao SQL.
- **Integridade dos empréstimos:** transações e bloqueios de registros são utilizados nas operações que alteram a disponibilidade dos exemplares.
- **Validação de capas:** o back-end aceita imagens JPG, JPEG, PNG ou WEBP de até 2 MB, somente nas operações autorizadas.

> **Observação sobre autenticação:** o código atual utiliza tokens Sanctum enviados no cabeçalho `Authorization`. Embora o projeto tenha configuração `SESSION_DRIVER=database`, o fluxo de login implementado não é baseado em cookie de sessão. A autenticação por cookie do Sanctum é uma modalidade diferente, com configuração própria de domínios stateful e proteção CSRF.

## Integração com a Open Library

O projeto utiliza a API pública da [Open Library](https://openlibrary.org/) para buscar informações de livros pelo ISBN.

No cadastro de um livro, o front-end consulta o endpoint de pesquisa da Open Library e utiliza os dados disponíveis para preencher o formulário. Entre os campos que podem ser retornados estão título, autores, ano de publicação, capa, primeira frase e assuntos relacionados.

A disponibilidade dessas informações depende do registro encontrado na Open Library. Por isso, os dados retornados podem ser revisados e complementados pelo bibliotecário antes de salvar o livro.

Arquivo responsável pela integração: `biblioteca-front/src/api/openLibrary.js`.

## Armazenamento de capas

As capas enviadas pelo bibliotecário são armazenadas pelo sistema de arquivos do Laravel no disco `public`, dentro de `storage/app/public`. O banco de dados armazena o caminho associado à capa, e não o conteúdo binário da imagem.

O comando `php artisan storage:link` cria o link simbólico `public/storage`, permitindo que os arquivos do disco público sejam acessados pelo navegador.

O armazenamento utilizado nesta configuração é local ao ambiente do back-end. Em instalações em máquinas diferentes, os arquivos enviados precisam existir no armazenamento daquela instalação. Para compartilhar arquivos entre diferentes servidores seria necessário configurar um serviço de armazenamento compartilhado.

## Instalação e execução local

As instruções abaixo consideram Windows com PowerShell. Os comandos equivalentes para Linux/macOS são apresentados quando necessário.

### 1. Pré-requisitos

Instale as ferramentas abaixo antes de iniciar:

| Ferramenta | Requisito | Download |
|---|---|---|
| Git | Versão atual | [git-scm.com](https://git-scm.com/downloads) |
| PHP | 8.3 ou superior | [windows.php.net](https://windows.php.net/download/) |
| Composer | Versão 2 | [getcomposer.org](https://getcomposer.org/download/) |
| Node.js | 20.19.0 ou superior, ou 22.12.0 ou superior | [nodejs.org](https://nodejs.org/en/download) |
| PostgreSQL | Instalação local ou banco remoto acessível | [postgresql.org](https://www.postgresql.org/download/) |

O npm é instalado junto com o Node.js.

### 2. Configurar o PHP no Windows

1. Extraia o PHP em uma pasta, por exemplo `C:\php`.
2. Copie `php.ini-development` e renomeie a cópia para `php.ini`.
3. Adicione a pasta que contém `php.exe` ao `Path` das variáveis de ambiente do Windows.
4. Abra o `php.ini` e confira se o diretório de extensões está configurado:

```ini
extension_dir = "ext"
```

5. Habilite as extensões necessárias. Se uma linha estiver comentada com `;`, remova o ponto e vírgula:

```ini
extension=curl
extension=fileinfo
extension=mbstring
extension=openssl
extension=pdo_pgsql
extension=zip
```

A extensão `pdo_pgsql` permite a conexão com PostgreSQL. A extensão `fileinfo` auxilia na validação dos arquivos de capa. As extensões `curl` e `zip` são utilizadas por ferramentas e operações de dependências.

6. Salve o arquivo, abra um novo terminal e verifique a instalação:

```powershell
php -v
php --ini
php -m
```

No resultado de `php -m`, confira principalmente `fileinfo`, `mbstring`, `openssl` e `pdo_pgsql`. O PHP também precisa disponibilizar as extensões padrão exigidas pelo Composer e pelo Laravel, como `ctype`, `dom`, `filter`, `hash`, `json`, `pcre`, `pdo`, `session`, `tokenizer` e `xml`.

### 3. Instalar o Composer

Baixe e execute o instalador do Composer. No Windows, selecione o `php.exe` instalado anteriormente:

[Instalador do Composer para Windows](https://getcomposer.org/Composer-Setup.exe)

Verifique a instalação:

```powershell
composer --version
```

### 4. Instalar o Node.js e o npm

Baixe uma versão compatível do Node.js e execute o instalador:

[Download do Node.js](https://nodejs.org/en/download)

Abra um novo terminal e verifique:

```powershell
node -v
npm -v
```

### 5. Preparar o PostgreSQL

Instale o PostgreSQL e crie um banco de dados vazio chamado `biblioteca`, utilizando o pgAdmin ou outra ferramenta de administração.

Exemplo de configuração para um banco local:

```text
Host: 127.0.0.1
Porta: 5432
Banco: biblioteca
Usuário: postgres
Senha: senha definida durante a instalação
```

Caso utilize um banco remoto, substitua os dados pelos valores fornecidos pelo serviço utilizado.

### 6. Clonar o repositório

Abra um terminal na pasta em que deseja armazenar o projeto e execute:

```powershell
git clone https://github.com/LucasTompson00/sistema-gestao-biblioteca-DWII.git
cd sistema-gestao-biblioteca-DWII
```

O primeiro comando baixa o repositório. O segundo entra na pasta criada pelo Git.

### 7. Configurar e iniciar o back-end

Entre na pasta do Laravel:

```powershell
cd biblioteca-api
```

Instale as dependências do PHP:

```powershell
composer install
```

Crie o arquivo local de configuração a partir do exemplo:

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Abra `biblioteca-api/.env` e configure a aplicação para utilizar PostgreSQL. Os valores abaixo são um exemplo para banco local; ajuste usuário, senha, host e banco conforme seu ambiente:

```env
APP_NAME=BiblioTech
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=biblioteca
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_do_postgres
DB_SSLMODE=prefer

SESSION_DRIVER=database
SESSION_LIFETIME=120

BIBLIOTECARIO_NOME="Bibliotecário"
BIBLIOTECARIO_EMAIL=bibliotecario@biblioteca.test
BIBLIOTECARIO_SENHA=defina_uma_senha_segura
```

**Importante:** confirme que `DB_CONNECTION` está definido como `pgsql`. Se o `.env.example` da sua cópia estiver com `sqlite` como padrão, substitua por `pgsql` no arquivo `.env` local.

Gere a chave da aplicação:

```powershell
php artisan key:generate
```

Crie as tabelas e cadastre o bibliotecário inicial:

```powershell
php artisan migrate --seed
```

Crie o link simbólico para as capas:

```powershell
php artisan storage:link
```

Inicie o servidor Laravel:

```powershell
php artisan serve --host=localhost --port=8000
```

A API ficará disponível em `http://localhost:8000`. Mantenha esse terminal aberto enquanto utilizar o sistema.

### 8. Configurar e iniciar o front-end

Abra um **segundo terminal** na pasta raiz do repositório e entre na pasta do React:

```powershell
cd biblioteca-front
```

Crie o arquivo `biblioteca-front/.env.local` com o endereço da API:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

O arquivo `.env.local` mantém a configuração específica da máquina separada do código versionado.

Instale as dependências:

```powershell
npm install
```

Inicie o servidor do Vite:

```powershell
npm run dev
```

O front-end ficará disponível, por padrão, em `http://localhost:5173`. Mantenha os terminais do Laravel e do Vite abertos simultaneamente.

A configuração CORS do back-end permite a origem local `http://localhost:5173`. Caso altere a porta ou o endereço do front-end, ajuste também `biblioteca-api/config/cors.php`.

### 9. Acessar o sistema

Acesse no navegador:

```text
http://localhost:5173
```

O bibliotecário inicial é criado pelo `BibliotecarioSeeder` durante `php artisan migrate --seed`. Os dados são definidos pelas variáveis `BIBLIOTECARIO_NOME`, `BIBLIOTECARIO_EMAIL` e `BIBLIOTECARIO_SENHA` no `.env` do back-end.

Usuários comuns podem criar suas contas pela tela de cadastro.

## Endpoints principais

As rotas estão em `biblioteca-api/routes/api.php` e utilizam o prefixo `/api/v1`.

As rotas de login e cadastro são públicas. As demais rotas exigem autenticação com token Sanctum. As operações administrativas também exigem o perfil `bibliotecario`.

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/v1/register` | Público | Cadastro de usuário comum |
| `POST` | `/api/v1/login` | Público | Login e emissão de token |
| `GET` | `/api/v1/me` | Autenticado | Consulta o próprio perfil |
| `PUT` | `/api/v1/me` | Autenticado | Atualiza o próprio perfil |
| `POST` | `/api/v1/logout` | Autenticado | Revoga o token atual |
| `GET` | `/api/v1/livros` | Autenticado | Lista os livros |
| `GET` | `/api/v1/livros/{livro}` | Autenticado | Consulta um livro |
| `POST` | `/api/v1/livros` | Bibliotecário | Cadastra um livro |
| `PUT/PATCH` | `/api/v1/livros/{livro}` | Bibliotecário | Atualiza um livro |
| `DELETE` | `/api/v1/livros/{livro}` | Bibliotecário | Exclui um livro, respeitando as regras de integridade |
| `GET` | `/api/v1/autores` | Autenticado | Lista autores |
| `GET` | `/api/v1/generos` | Autenticado | Lista gêneros |
| `GET` | `/api/v1/exemplares` | Autenticado | Lista exemplares |
| `GET` | `/api/v1/emprestimos` | Autenticado | Lista empréstimos permitidos para o perfil |
| `POST` | `/api/v1/emprestimos` | Autenticado | Registra um empréstimo conforme o perfil |
| `PATCH` | `/api/v1/emprestimos/{emprestimo}/devolucao` | Bibliotecário | Registra uma devolução |
| `GET` | `/api/v1/usuarios` | Bibliotecário | Lista usuários ativos |
| `GET` | `/api/v1/livros/{livro}/capa/download` | Autenticado | Faz o download da capa armazenada |

Autores, gêneros e exemplares também possuem rotas de consulta individual e operações de gerenciamento restritas ao bibliotecário. Empréstimos possuem consulta individual e operações administrativas de atualização e exclusão, conforme as regras do sistema.

## Comandos úteis

Execute os comandos do back-end dentro de `biblioteca-api`:

| Comando | Finalidade |
|---|---|
| `php artisan migrate:status` | Mostra o estado das migrations |
| `php artisan migrate` | Executa migrations pendentes |
| `php artisan route:list --path=api/v1` | Lista as rotas da API |
| `php artisan storage:link` | Cria o link público do armazenamento |
| `php artisan test` | Executa os testes automatizados do Laravel |

Execute os comandos do front-end dentro de `biblioteca-front`:

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run lint` | Executa a verificação estática com ESLint |
| `npm run build` | Gera a versão de produção do front-end |

## Solução de problemas

| Problema | Possível solução |
|---|---|
| `php` não é reconhecido | Confira se a pasta que contém `php.exe` está no `Path` e abra um novo terminal. |
| `composer` não é reconhecido | Verifique a instalação do Composer e a variável `Path`. |
| `could not find driver` | Habilite `pdo_pgsql` no `php.ini` e reinicie o terminal. |
| Erro de conexão com PostgreSQL | Confira `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD`. |
| Erro 404 nas requisições | Confirme se `VITE_API_URL` termina com `/api/v1` e se o Laravel está em execução. |
| Erro de CORS | Confirme se o front-end está em `http://localhost:5173` e se essa origem está em `config/cors.php`. |
| Bibliotecário não é criado | Confira se `BIBLIOTECARIO_SENHA` está preenchida no `.env` e execute `php artisan db:seed --class=BibliotecarioSeeder`. |
| Capas não aparecem | Execute `php artisan storage:link` e confira se os arquivos estão em `storage/app/public`. |
| Vite não inicia | Confira `node -v` e utilize uma versão compatível com o Vite 8. |

## Desenvolvimento

Projeto desenvolvido como atividade da disciplina de **Desenvolvimento Web II (DWII)**, com o objetivo de aplicar os conceitos de desenvolvimento web, arquitetura cliente-servidor, APIs REST, persistência relacional, autenticação, controle de acesso e integração com serviços externos.
