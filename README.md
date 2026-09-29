# Sistema de Gestão de Biblioteca: Projeto Semestral

Código de referência do projeto semestral de **Desenvolvimento Web II (DWII)**.

O projeto consiste em um sistema web para gerenciamento de uma biblioteca, utilizando uma arquitetura separada entre **Back-end** e **Front-end**.

## Tecnologias utilizadas

* **PHP 8.5.10**
* **Laravel**
* **PostgreSQL**
* **React**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**
* **Git / GitHub**

### Versão do PHP

```text
PHP 8.5.10 (cli)
Built: Aug 25 2026 21:23:48
NTS Visual C++ 2022 x64
Zend Engine v4.5.10
Zend OPcache v8.5.10
```

## Estrutura

```text
biblioteca-api/    # Back-end Laravel (API REST)
biblioteca-front/  # Front-end React (Vite)
```

## O que já está implementado

| Módulo             | Descrição                                    |
| ------------------ | -------------------------------------------- |
| Migrations         | Estrutura do banco de dados                  |
| Models             | Representação das entidades                  |
| Relacionamentos    | Relacionamento entre as entidades do sistema |
| Autenticação       | Login e cadastro de usuários                 |
| API REST           | Comunicação entre Front-end e Back-end       |
| Livros             | Gerenciamento de livros                      |
| Autores            | Gerenciamento de autores                     |
| Gêneros            | Gerenciamento de gêneros                     |
| Exemplares         | Gerenciamento de exemplares                  |
| Empréstimos        | Gerenciamento de empréstimos                 |
| Interface de Login | Tela de autenticação desenvolvida em React   |

## Banco de Dados

O projeto utiliza **PostgreSQL** para armazenamento dos dados.

Entre as principais entidades estão:

* Usuários
* Autores
* Gêneros
* Livros
* Exemplares
* Empréstimos

## Execução do projeto

### Back-end

Entre na pasta:

```bash
cd biblioteca-api
```

Instale as dependências:

```bash
composer install
```

Configure o arquivo `.env` e execute:

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

O Back-end será executado, por padrão, em:

```text
http://localhost:8000
```

### Front-end

Entre na pasta:

```bash
cd biblioteca-front
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O Front-end será executado, por padrão, em:

```text
http://localhost:5173
```

## Desenvolvimento

Projeto desenvolvido como parte das atividades da disciplina de **Desenvolvimento Web II**.

O objetivo é aplicar os conhecimentos de desenvolvimento de aplicações web utilizando **Laravel, React, Vite, PostgreSQL e PHP**.
