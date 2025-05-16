all: build

build:
	tsc && python3 parse.py

debug:
	bun ./src/*.html

clean:
	rm -rf ./docs/*