fs = require('fs')
path = require('path')

expect = require('chai').expect
FrontMatter = require('front-matter')
rimraf = require('rimraf')

Mod = require('../')

describe('Caesium Less', function(){
  fileObject = {
    descriptor: "/example.less",
    frontMatter: {}
  }

  it('should create paths', function(){
    paths = Mod.createRoute(fileObject)
    fileObject.paths = paths

    expect(paths.path).to.equal('/example.css')
    expect(paths.targetFile).to.equal('/example.css')
    expect(paths.folder).to.equal('')
  })

  it('should parse a file', function(done){
    fs.readFile(path.join(__dirname, 'example.less'), function(err, data){
      content = FrontMatter(data.toString())
      fileObject.rawBody = content.body
      Mod.parseFile(fileObject, {destination: __dirname}).then(function(){
        fs.stat(path.join(__dirname, 'example.css'), function(err, stats){
          expect(err).to.equal(null)
          rimraf(path.join(__dirname, 'example.css'), {glob: false}, function(err){
            done()
          })
        })
      }).catch(function(err){
        throw err
      })
    })
  })
})
