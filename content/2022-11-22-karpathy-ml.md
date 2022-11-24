---
date: 2022-11-23T12:42:54-05:00
slug: ml-neural-nets-karpathy
title: Learning ML neural nets with Andrej Karpathy
summary: "Notes from following Karpathy's machine learning videos: Neural Networks: Zero to Hero"
collection_swe_toolbox: true
---

## Intro

These are my ongoing notes from learning foundational Machine Learning (ML) concepts, as taught by Andrej Karpathy.
Andrej is the former Director of AI at Tesla, and an excellent teacher.
He demystifies complex ML topics like gradient descent through simple examples. When following these video you can (and should) easily recreate everything he does on your local machine.

YouTube playlist: [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

YouTub videos:

- 1. [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- 2. [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- ...

Github repos:

- [micrograd](https://github.com/karpathy/micrograd) - A tiny scalar-valued autograd engine and a neural net library on top of it with PyTorch-like API
- [makemore](https://github.com/karpathy/makemore) - An autoregressive character-level language model for making more things

### What's a neural network?

Here's how Wikipedia defines a [neural network](https://en.wikipedia.org/wiki/Neural_network):

> A neural network is a network or circuit of biological neurons, or, in a modern sense, an artificial neural network, composed of artificial neurons or nodes.

> Thus, a neural network is either a biological neural network, made up of biological neurons, or an artificial neural network, used for solving artificial intelligence (AI) problems.

> The connections of the biological neuron are modeled in artificial neural networks as weights between nodes. A positive weight reflects an excitatory connection, while negative values mean inhibitory connections. All inputs are modified by a weight and summed. This activity is referred to as a linear combination.

> Finally, an activation function controls the amplitude of the output. For example, an acceptable range of output is usually between 0 and 1, or it could be −1 and 1.

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

Then, open VS Code and install its [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

Then `git clone` Andrej's repositories locally:

```shell
git clone git@github.com:karpathy/micrograd.git
git clone git@github.com:karpathy/makemore.git

# Open in VS Code
code micrograd
```

Open a Jupyter Notebook `.ipynb` file in `micrograd` and select the `pyenv` version you installed, plus install any VSCode recommended extensions for Jupyter Notebooks.

Create a new file called `youtube1.ipynb` or something similar so you can run same commands that Andrej does during his videos.

Now you're all set to dive into the videos.

## 1. Micrograd

Watch the YouTube video: [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ).

And follow along locally in your own `.ipynb` file. I strongly recommend doing this yourself, typing out everything that Andrej does, and running it all locally. This "practice" helps me learn the content better and builds confidence that it can all be recreated locally.

Just for reference (create your own!), here are examples of local notebooks:

- My notebook from the [1st part of the micrograd video](https://github.com/BrianSigafoos/micrograd/blob/master/micrograd_youtube1.ipynb).
- Two more complete [notebooks for both parts of the micrograd video](https://github.com/Anri-Lombard/micrograd/tree/main/Lectures) by Github user @Anri-Lombard.

Everything needed to understand a neural network is in [micrograd](https://github.com/karpathy/micrograd). Everything else is just efficiency.
There are only 150 lines of code in `micrograd/engine.py` and `micrograd/nn.py`.

"Back propagation is recursive application of chain rule, backwards through the computation graph."

If can write local gradients and can do backward propagation of gradients, then it doesn't matter if it's a compound function or separate functions (equal to compound function), the result will be the same.

`micrograd` is for scalar values (1.0, etc)
PyTorch is for a tensor, an n-dimensional array of scalars

Gradient descent is the iteration of:

- forward pass
- backward pass
- update

The neural net improved its predictions with each iteration.

Most common neural net mistakes from [@karpathy's tweet](https://twitter.com/karpathy/status/1013244313327681536):

1. you didn't try to overfit a single batch first.
2. you forgot to toggle train/eval mode for the net.
3. you forgot to .zero_grad() (in pytorch) before .backward().
4. you passed softmaxed outputs to a loss that expects raw logits.
5. you didn't use bias=False for your Linear/Conv2d layer when using BatchNorm, or conversely forget to include it for the output layer. This one won't make you silently fail, but they are spurious parameters
6. thinking view() and permute() are the same thing (& incorrectly using view)

{{< tweet user="karpathy" id="1013244313327681536" >}}

## References

YouTube playlist: [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

YouTub videos:

- 1. [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- 2. [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- ...

Github repos:

- [micrograd](https://github.com/karpathy/micrograd) - A tiny scalar-valued autograd engine and a neural net library on top of it with PyTorch-like API
- [makemore](https://github.com/karpathy/makemore) - An autoregressive character-level language model for making more things

### Lecture notes by others

- <https://github.com/Anri-Lombard/micrograd>
- <https://github.com/Anri-Lombard/makemore>
