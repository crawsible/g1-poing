#!/usr/bin/env ruby

require 'webrick'

root = File.expand_path('./public')
server = WEBrick::HTTPServer.new(Port: 8080, DocumentRoot: root)
trap 'INT' do server.shutdown end

server.start
