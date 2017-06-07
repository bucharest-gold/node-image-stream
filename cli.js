#!/usr/bin/env node

'use strict';

const fs = require('fs');
const _ = require('underscore');
const semver = require('semver');
const cli = require('cli');
const options = cli.parse({
  file: ['f', 'A file to process', 'file'],
  image: ['i', 'The image name', 'string']
});

const transform = (name, data) => JSON.stringify(imageStream(name, JSON.parse(data)), null, 2);

if (!options.image) {
  cli.fatal('You must supply an image name');
}

if (options.file) {
  cli.output(transform(options.image, fs.readFileSync(options.file)));
} else {
  cli.withStdin(function (data) {
    this.output(transform(options.image, data));
  });
}

function imageStream (name, releases) {
  const current = _.reduce(_.keys(releases), (prev, cur) => Math.max(prev, cur));

  const shortName = name.split('/')[1];
  if (!shortName) cli.fatal('Image name, with repository prefix is required');
  const data = {
    kind: 'ImageStream',
    apiVersion: 'v1',
    metadata: {
      name: shortName,
      creationTimestamp: `${new Date().toISOString()}`
    },
    spec: {
      tags: []
    }
  };

  _.each(releases, (r) => {
    const version = semver.clean(r.version);
    const { major } = majorMinor(version);
    const versionName = `${major}.x`;

    data.spec.tags.push(dockerImageTag(name, versionName));
    data.spec.tags.push(imageStreamTag(versionName, versionName));

    // if this node version is lts, tag it as such
    if (r.lts) {
      data.spec.tags.push(imageStreamTag('lts', versionName));
      data.spec.tags.push(imageStreamTag(r.lts, versionName));
    }

    // if this is the current/latest version of node, tag it so
    if (major === current) {
      data.spec.tags.push(imageStreamTag('latest', versionName));
    }
  });
  return data;
}

function dockerImageTag (name, version) {
  return {
    name: version,
    annotations: annotationsFor(version),
    from: {
      kind: 'DockerImage',
      name: `${name}:${version}`
    }
  };
}

function imageStreamTag (name, from) {
  return {
    name,
    annotations: annotationsFor(from),
    from: {
      kind: 'ImageStreamTag',
      name: from
    }
  };
}

function annotationsFor (version) {
  return {
    description: 'Build and run Node.js applications',
    iconClass: 'icon-nodejs',
    tags: `builder, node, nodejs, nodejs-${version}`,
    supports: `nodejs:${version}, nodejs`,
    sampleRepo: 'https://github.com/bucharest-gold/s2i-nodejs.git'
  };
}

function majorMinor (version) {
  return {
    major: semver.major(version),
    minor: version.split('.').slice(0, 2).join('.')
  };
}
