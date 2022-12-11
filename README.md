# Treehole Frontend Next

## Build

This project use pnpm as package manager. If you haven't install Node.js yet, you can download and install it from https://nodejs.org/

Once you install Node.js, you can run ```npm install pnpm -g``` to install pnpm.

To build this project, you should run

```shell
pnpm build
```

which will execute the script ```scripts.build``` written in ```package.json```.

The output files will be generated in ```/dist``` folder. If you need to review the bundled size, you can check ```/dist/report.html```.

### Docker

You can also build this project with docker. To build the image, you can create a `docker-compose.yml` file like this:

```yaml
services:
  treehole-frontend-next:
    image: dest1n1/treehole-frontend-next:dev
    container_name: treehole-frontend-next
    environment:
      - VITE_BACKEND_URL=${BACKEND_URL}
      - VITE_AUTH_URL=${AUTH_URL}
      - VITE_AUTH_BASE_URL=${AUTH_BASE_URL}
      - VITE_COOKIE_DOMAIN=${COOKIE_DOMAIN}
    ports:
      - 8080:80
```

where `${BACKEND_URL}`, `${AUTH_URL}`, `${AUTH_BASE_URL}` and `${COOKIE_DOMAIN}` are the environment variables you want to set. You can either set them in the `docker-compose.yml` file or set them in the environment.

The `BACKEND_URL` and `AUTH_URL` are respectively the url of the treehole backend and the auth backend. The `AUTH_BASE_URL` the url of the auth frontend. The `COOKIE_DOMAIN` should be the shared domain of the auth frontend and the treehole frontend.

For example, the `.env` file for the treehole frontend is like this:

```shell
BACKEND_URL=https://www.fduhole.com/api/
AUTH_URL=https://auth.fduhole.com/api/
AUTH_BASE_URL=https://auth.fduhole.com/
COOKIE_DOMAIN=.fduhole.com
```

After you create the `docker-compose.yml` file and set the environment variables, you can run

```shell
docker-compose up -d
```

to start the container.

## Development

### Run

You can run
```shell
pnpm dev
```
to launch the dev server.
