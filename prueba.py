# -*- coding: utf-8 -*-
__author__ = 'RicardoMoya'

from bs4 import BeautifulSoup
import requests

url = "http://dl.acm.org/citation.cfm?id=2846035&preflayout=flat"

# Realizamos la petición a la web
req = requests.get(url)
# print req
# Comprobamos que la petición nos devuelve un Status Code = 200
statusCode = req.status_code
if statusCode == 200:

    # Pasamos el contenido HTML de la web a un objeto BeautifulSoup()
    html = BeautifulSoup(req.text, 'lxml')

    # Obtenemos todos los divs donde estan las entradas
    entradas = html.find_all('div',{'class':'flatbody',})
    # print entradas
    # Recorremos todas las entradas para extraer el título, autor y fecha
    # abstract = entradas[0].find('p').getText()

    entradas = entradas[0].find_all('div')
    # abstract = html.body.p
    entradas = entradas[0].find_all('p')
    abstract = ""
    for parrafo in entradas:
        abstract = abstract + parrafo.getText()
    # for i,entrada in enumerate(entradas):
    # # for entrada in entradas:
    #     # print entrada
    #     # Con el método "getText()" no nos devuelve el HTML
    #     # titulo = entrada.find('span', {'class' : 'tituloPost'}).getText()
    #     # Sino llamamos al método "getText()" nos devuelve también el HTML
    #     # autor = entrada.find('span', {'class' : 'autor'})
    #     # fecha = entrada.find('span', {'class' : 'fecha'}).getText()

    #     # Imprimo el Título, Autor y Fecha de las entradas
    #     # print "%d - %s  |  %s  |  %s" %(i+1,titulo,autor,fecha)
    #     abstract = entrada.find('p')
    #     print abstract
    #     # abstract = entrada.find('p')
    #     # print abstract
    print abstract
else:
    print "Status Code %d" %statusCode