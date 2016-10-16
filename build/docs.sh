#!/usr/bin/env bash

sed -i '' '/## Class:.*/{n;N;N;N;d;}' build/index.md
cat build/{README,index}.md > README.md
