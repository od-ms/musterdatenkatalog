import csv
import requests
import logging
import json
from os import path


class MusterdatenkatalogAnalyzer:
    """ Read only the values that we need from Musterdatenkatalog and save them into a json file """

    # Config values
    katalog_url = 'https://www.bertelsmann-stiftung.de/fileadmin/files/musterdatenkatalog/NRW_-_Musterdatensa__tze_V2.1.csv'
    katalog_tempfile = 'data/NRW_-_Musterdatensaetze_V2.1.csv'
    katalog_json = 'public/musterdatenkatalog.json'

    def __init__(self):
        logging.basicConfig(level=logging.DEBUG, format='<%(asctime)s %(levelname)s> %(message)s')
        self.musterdatenkatalog_csv_to_json()


    def musterdatenkatalog_csv_to_json(self):
        """ Read the extisting excel and save ALL content to "old_excel_content",
            so we can then write it to a "new" file (=to continue from where we left off)
            Also return all dataset_ids as dict, so we can skip them
        """

        # download remote url to temp file
        if not path.exists(self.katalog_tempfile): 
            logging.info("Reading catalog url: %s", self.katalog_url)
            myfile = requests.get(self.katalog_url)
            open(self.katalog_tempfile, 'wb').write(myfile.content)

        muster_json = []
        with open(self.katalog_tempfile) as csvfile:
            csvreader = csv.DictReader(csvfile)
            for row in csvreader:
                logging.debug('row %s', row) 
                muster_json.append({
                    'top': row['THEMA'],
                    'sub': row['BEZEICHNUNG'],
                    'org': row['ORG'],
                    'name': row['dct:title'],
                    'id': row['dct:identifier']
                })

        assert (len(muster_json)>0), 'Failed to read katalog_tempfile'
        assert ('' not in muster_json[0].values()), 'Empty value in first katalog row? Maybe CSV Format changed?'
        logging.debug(muster_json)

        with open(self.katalog_json, 'w') as outfile:
            json.dump(muster_json, outfile)


MusterdatenkatalogAnalyzer()

