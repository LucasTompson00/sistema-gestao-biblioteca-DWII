# Sistema de Gestão de Biblioteca: Projeto Semestral

Projeto desenvolvido como parte da disciplina de **Desenvolvimento Web II (DWII)**. A aplicação permite gerenciar livros, autores, gêneros, exemplares físicos, usuários e empréstimos.

O sistema utiliza uma arquitetura separada, com **Laravel (API REST)** no back-end, **React** no front-end e **PostgreSQL** como banco de dados.

## Estrutura

```text
sistema-gestao-biblioteca-DWII/
├── biblioteca-api/       # Back-end Laravel (API REST)
├── biblioteca-front/     # Front-end React (Vite)
└── README.md
```

## O que já está implementado

| Módulo | Descrição |
|---|---|
| Migrations e Models | Estrutura do banco de dados e representação das entidades com Eloquent ORM |
| Relacionamentos | Relações entre usuários, livros, autores, gêneros, exemplares e empréstimos |
| Autenticação | Cadastro, login e logout utilizando Laravel Sanctum |
| Controle de acesso | Permissões para os perfis de usuário e bibliotecário |
| Livros | Cadastro, consulta, atualização e exclusão de livros |
| Autores e gêneros | Gerenciamento de autores e gêneros literários |
| Exemplares | Gerenciamento dos exemplares físicos dos livros |
| Empréstimos | Registro, consulta e gerenciamento de empréstimos |
| Devoluções | Registro da devolução de exemplares |
| API pública | Consulta de informações de livros por ISBN utilizando Open Library |
| Capas | Upload, visualização e download das capas dos livros |
| Front-end | Interface React com formulários, eventos e consumo da API utilizando Axios |

## Tecnologias utilizadas

- PHP 8.3 ou superior
- Laravel 13.31.0
- Laravel Sanctum 4.5.0
- PostgreSQL
- React 19.3.0
- Vite 8.3.0
- React Router DOM 7.18.4
- Axios 1.21.1
- Lucide React 1.48.0
- Node.js e npm
- Composer
- Git e GitHub

## Como rodar localmente

### Pré-requisitos

Antes de executar o projeto, instale as ferramentas abaixo:

| Ferramenta | Requisito | Download |
|---|---|---|
| Git | Versão atual | https://git-scm.com/downloads |
| PHP | 8.3 ou superior | https://windows.php.net/download/ |
| Composer | Versão 2 | https://getcomposer.org/download/ |
| Node.js | 20.19.0 ou superior, ou 22.12.0 ou superior | https://nodejs.org/en/download |
| PostgreSQL | Banco de dados local ou remoto | https://www.postgresql.org/download/ |

O npm é instalado junto com o Node.js. Não é necessário instalar Laravel, React, Axios ou Lucide React separadamente: essas dependências serão instaladas pelos comandos do Composer e do npm.

### Configuração do PHP no Windows

Após instalar o PHP:

1. Extraia os arquivos do PHP em uma pasta, por exemplo `C:\php`.
2. Na pasta do PHP, faça uma cópia de `php.ini-development` e renomeie a cópia para `php.ini`.
3. Adicione a pasta que contém `php.exe` ao `Path` das variáveis de ambiente do Windows.
4. Abra o `php.ini` e confira se o diretório das extensões está configurado:

```ini
extension_dir = "ext"
```

5. Habilite as extensões necessárias para o projeto. Se alguma linha estiver comentada com `;`, remova o ponto e vírgula:

```ini
extension=curl
extension=fileinfo
extension=mbstring
extension=openssl
extension=pdo_pgsql
extension=zip
```

A extensão `pdo_pgsql` permite a conexão com o PostgreSQL. A extensão `fileinfo` é utilizada na validação dos arquivos de capa. As extensões `curl` e `zip` também são recomendadas para operações de rede e instalação de dependências.

6. Salve o arquivo, feche o terminal e abra-o novamente. Verifique a instalação e as extensões carregadas:

```powershell
php -v
php --ini
php -m
```

No resultado de `php -m`, confira principalmente se aparecem `fileinfo`, `mbstring`, `openssl` e `pdo_pgsql`. O PHP também precisa disponibilizar as extensões padrão exigidas pelo Composer e pelo Laravel, como `ctype`, `dom`, `filter`, `hash`, `json`, `pcre`, `pdo`, `session`, `tokenizer` e `xml`.

### Instalação do Composer

Baixe e execute o instalador do Composer. Durante a instalação no Windows, selecione o `php.exe` instalado anteriormente:

https://getcomposer.org/Composer-Setup.exe

Verifique se a instalação foi concluída:

```powershell
composer --version
```

### Instalação do Node.js e npm

Baixe uma versão compatível do Node.js pelo site oficial e execute o instalador. O npm será instalado junto com o Node.js:

https://nodejs.org/en/download

Depois da instalação, abra um novo terminal e confira:

```powershell
node -v
npm -v
```

O Vite 8 utilizado pelo projeto requer Node.js 20.19.0 ou superior na linha 20, ou 22.12.0 ou superior.

### Instalação do PostgreSQL

Baixe o PostgreSQL pelo site oficial:

https://www.postgresql.org/download/

Durante a instalação, defina uma senha para o usuário administrador `postgres`. Pelo pgAdmin, ou por outra ferramenta de administração do PostgreSQL, crie um banco de dados vazio chamado `biblioteca`.

