#!/usr/bin/env python3
"""
Test runner script for Pomodoro Timer project.
Runs both Python unit tests and provides instructions for JavaScript tests.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_python_tests():
    """Run Python unit tests using unittest."""
    print("🧪 Running Python Unit Tests...")
    print("=" * 50)
    
    try:
        # Run the unit tests
        result = subprocess.run([
            sys.executable, '-m', 'unittest', 'tests.test_app', '-v'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        if result.returncode == 0:
            print("✅ All Python tests passed!")
        else:
            print("❌ Some Python tests failed!")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running Python tests: {e}")
        return False

def run_coverage():
    """Run tests with coverage report."""
    print("\n📊 Running Coverage Analysis...")
    print("=" * 50)
    
    try:
        # Run coverage
        subprocess.run([
            sys.executable, '-m', 'coverage', 'run', '-m', 'unittest', 'tests.test_app'
        ], cwd=os.getcwd())
        
        # Generate coverage report
        result = subprocess.run([
            sys.executable, '-m', 'coverage', 'report', '-m'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        print(result.stdout)
        
        # Generate HTML coverage report
        subprocess.run([
            sys.executable, '-m', 'coverage', 'html'
        ], cwd=os.getcwd())
        
        print("📊 Coverage report generated in htmlcov/index.html")
        
    except Exception as e:
        print(f"❌ Error running coverage: {e}")

def print_javascript_test_instructions():
    """Print instructions for running JavaScript tests."""
    print("\n🌐 JavaScript Unit Tests")
    print("=" * 50)
    print("To run JavaScript tests:")
    print("1. Open tests/test_timer.html in your web browser")
    print("2. Click 'Run All Tests' button")
    print("3. View the test results and coverage summary")
    print("\nAlternatively, you can run:")
    print("open tests/test_timer.html")

def main():
    """Main test runner function."""
    print("🍅 Pomodoro Timer - Test Suite")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("app.py").exists():
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Run Python tests
    python_tests_passed = run_python_tests()
    
    # Run coverage analysis
    run_coverage()
    
    # Print JavaScript test instructions
    print_javascript_test_instructions()
    
    # Summary
    print("\n📋 Test Summary")
    print("=" * 50)
    if python_tests_passed:
        print("✅ Python tests: PASSED")
    else:
        print("❌ Python tests: FAILED")
    
    print("🌐 JavaScript tests: Run manually in browser")
    print("\n💡 Tips:")
    print("- Run tests before committing code")
    print("- Check coverage reports to ensure comprehensive testing")
    print("- Add new tests when adding new features")

if __name__ == "__main__":
    main()
