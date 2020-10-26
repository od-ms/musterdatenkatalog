#!/bin/bash

jq --slurp --raw-input --raw-output   'split("\n") | .[1:] | map(split(",")) |
      map({"id": .[0],
           "amt": .[1],
           "dez": .[2]
  })' data/aemter_muenster.csv > public/city_aemter.json