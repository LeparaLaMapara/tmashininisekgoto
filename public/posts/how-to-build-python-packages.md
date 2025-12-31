---
title: How I Learned to Build My Own Python Libraries (From Curiosity to Real Work)
date: 2025-12-23
tags: [open source, systems, python]
summary: creating from 1st principles
---


### Why I wanted to learn to build my own Python libraries

For the longest time, I’ve always been interested in **building things from scratch**  not just using them, but understanding *how they actually work* underneath. When I first started using Python, I remember asking myself questions like:

* “How was NumPy built?”
* “Who decided it should work like this?”
* “Could I build something like this myself?”

Not because I thought I’d beat NumPy, but because **trying to rebuild something forces you to truly understand it**. That way of learning has always worked best for me. Over time, this curiosity turned into something practical. As my career progressed, I found myself working on problems where:

* Off-the-shelf tools didn’t quite fit
* The team was small, or skills were limited
* We needed custom machine-learning models or engineering frameworks
* Or I had to collaborate with researchers and engineers from other companies

In those situations, knowing how to **package my own code properly** so others could install it, use it, and improve it became extremely valuable. It’s actually one of the reasons I’ve been able to **consult for a few international startups**. Not because I knew fancy buzzwords, but because I could take an idea, turn it into a clean, usable tool, and share it with others. So in this blog, I want to show  *gently and honestly*  how I learned to do that. Not as a “here’s the official way” lol, but as:

* “This is what worked for me, and why it mattered.”

---

## So… what does “building a Python library” actually mean?

At a very basic level, a Python library is just:

* Some code
* Structured in a clean way
* So that other people (or future you) can install it and use it easily

Instead of copying files around, people can just type:

```bash
pip install something
```

And it works. To do that, your code needs a **certain structure**.

Here’s the simplest version of what that structure looks like.

---

## The simplest skeleton of a Python library

```text
my_module/
    README.md
    LICENSE
    setup.py
    my_module/
        __init__.py
        module_functions.py
```

Because I love explaining, let me, so the:

* **README.md**
  This is you explaining *what this thing is* and *why it exists*.

* **LICENSE**
  This tells people what they’re allowed to do with your work.

* **setup.py**
  This is the most important file.
  It tells Python:

  * What your library is called
  * Who made it
  * What it depends on
  * How to install it

* **my_module/**
  This folder holds the actual code.

* ****init**.py**
  This file makes Python treat the folder like a proper library.

* **module_functions.py**
  This is where your logic lives (e.g functions, classes, business rules, ideas.)

---

## The part where Python learns about your library

Inside `setup.py`, you describe your library to the world.

Here’s a simple example:

```python
from setuptools import setup, find_packages

setup(
    name='my_module',
    version='0.1',
    author='Your Name',
    author_email='your.email@example.com',
    description='A short description of your module',
    long_description=open('README.md').read(),
    url='https://github.com/your-username/my_module',
    packages=find_packages(),
    install_requires=[
        'numpy',
        'scipy',
    ],
)
```

This file is basically you saying:

> “Hi Python, this is my work.
> This is what it’s called.
> This is what it needs to run.
> Please make it easy for others to use.”

---

## Writing the actual code (the fun part)

Inside your module, you write normal Python nothing fancy.

```python
import numpy as np

def my_function(arg1, arg2):
    """
    A simple function that does something useful.
    """
    pass

class MyClass:
    def __init__(self, arg1, arg2):
        pass

    def my_method(self, arg):
        pass
```

And in `__init__.py`, you expose what you want others to see:

```python
from .module_functions import my_function, MyClass
```

This makes your library feel clean and intentional.

---

## Installing your own library (like magic)

Once everything is in place, you can install your own work just like any other package:

```bash
pip install /path/to/my_module
```

That moment when your own code installs successfully is **deeply satisfying**. It’s the point where your work becomes *real*.

---


## Sharing it with the world (PyPI)

If you want others to install your library from anywhere, you publish it to **PyPI** (Python Package Index).

The steps are straightforward:

1. Create a PyPI account
2. Package your code
3. Upload it

Once I’ve built something useful, the next question becomes:

> “How do I let other people use this without sending them files or instructions?”

In the Python world, the answer is **PyPI** — the Python Package Index.
Think of it as an app store for Python tools.

When I publish a library there, anyone in the world can install it with one command.
That’s when code stops living on my laptop and starts living **in the world**.

---

### What’s happening conceptually 

Before anyone can install my work, a few things need to happen:

1. I prove who I am by creating an account
2. I package my code so Python understands it
3. I upload it to a central place
4. Python learns how to find and install it

Once that’s done, someone can type:

```bash
pip install my_module
```

And Python does the rest.

That’s the big picture.

---

### The actual technical steps (for engineers)

Here’s what that process looks like in practice.

#### 1. Create a PyPI account

Register at:
[https://pypi.org/account/register/](https://pypi.org/account/register/)

This gives you credentials to publish packages.

---

#### 2. Prepare your package

Your project should already have:

* a clean folder structure
* a `setup.py` or `pyproject.toml`
* a `README.md`
* versioning in place

Example structure:

```text
my_module/
 ├─ my_module/
 │   ├─ __init__.py
 │   └─ module_functions.py
 ├─ README.md
 ├─ LICENSE
 └─ setup.py
```

---

#### 3. Install publishing tools

```bash
pip install setuptools wheel twine
```

These tools handle building and uploading your package.

---

#### 4. Build the package

From the root directory:

```bash
python setup.py sdist bdist_wheel
```

This creates installable artifacts inside a `dist/` folder.

---

#### 5. Validate the build

```bash
twine check dist/*
```

This catches common packaging mistakes early.

---

#### 6. Upload to PyPI

```bash
twine upload dist/*
```

You’ll be prompted for your PyPI credentials.

Once this succeeds, your package is live.

---

#### 7. Install it like any other library

From anywhere in the world:

```bash
pip install my_module
```

At that point, Python knows:

* where your code lives
* how to install it
* what it depends on

No emails. No file transfers. No explanations.

---

### Why this step matters

This is the moment where:

* an idea becomes reusable
* code becomes a product
* and learning turns into contribution

It’s also where discipline starts to matter:

* versioning
* backward compatibility
* documentation
* trust

Once your work is public, you’re accountable to users — even if that user is just *future you*.

---


Once done, anyone can install your work with:

```bash
pip install my_module
```

And that’s it. Your idea is now part of the global Python ecosystem.

---

## Why this mattered to me

Learning how to do this changed how I think about software.

I stopped seeing code as:

> “Something I write for today”

And started seeing it as:

> “Something I build for people — including my future self”

This mindset helped me:

* Collaborate better
* Work independently in small teams
* Build systems instead of scripts
* And turn curiosity into real value

That’s why I wanted my first blog post to be about this. Because everything I’ve built since — models, systems, frameworks — started right here.
With curiosity, confusion, and the decision to understand things properly instead of just making them work.

The next post will be more technical. A proper breakdown of CI/CD pipelines, PyPI packaging, GitHub Actions, my 1 st Python library `tfilterpy`  the skills I had to learn, the mistakes I made, and what those failures taught me about engineering discipline. For now though, my biggest challenge isn’t CI or packaging. It’s figuring out how to add a comment section to my blog post without over-engineering it 😅

If you’re reading this and you know a clean, simple way to do that — you should probably tell me…once I figure out where the comments are supposed to live.

