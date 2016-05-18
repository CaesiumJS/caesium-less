fs = require('fs')
less = require('less')
mkdirp = require('mkdirp')
path = require('path')
Promise = require('bluebird')

module.exports = {
  fileTypes: [
    '.less'
  ],
  parseWeight: 5,
  displayName: 'Less',

  createRoute: function(fileObject){
    if(fileObject.frontMatter.path){
      route = fileObject.frontMatter.path
    }else{
      route = fileObject.descriptor.replace('.less', '.css')
    }
    target = route

    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      path: route,
      targetFile: target,
      folder: folder
    }
  },

  getComponent: function(){
    return null
  },

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject){
      less.render(fileObject.rawBody, function(err, output){
        if(err){ reject(err) }

        fileObject.body = output.css
        mkdirp(path.join(options.destination, fileObject.paths.folder), function(err){
          if(err){ reject(err) }
          fs.open(path.join(options.destination, fileObject.paths.targetFile), 'w', function(err, fd){
            if(err){ reject(err) }
            fs.writeFile(fd, fileObject.body, {}, function(err){
              if(err){ reject(err) }
              fs.close(fd, function(err){
                if(err){ reject(err) }
                resolve()
              })
            })
          })
        })
      })
    })
  }
}
