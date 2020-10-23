# Musterdatenkatalog

Dieses Repository enthält

 * Ein Python-Skript, das den **Open-Data-Musterdatenkatalog** lädt und zu JSON konvertiert.
 * Eine HTML-Seite mit der man den Musterdatenkatalog **interaktiv betrachten** kann. 
 * Wenn zusätzlich eine entsprechende CSV-Datei mit den Open-Data-Datensätzen Deiner Stadt im Unterverzeichnis "data" liegt, dann werden in der interaktiven Tabelle auch die **Open-Data-Potentiale Deiner Stadt angezeigt**. Teilweise sogar die Ämter, die Du (vermutlich) ansprechen musst, um diese Open-Data-Potentiale zu heben.


## Wie startet man es?

Demo: https://od-ms.github.io/musterdatenkatalog/public/index.html


## Wie aktualisiert man es?

1. Run *generate_data.py* to download and parse the latest Musterdatenkatalog.
2. Update *data/dkan_resources_2020-10.csv*, the file that should contain the datasets of your city. 
3. Run *generate_city_data.py* to convert your CSV city data to JSON.
4. Open the file *public/index.html* in your browser.