Para uma instalação local, a conexão normalmente utiliza:

```text
Host: 127.0.0.1
Porta: 5432
Banco: biblioteca
Usuário: postgres
Senha: senha definida durante a instalação
```

Também é possível utilizar um banco PostgreSQL remoto, substituindo os dados de conexão pelos fornecidos pelo serviço utilizado.

### Clonar o repositório

Abra o terminal na pasta em que deseja armazenar o projeto e execute:

```powershell
git clone https://github.com/LucasTompson00/sistema-gestao-biblioteca-DWII.git
cd sistema-gestao-biblioteca-DWII
```

### Back-end

Entre na pasta do back-end:

```powershell
cd biblioteca-api
```

Instale as dependências do Laravel:

```powershell
composer install
```

Crie o arquivo `.env` a partir do exemplo:

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Abra o `.env` e configure a conexão com o PostgreSQL. Para uma instalação local, utilize os dados correspondentes ao banco criado na etapa anterior:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=biblioteca
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_do_postgres
DB_SSLMODE=prefer
```

Configure também os dados do bibliotecário inicial. A senha deve ser definida antes de executar o seeder:

```env
BIBLIOTECARIO_NOME="Bibliotecário"
BIBLIOTECARIO_EMAIL=bibliotecario@biblioteca.test
BIBLIOTECARIO_SENHA=sua_senha
```

Gere a chave da aplicação:

```powershell
php artisan key:generate
```

Crie as tabelas e cadastre o bibliotecário:

```powershell
php artisan migrate --seed
```

Configure o armazenamento público das capas:

```powershell
php artisan storage:link
```

Inicie o servidor Laravel:

```powershell
php artisan serve
```

O back-end ficará disponível, por padrão, em:

```text
http://127.0.0.1:8000
```

Mantenha esse terminal aberto enquanto utilizar o sistema.

### Front-end

Abra um **segundo terminal** na pasta raiz do repositório e entre na pasta do front-end:

```powershell
cd biblioteca-front
```

Crie um arquivo `.env` na raiz de `biblioteca-front` com a URL da API:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Instale as dependências:

```powershell
npm install
```

Esse comando instala React, React Router DOM, Axios, Lucide React, Vite e as demais dependências declaradas no projeto.

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O front-end ficará disponível, por padrão, em:

```text
http://localhost:5173
```

Mantenha os terminais do Laravel e do Vite abertos simultaneamente para utilizar o sistema. O CORS do back-end já permite a origem local `http://localhost:5173`.

## Usuário de teste

O usuário bibliotecário é criado automaticamente pelo seeder durante a execução de `php artisan migrate --seed`.

| Campo | Valor |
|---|---|
| E-mail padrão | `bibliotecario@biblioteca.test` |
| Senha | Definida em `BIBLIOTECARIO_SENHA` no `.env` do back-end |
| Perfil | `bibliotecario` |

Usuários comuns podem realizar o cadastro pela interface do sistema.

## Endpoints principais da API

As rotas estão definidas em `biblioteca-api/routes/api.php` e utilizam o prefixo `/api/v1`. As rotas de login e cadastro são públicas; as demais exigem autenticação com token Sanctum.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/v1/register` | Cadastra um usuário comum |
| POST | `/api/v1/login` | Autentica e retorna um token Sanctum |
| GET | `/api/v1/me` | Retorna os dados do usuário autenticado |
| GET | `/api/v1/livros` | Lista os livros |
| POST | `/api/v1/livros` | Cadastra um livro (bibliotecário) |
| GET | `/api/v1/autores` | Lista os autores |
| GET | `/api/v1/generos` | Lista os gêneros |
| GET | `/api/v1/exemplares` | Lista os exemplares |
| POST | `/api/v1/emprestimos` | Registra um empréstimo |
| PATCH | `/api/v1/emprestimos/{emprestimo}/devolucao` | Registra uma devolução (bibliotecário) |
| GET | `/api/v1/usuarios` | Lista usuários (bibliotecário) |
| GET | `/api/v1/livros/{livro}/capa/download` | Realiza o download da capa |

Autores, gêneros, exemplares, livros e empréstimos também possuem rotas de consulta individual e, conforme o perfil, atualização e exclusão.

## Se algo der errado

- `php` não é reconhecido: confira se a pasta que contém `php.exe` foi adicionada ao `Path` e abra um novo terminal.
- `composer` não é reconhecido: verifique a instalação do Composer e se o caminho está no `Path`.
- `could not find driver`: habilite `pdo_pgsql` no `php.ini` e abra novamente o terminal.
- Erro de conexão com PostgreSQL: confira host, porta, banco, usuário e senha configurados no `.env`.
- Erro 404 nas requisições: confira se `VITE_API_URL` termina com `/api/v1`.
- Erro de CORS: confira se o front-end está utilizando `http://localhost:5173`.
- Bibliotecário não é criado: confira se `BIBLIOTECARIO_SENHA` está preenchida no `.env` do back-end.
- Capas não aparecem: execute `php artisan storage:link` na pasta `biblioteca-api`.
- Vite não inicia: confira a versão do Node.js com `node -v`.

## Desenvolvimento

Projeto desenvolvido como parte das atividades da disciplina de **Desenvolvimento Web II (DWII)**, com o objetivo de aplicar conhecimentos de desenvolvimento de aplicações web utilizando Laravel, React, Vite e PostgreSQL.
