.PHONY: install typecheck test

install:
	bun install

typecheck:
	bun run typecheck

test:
	bun test
