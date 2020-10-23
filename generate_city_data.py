import csv
import requests
import logging
import json
from os import path


class ConvertCityCsv:
    """ Read CSV, write JSON"""

    # Config values
    katalog_file = 'data/dkan_resources_2020-10.csv'
    katalog_json = 'public/city_data.json'

    def __init__(self):
        logging.basicConfig(level=logging.DEBUG, format='<%(asctime)s %(levelname)s> %(message)s')
        self.city_csv_to_json()


    def city_csv_to_json(self):
        """ Read the extisting excel and the content that we want to JSON
        """

        muster_json = []
        with open(self.katalog_file) as csvfile:
            csvreader = csv.DictReader(csvfile)
            for row in csvreader:
                logging.debug('row %s', row) 
                muster_json.append({
                    'cat': row['Extra-Kategorie'],
                    'org': row['Extra-Quelle'] if row['Extra-Quelle'] else row['Author'],
                    'name': row['Dataset-Name'],
                    'id': row['Dataset-ID']
                })

        assert (len(muster_json)>0), 'Failed to read katalog_tempfile'
        assert ('' not in muster_json[0].values()), 'Empty value in first katalog row? Maybe CSV Format changed?'
        logging.debug(muster_json)

        with open(self.katalog_json, 'w') as outfile:
            json.dump(muster_json, outfile)


ConvertCityCsv()

