.PHONY: help install test test-js test-python coverage run clean setup dev

help:  ## Show this help message
	@echo "🍅 Pomodoro Timer - Make Commands"
	@echo "================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Initial project setup
	@echo "🔧 Setting up Pomodoro Timer project..."
	pip install -r requirements.txt
	@echo "✅ Setup complete!"

install: ## Install dependencies
	pip install -r requirements.txt

test: ## Run all tests
	python run_tests.py

test-python: ## Run only Python tests
	python -m unittest tests.test_app -v

test-js: ## Open JavaScript tests in browser
	open tests/test_timer.html

coverage: ## Run tests with coverage report
	python -m coverage run -m unittest tests.test_app
	python -m coverage report -m
	python -m coverage html
	@echo "📊 Coverage report generated in htmlcov/index.html"

run: ## Start the Flask development server
	python app.py

dev: ## Start development server with auto-reload
	FLASK_ENV=development FLASK_DEBUG=1 python app.py

clean: ## Remove generated files
	rm -rf __pycache__ tests/__pycache__ .coverage htmlcov/
	find . -name "*.pyc" -delete
	find . -name "*.pyo" -delete

lint: ## Run code linting (if flake8 is installed)
	@if command -v flake8 >/dev/null 2>&1; then \
		flake8 app.py tests/; \
	else \
		echo "flake8 not installed. Run: pip install flake8"; \
	fi

format: ## Format code (if black is installed)
	@if command -v black >/dev/null 2>&1; then \
		black app.py tests/; \
	else \
		echo "black not installed. Run: pip install black"; \
	fi

deploy-prep: clean test ## Prepare for deployment
	@echo "🚀 Ready for deployment!"

all: setup test ## Setup and test everything
	@echo "🎉 All tasks completed!"
