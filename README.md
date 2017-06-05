## Description

This is a simple utility that takes JSON input from 
[`node-metadata`](https://npmjs.com/package/node-metadata), and converts it
to `ImageStream` JSON for OpenShift.

See: https://docs.openshift.com/enterprise/3.2/dev_guide/managing_images.html#importing-tag-and-image-metadata

## Usage

```sh
npm install -g node-metadata
node-metadata -i 4 5 6 7 8 | node-image-stream -i bucharestgold/centos7-s2i-nodejs
```