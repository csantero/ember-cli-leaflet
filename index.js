var path = require('path');
var fs = require('fs');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

function EmberCLILeaflet(project) {
  this.project = project;
  this.name = 'Leaflet for Ember CLI';
}

EmberCLILeaflet.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'ember-cli-leaflet', name);
  
  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLILeaflet.prototype.included = function included(app) {
  app.import('vendor/leaflet/dist/leaflet-src.js', {
    exports: {
      'L': 'default'
    }
  });

  app.import('vendor/leaflet/dist/leaflet.css');
};

EmberCLILeaflet.prototype.postprocessTree = function postprocessTree(type, workingTree) {
  if (type === 'all') {
    var treePath = path.join('node_modules', 'ember-cli-leaflet', 'vendor', 'leaflet', 'dist');
    var staticFiles = pickFiles(unwatchedTree(treePath), {
      srcDir: 'images',
      files: ['*.png'],
      destDir: '/assets/images'
    });

    return mergeTrees([workingTree, staticFiles]);
  } else {
    return workingTree;
  }
};

module.exports = EmberCLILeaflet;
