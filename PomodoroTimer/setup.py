from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="pomodoro-timer",
    version="1.0.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="A beautiful web-based Pomodoro Timer with customizable work and break intervals",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/pomodoro-timer",
    project_urls={
        "Bug Tracker": "https://github.com/yourusername/pomodoro-timer/issues",
        "Documentation": "https://github.com/yourusername/pomodoro-timer/blob/main/docs/",
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Office/Business :: Scheduling",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: JavaScript",
        "Framework :: Flask",
        "Environment :: Web Environment",
        "Operating System :: OS Independent",
    ],
    packages=find_packages(),
    python_requires=">=3.7",
    install_requires=requirements,
    extras_require={
        "dev": ["flake8", "black", "isort"],
        "test": ["pytest", "pytest-flask", "coverage"],
    },
    entry_points={
        "console_scripts": [
            "pomodoro-timer=app:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["templates/*.html", "static/css/*.css", "static/js/*.js"],
    },
)
