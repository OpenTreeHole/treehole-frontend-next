# Treehole Frontend Next

## Build

This project use yarn as package manager. If you haven't install Node.js yet, you can download and install it from https://nodejs.org/

Once you install Node.js, you can run ```npm install yarn -g``` to install yarn.

To build this project, you should run

```shell
yarn build
```

which will execute the script ```scripts.build``` written in ```package.json```.

The output files will be generated in ```/dist``` folder. If you need to review the bundled size, you can check ```/dist/report.html```.

## Development

### Run

You can run
```shell
yarn dev
```
to launch the dev server.
