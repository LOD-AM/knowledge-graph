#!/usr/bin/env bash
# Download the external ontologies the checks validate against into .cache/.
# They are NOT committed (see README: no external ontology dumps in the repo).
set -euo pipefail

CACHE="${CACHE_DIR:-$(dirname "$0")/../.cache}"
mkdir -p "$CACHE"

CRM_URL="https://cidoc-crm.org/rdfs/7.1.3/CIDOC_CRM_v7.1.3.rdf"
FABIO_URL="https://sparontologies.github.io/fabio/current/fabio.ttl"
AFO_URL="https://purl.allotrope.org/voc/afo/merged/REC/2025/12/merged-without-qudt"

fetch() { # url file accept
  if [ -s "$CACHE/$2" ]; then echo "cached: $2"; return; fi
  echo "fetching: $1"
  curl -fsSL --retry 3 -H "Accept: $3" -o "$CACHE/$2.tmp" "$1"
  mv "$CACHE/$2.tmp" "$CACHE/$2"
}

fetch "$CRM_URL" cidoc-crm-7.1.3.rdf "application/rdf+xml"
fetch "$AFO_URL" afo-2025-12.ttl "text/turtle"
fetch "$FABIO_URL" fabio.ttl "text/turtle"
