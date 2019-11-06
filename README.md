# DEPRECATED

This is no longer supported.

This is a simple utility that takes JSON input from 
[`node-metadata`](https://npmjs.com/package/node-metadata), and converts it
to `ImageStream` JSON for OpenShift.

See the [OpenShift documentation](https://docs.openshift.com/enterprise/3.2/dev_guide/managing_images.html#importing-tag-and-image-metadata)
for more information about using the output from this tool to customize your Node.js runtime on OpenShift/Kubernetes.

## Usage
You'll need [`node-metadata`](https://npmjs.com/package/node-metadata) and this package installed.
Then you can just pipe the output from `node-metadata` into `node-image-stream` to generate JSON
suitable for import into OpenShift.

```sh
$ npm install -g node-image-stream

$ node-image-stream --help
Usage:
  node-image-stream [OPTIONS] [ARGS]

Options:
  -f, --file FILE        A file to process
  -i, --image STRING     The image name
  -h, --help             Display help and usage details

$ npm install -g node-metadata

$ node-metadata --help

  Usage: node-metadata [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -i --images    Indicates what images to show.

$ node-metadata -i 6 8 | node-image-stream -i bucharestgold/centos7-s2i-nodejs
```

This will print to `STDOUT`. You can redirect to a file if you want:

```sh
$ node-metadata -i 6 8 | node-image-stream -i bucharestgold/centos7-s2i-nodejs > image-streams.json
```

Or you can read input from a file.

```sh
$ node-image-stream -i bucharestgold/centos7-s2i-nodejs -f ../centos7-s2i-nodejs/releases.json
```

The output will look something like this. Note that the image name provided on the command line should
be resolvable to a docker image in a registry accessible to OpenShift.

```json
{
  "kind": "ImageStream",
  "apiVersion": "v1",
  "metadata": {
    "name": "bucharestgold/centos7-s2i-nodejs",
    "creationTimestamp": "2017-06-06T14:56:45.496Z"
  },
  "spec": {
    "tags": [
      {
        "name": "6.x",
        "annotations": {
          "description": "Build and run Node.js applications",
          "iconClass": "icon-nodejs",
          "tags": "builder, node, nodejs, nodejs-6.x",
          "supports": "nodejs:6.x, nodejs",
          "sampleRepo": "https://github.com/bucharest-gold/s2i-nodejs.git"
        },
        "from": {
          "kind": "DockerImage",
          "name": "bucharestgold/centos7-s2i-nodejs:6.x"
        }
      },
      {
        "name": "6.x",
        "annotations": {
          "description": "Build and run Node.js applications",
          "iconClass": "icon-nodejs",
          "tags": "builder, node, nodejs, nodejs-6.x",
          "supports": "nodejs:6.x, nodejs",
          "sampleRepo": "https://github.com/bucharest-gold/s2i-nodejs.git"
        },
        "from": {
          "kind": "ImageStreamTag",
          "name": "6.x"
        }
      },
      {
        "name": "lts",
        "annotations": {
          "description": "Build and run Node.js applications",
          "iconClass": "icon-nodejs",
          "tags": "builder, node, nodejs, nodejs-6.x",
          "supports": "nodejs:6.x, nodejs",
          "sampleRepo": "https://github.com/bucharest-gold/s2i-nodejs.git"
        },
        "from": {
          "kind": "ImageStreamTag",
          "name": "6.x"
        }
      },
      {
        "name": "Boron",
        "annotations": {
          "description": "Build and run Node.js applications",
          "iconClass": "icon-nodejs",
          "tags": "builder, node, nodejs, nodejs-6.x",
          "supports": "nodejs:6.x, nodejs",
          "sampleRepo": "https://github.com/bucharest-gold/s2i-nodejs.git"
        },
        "from": {
          "kind": "ImageStreamTag",
          "name": "6.x"
        }
      },
      {
        "name": "8.x",
        "annotations": {
          "description": "Build and run Node.js applications",
          "iconClass": "icon-nodejs",
          "tags": "builder, node, nodejs, nodejs-8.x",
          "supports": "nodejs:8.x, nodejs",
          "sampleRepo": "https://github.com/bucharest-gold/s2i-nodejs.git"
        },
        "from": {
          "kind": "DockerImage",
          "name": "bucharestgold/centos7-s2i-nodejs:8.x"
        }
      },
      {
        "name": "8.x",
        "annotations": {
          "description": "Build and run Node.js applications",
          "iconClass": "icon-nodejs",
          "tags": "builder, node, nodejs, nodejs-8.x",
          "supports": "nodejs:8.x, nodejs",
          "sampleRepo": "https://github.com/bucharest-gold/s2i-nodejs.git"
        },
        "from": {
          "kind": "ImageStreamTag",
          "name": "8.x"
        }
      }
    ]
  }
}
```