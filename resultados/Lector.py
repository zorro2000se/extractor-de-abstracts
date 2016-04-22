# -*- coding: utf-8 -*-

import csv

from bs4 import BeautifulSoup
import requests

import bibtexparser
from bibtexparser.bparser import BibTexParser
from bibtexparser.customization import homogeneize_latex_encoding

import os
# from RISparser import readris
from pprint import pprint

import xlrd
import xlwt
from xlwt import Workbook, easyxf


def read_acm():
	with open('acm_final.csv') as csvfile:
		reader = csv.DictReader(csvfile)
		new_rows = []
		for row in reader:
			author = row["author"]
			title = row["title"]
			source = "ACM"
			url = "http://dl.acm.org/citation.cfm?id=" + row["id"] + "&preflayout=flat"
			abstract = row["abstract"]
			new_row = [author, title, source, url, abstract]
			new_rows.append(new_row)
			# print new_row
			# print "\n\n"
	return new_rows



def read_springer():
	with open('Springer_results.csv') as csvfile:
		reader = csv.DictReader(csvfile)
		new_rows = []
		for row in reader:
			author = row["Authors"]
			title = row["Item Title"]
			source = "Springer"
			url = row["URL"]
			abstract = row["Abstract"]
			new_row = [author, title, source, url, abstract]
			new_rows.append(new_row)
			# print new_row
			# print "\n\n"
	return new_rows

def read_wiley():
	with open('wiley-search-results-all.bib') as bibtex_file:
	
		bib_database = bibtexparser.load(bibtex_file)
		new_rows = []
		for entry in bib_database.entries:
			if "author" in entry.keys():
				author = entry["author"].encode("utf-8")
				title = entry["title"].encode("utf-8")
				source = "Wiley"
				abstract = entry["abstract"].encode("utf-8")
				if "url" in entry.keys():
					url = entry["url"].encode("utf-8")
				else:
					url = "---NO URL FOUND---"
				new_row = [author, title, source, url, abstract]
				new_rows.append(new_row)
				# print new_row
				# print "\n\n"
	return new_rows


def read_taylor():
	new_rows = []
	archivos = os.listdir("Taylor")
	# archivos = ["results_1-50.csv"]
	for archivo in archivos:
		with open('Taylor/' + archivo) as csvfile:
			reader = csv.DictReader(csvfile)
			for row in reader:
				author = row["Author"]
				title = row["Title"]
				source = "Taylor"
				url = row["URL"]
				abstract = row["Abstract"]
				new_row = [author, title, source, url, abstract]
				new_rows.append(new_row)
				# print new_row
				# print "\n\n"
	return new_rows

def read_wos():
	new_rows = []
	files = ["results_1-50", "results_51-100", "results_101-150", "results_151-200", "results_201-250", "results_251-300", "results_301-315"]
	# files = ["results_1-50"]

	for file in files:
		html =  BeautifulSoup(open("Web_of_Science/" + file), "lxml")

		entradas = html.find_all('table')
		for entrada in entradas:
			band = 0
			campos = entrada.find_all('td')
			for campo in campos:
				titulo_campo = campo.find('b')
				if titulo_campo:

					if titulo_campo.string == "Title:":
						title = campo.getText().replace("Title:", "").replace("\n", "")
						band = band + 1
					if titulo_campo.string == "By:":
						authors = campo.getText().replace("By:", "").replace("\n", "")
						band =  band + 1
					if titulo_campo.string == "Abstract:":
						abstract = campo.getText().replace("Abstract:", "").replace("\n", "")
						band = band + 1
					
			if band == 3:
				url = "--NO URL FOUND--"
				source = "Web_of_Science"
				# print "TITLE= " + title
				# print "AUTHORS= " + authors
				# print "ABSTRACT= " + abstract
				new_rows.append([title, authors, source, url, abstract])
			# print "-------------------------------------------------------------------------------------"
	return new_rows


def read_ieee():
	with open('IEEE-unique_results.csv') as csvfile:
		reader = csv.DictReader(csvfile)
		new_rows = []
		for row in reader:
			author = "--sin autores--"
			title = row["DocumentTitle"]
			source = "IEEE"
			url = row["PDF_Link"]
			abstract = row["Abstract"]
			new_row = [author, title, source, url, abstract]
			new_rows.append(new_row)
			# print new_row
			# print "\n\n"
	return new_rows

def read_emerald():
	with open('emeraldResults.csv') as csvfile:
		reader = csv.DictReader(csvfile)
		new_rows = []
		for row in reader:
			author = row['Author']
			title = row["Title"]
			source = "Emerald"
			url = row["URL"]
			abstract = row["Abstract"]
			new_row = [author, title, source, url, abstract]
			new_rows.append(new_row)
			# print new_row
			# print "\n\n"
	return new_rows

def read_sage():
	html =  BeautifulSoup(open("SAGE_final_results.htm"), "lxml")
	new_rows = []
	entradas = html.find_all('li',{'class':'marked-citation-results-cit',})
	for entrada in entradas:
		title = entrada.find('span',{'class':'cit-title',}).getText()

		autores_item = entrada.find_all('span',{'class':'cit-auth cit-auth-type-author',})
		autores_texto = []
		for autor in autores_item:
			autores_texto.append(autor.getText())
		authors = ", ".join(autores_texto)
		source = "Sage"
		url = entrada.find('ul',{'class':'cit-views',}).find('li',{'class':'first-item',}).find('a')["href"]
		try:
			abstract = entrada.find('div',{'class':'section abstract',}).find('p').getText().replace("\n", "")
		except:
			abstract = "NO ABSTRACT FOUND"
			# print title
			# print '\n'
		new_row = [authors, title, source, url, abstract]
		new_rows.append(new_row)
		# print new_row
	return new_rows


def unir_results ():
	# cada elemento de 'results' es una lista con los siguientes elementos 0:autores, 1:titulo, 2:fuente, 3:url, 4:abstract
	# estoy sumando de a uno nomas porque algunos necesitan se encodeados a unicode y aun no se cual
	results = read_acm() + read_springer() #+ read_wiley() + read_taylor() + read_wos() + read_ieee() + read_emerald() + read_sage()
	#print (results[0][0])
	#aca deberia escribirse el excel

	# Creamos un nuevo archivo xls
	workbook = xlwt.Workbook(encoding='utf-8')
	# Creamos una hoja
	sheet = workbook.add_sheet('Sheet_1')
	# Cargamos la cabecera
	sheet.write(0,0,"Autor/es",easyxf('font: bold true;'))
	sheet.write(0,1,"Título",easyxf('font: bold true;'))
	sheet.write(0,2,"Fuente",easyxf('font: bold true;'))
	sheet.write(0,3,"URL",easyxf('font: bold true;'))
	sheet.write(0,4,"Abstract",easyxf('font: bold true;'))

	# Escribimos los resultados de ACM
	i = 1
	for result in results:
		sheet.write(i,0,result[0])
		sheet.write(i,1,result[1])
		sheet.write(i,2,result[2])
		sheet.write(i,3,result[3])
		sheet.write(i,4,result[4])
		i = i + 1

	workbook.save('unificado.xls')



# read_acm()
# read_springer()
# read_wiley()
# read_taylor()
# read_wos()
# read_ieee()
# read_emerald()
# read_sage()
unir_results()