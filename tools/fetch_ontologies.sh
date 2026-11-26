#!/usr/bin/env bash
# Download the external ontologies the checks validate against into .cache/.
# They are NOT committed (see README: no external ontology dumps in the repo).
set -euo pipefail

CACHE="${CACHE_DIR:-$(dirname "$0")/../.cache}"
mkdir -p "$CACHE"

CRM_URL="https://cidoc-crm.org/rdfs/7.1.3/CIDOC_CRM_v7.1.3.rdf"
FABIO_URL="https://sparontologies.github.io/fabio/current/fabio.ttl"
AFO_URL="https://purl.allotrope.org/voc/afo/merged/REC/2025/12/merged-without-qudt"
# CRMsci 3.2 is the release for CRM 7.1.3 (sampling: S2_Sample_Taking, S13_Sample)
CRMSCI_URL="https://cidoc-crm.org/extensions/crmsci/rdfs/3.2/CRMsci_v3.2.rdf"
# CRMarchaeo 2.1.1 (released for CRM 7.1.2; every CRM term it uses exists in 7.1.3, knowledge-graph#6)
CRMARCHAEO_URL="https://cidoc-crm.org/extensions/crmarchaeo/rdfs/2.1.1/CRMarchaeo_v2.1.1.rdf"

# Each file must match its sha256 in tools/ontologies.sha256, downloaded or cached: the checks must
# not change because a host changed a file (FaBiO has no versioned URL, only .../current/). On a
# mismatch: look at what changed upstream, then update the checksum in its own PR.
SUMS="$(dirname "$0")/ontologies.sha256"
matches() { # path name -> 0 if the file at path has the checksum listed for name
  local want; want=$(awk -v f="$2" '$2 == f {print $1}' "$SUMS")
  [ -n "$want" ] || { echo "FAIL: no checksum for $2 in $SUMS" >&2; exit 1; }
  [ "$(sha256sum "$1" | cut -d' ' -f1)" = "$want" ]
}
fetch() { # url file accept
  if [ -s "$CACHE/$2" ]; then
    matches "$CACHE/$2" "$2" || { echo "FAIL: cached $2 doesn't match tools/ontologies.sha256; delete it and fetch again" >&2; exit 1; }
    echo "cached: $2"; return
  fi
  echo "fetching: $1"
  curl -fsSL --retry 3 -H "Accept: $3" -o "$CACHE/$2.tmp" "$1"
  if ! matches "$CACHE/$2.tmp" "$2"; then
    rm -f "$CACHE/$2.tmp"
    echo "FAIL: $1 has changed upstream (its sha256 differs from tools/ontologies.sha256); check the new version, then update the checksum in its own PR" >&2
    exit 1
  fi
  mv "$CACHE/$2.tmp" "$CACHE/$2"
}

fetch "$CRM_URL" cidoc-crm-7.1.3.rdf "application/rdf+xml"
fetch "$AFO_URL" afo-2025-12.ttl "text/turtle"
fetch "$FABIO_URL" fabio.ttl "text/turtle"
fetch "$CRMSCI_URL" crmsci-3.2.rdf "application/rdf+xml"
fetch "$CRMARCHAEO_URL" crmarchaeo-2.1.1.rdf "application/rdf+xml"
