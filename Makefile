
.SUFFIXES: .js .css .html .svg .png .jpg
RJS=node_modules/requirejs/bin/r.js
GIT=git
GIT_CURRENT_BRANCH=$(shell utl/get_current_git_branch.sh)
GIT_DEPLOY_FROM_BRANCH=master
PNG2FAVICO=utl/png2favico.sh
SEDVERSION=utl/sedversion.sh
NPM=npm
BOWER=node_modules/bower/bin/bower
SASS=node_modules/node-sass/bin/node-sass --output-style compressed
MAKEDEPEND=node_modules/.bin/js-makedepend 
ifeq ($(GIT_DEPLOY_FROM_BRANCH), $(GIT_CURRENT_BRANCH))
	BUILDDIR=build
else
	BUILDDIR=build/branches/$(GIT_CURRENT_BRANCH)
endif

SOURCES_NODE=$(GENERATED_SOURCES_NODE)
REMOVABLEPRODDIRS=$(BUILDDIR)/lib \
	$(BUILDDIR)/style \
	$(BUILDDIR)/script \
	$(BUILDDIR)/audio
PRODDIRS=$(BUILDDIR) \
		 $(REMOVABLEPRODDIRS)
LIBDIRS=src/lib

.PHONY: help dev-build install deploy-gh-pages check stylecheck fullcheck mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test update-dependencies run-update-dependencies depend bower-package

help:
	@echo " --------------------------------------------------------"
	@echo "| Just downloaded the mscgen_js sources?                 |"
	@echo "|  First run 'make prerequisites'                        |"
	@echo " --------------------------------------------------------"
	@echo
	@echo "Most important build targets:"
	@echo
	@echo "install"
	@echo " -> this is probably the target you want when"
	@echo "    hosting mscgen_js"
	@echo
	@echo " creates the production version (minified js, images,"
	@echo " html)"
	@echo
	@echo "dev-build"
	@echo " (re)enerates stuff needed to develop (pegjs -> js, css"
	@echo " smashing etc)"
	@echo
	@echo "check"
	@echo " runs the linter and executes all unit tests"
	@echo
	@echo "clean"
	@echo " removes everything created by either install or dev-build"
	@echo
	@echo "deploy-gh-pages"
	@echo " deploys the build to gh-pages"
	@echo "  - 'master' branch: the root of gh-pages"
	@echo "  - other branches : in branches/branche-name"
	@echo
	@echo "update-dependencies"
	@echo " updates all (node) module dependencies in package.json"
	@echo " installs them, rebuilds all generated sources and runs"
	@echo " all tests."
	@echo
	@echo " --------------------------------------------------------"
	@echo "| More information and other targets: see wikum/build.md |"
	@echo " --------------------------------------------------------"
	@echo



# production rules

$(BUILDDIR)/%.html: src/%.html tracking.id tracking.host siteverification.id
	$(SEDVERSION) < $< > $@

$(BUILDDIR)/style/%.css: src/style/%.css
	cp $< $@

$(BUILDDIR)/fonts/%: src/fonts/%
	cp $< $@

$(PRODDIRS):
	mkdir -p $@

bower_components/buzz/%.js:
	$(BOWER) install --save jaysalvat/buzz

$(LIBDIRS):
	mkdir -p $@

# file targets prod
$(BUILDDIR)/index.html: $(PRODDIRS) \
	src/index.html \
	$(BUILDDIR)/style/workout.css \
	$(BUILDDIR)/lib/require.js \
	$(BUILDDIR)/script/shoutingcoach.js \
	$(BUILDDIR)/audio/

siteverification.id:
	@echo yoursiteverifactionidhere > $@

tracking.id:
	@echo yourtrackingidhere > $@

tracking.host:
	@echo auto > $@

$(BUILDDIR)/images/: src/images
	cp -R $< $@

$(BUILDDIR)/samples/: src/samples
	cp -R $< $@

$(BUILDDIR)/lib/require.js: src/lib/require.js
	cp $< $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: src/index.html 

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/script/* | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/script/*

lint:
	$(NPM) run lint

cover: dev-build
	$(NPM) run cover

install: $(BUILDDIR)/index.html 

deploy-gh-pages: install
	@echo Deploying build `utl/getver` to $(BUILDDIR)
	$(GIT) -C $(BUILDDIR) add --all .
	$(GIT) -C $(BUILDDIR) commit -m "build `utl/getver`"
	$(GIT) -C $(BUILDDIR) push origin gh-pages
	$(GIT) -C $(BUILDDIR) status

tag: 
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

static-analysis:
	$(NPM) run plato

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated
	
check: noconsolestatements lint test

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies dev-build test nsp
	$(GIT) diff package.json
	
run-update-dependencies: 
	$(NPM) run npm-check-updates
	$(NPM) install
	
depend:
	$(MAKEDEPEND) --system amd src/script

clean: clean-generated-sources
	rm -rf $(BUILDDIR)/style
		$(BUILDDIR)/audio
		$(BUILDDIR)/script
		$(BUILDDIR)/lib
		$(BUILDDIR)/index.html
		$(BUILDDIR)/workouts.json

	rm -rf coverage

# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/script/be/workout.js: \
	src/script/be/exercise.js

src/script/fe/gauges.js: \
	src/script/fe/gauges/circle.js \
	src/script/fe/gauges/disk.js

src/script/fe/gauges/disk.js: \
	src/script/fe/gauges/circle.js

src/script/fe/painting.js: \
	src/lib/buzz.js \
	src/script/be/timeutensils.js \
	src/script/be/workout.js \
	src/script/fe/gauges.js \
	src/script/jquery.js

src/script/shoutingcoach.js: \
	src/script/fe/painting.js \
	src/script/fe/xaja.js \
	src/script/jquery.js

