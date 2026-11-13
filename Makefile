# LOD-AM knowledge graph: checks. Run `make` before every commit.
PY ?= python3

.PHONY: all fetch check validate test-terms test-shapes test-queries test-converter install

all: check validate test-terms test-shapes test-queries test-converter

install:            ## install Python tools
	$(PY) -m pip install -r requirements.txt

fetch:              ## download CRM / AFO / FaBiO into .cache/ (not committed)
	bash tools/fetch_ontologies.sh

check: fetch        ## parse, prefixes, term existence, CRM domain/range
	$(PY) tools/check_terms.py

validate:           ## SHACL: LOD-AM conventions
	$(PY) tools/validate.py

test-terms: fetch   ## every file in tests/terms/invalid must FAIL check_terms
	@for f in tests/terms/invalid/*.ttl; do \
	  if $(PY) tools/check_terms.py $$f >/dev/null; then echo "FAIL $$f was accepted"; exit 1; \
	  else echo "ok   $$f rejected"; fi; done

test-shapes:        ## every file in tests/shapes/invalid must FAIL validation
	@for f in tests/shapes/invalid/*.ttl; do \
	  if $(PY) tools/validate.py $$f >/dev/null; then echo "FAIL $$f was accepted"; exit 1; \
	  else echo "ok   $$f rejected"; fi; done

test-queries:       ## queries/*.rq against expected tests/queries/*.tsv
	$(PY) tools/test_queries.py

test-converter:
	cd converter && npm test
