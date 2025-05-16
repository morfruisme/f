all: build

build:
	tsc && python3 parse.py

debug:
	bun ./src/*.html

clean:
	rm -rf ./docs/*

push: build
	git add . && git commit -m $(m) && git push