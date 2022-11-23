---
date: 2022-11-23T12:42:54-05:00
slug: karpathy-ml-lectures
title: Learning ML with Andrej Karpathy
summary: "Notes from following Karpathy's videos: Neural Networks: Zero to Hero"
collection_swe_toolbox: true
---

## Intro

These are my notes while learning foundational Machine Learning (ML) from Andrej Karpathy. Andrej is the former Director of AI at Tesla, and an excellent teacher. He  demystifies complex ML topics like gradient descent through simple examples.

YouTube playlist: [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

Videos:

- [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- ...

## Setup

First, install Python if you haven't yet.

Use [pyenv](https://github.com/pyenv/pyenv-installer), similar to rbenv, to easily manage versions.
Note: I recommend an older Python version like 3.9 because PyTorch, a key dependency later on, doesn't always work with the latest version it seems:

```shell
pyenv install -l  # list remote
pyenv install 3.9 # install
pyenv local 3.9   # use it locally
pyenv versions    # list local

pyenv init
# then update ~/.zshrc with the output to be able to use correct version of
# python via `python` and `pip` commands without calling `python3`, `pip3`, etc
```

Then, open VSCode and install its [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

Then `git clone` Andrej's repositories locally:

```
git clone git@github.com:karpathy/micrograd.git
git clone git@github.com:karpathy/makemore.git
```

Open a Jupyter Notebook `.ipynb` file in `micrograd` and select the `pyenv` version you installed, plus install any VSCode recommended extensions for Jupyter Notebooks.

Create a new file called `youtube1.ipynb` or something similar so you can run same commands that Andrej does during his videos.

Now you're all set to dive into the videos.

## Micrograd

Youtube: [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

## References

### Lecture notes by others

- <https://github.com/Anri-Lombard/makemore>
- <https://github.com/Anri-Lombard/micrograd>
