#!/bin/sh
# Prepara solo los archivos públicos para Cloudflare Pages.
set -eu

rm -rf dist
mkdir -p dist
cp -R \
  index.html \
  servicios.html \
  proyectos.html \
  contacto.html \
  aviso-legal.html \
  404.html \
  robots.txt \
  assets \
  dist/
