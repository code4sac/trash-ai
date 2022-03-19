#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""parse csv."""
import json
import csv

FPATH = 'tacotrashdataset/meta_df.csv'
DESTINATION = '../../frontend/src/static/model/name_map.json'

def to_json():
    """Lookup."""
    dct = {}
    with open(FPATH) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cat_id = row['cat_id']
            cat_name = row['cat_name']
            dct[cat_id] = cat_name
    return dct


def main():
    """Run main function."""
    dump_json = to_json()
    with open(DESTINATION, 'w') as f:
        print(f'Writing to {f.name}')
        json.dump(dump_json, f)


if __name__ == '__main__':
    main()
