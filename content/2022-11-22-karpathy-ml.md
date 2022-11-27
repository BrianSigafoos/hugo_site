---
date: 2022-11-22T12:42:54-05:00
slug: neural-networks-karpathy
title: Learn Neural Networks with Andrej Karpathy
summary: "Notes from Karpathy's machine learning lectures - Neural Networks: Zero to Hero"
collection_swe_toolbox: true
---

## Intro

These are my notes from the [Andrej Karpathy](https://twitter.com/Karpathy) lecture series: [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ). Andrej is the former Director of AI at Tesla and an excellent teacher. He demystifies complex ML topics like gradient descent through simple examples. When following these videos, I recommend recreating everything Andrej covers on your local machine. It help me practice and build confidence that from simple building blocks we can build up powerful models.

YouTube playlist: [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

YouTube videos:

- 1. [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- 2. [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- 3. Coming soon
- ...

Github repos:

- [micrograd](https://github.com/karpathy/micrograd) - A tiny scalar-valued autograd engine and a neural net library on top of it with PyTorch-like API
- [makemore](https://github.com/karpathy/makemore) - An autoregressive character-level language model for making more things
- [notebooks: nn-zero-to-hero](https://github.com/karpathy/nn-zero-to-hero) - Lecture notebooks to run locally

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

Code source: [micrograd](https://github.com/karpathy/micrograd)

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

## 2. Makemore part 1: bigram character-level language model

Watch the YouTube video: [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ).

Code source: [makemore](https://github.com/karpathy/makemore)

Every line in `makemore/names.txt` is an example. Each example is a sequence of characters.
We're building a character level language model. It knows how to predict the next character in the sequence.

As noted in the video, it's important to learn more about [Broadcasting semantics](https://pytorch.org/docs/stable/notes/broadcasting.html?highlight=broadcasting).

This lecture let's us train a bigram language model.

### Setup code

```python
# Setup - common to both approaches
import torch

# data set: 32k first names
words = open('names.txt', 'r').read().splitlines()
chars = sorted(list(set(''.join(words))))

# s to i lookup, setting `.` as 0 index in array and all others + 1
# we'll use `.` to mark the start and end of all words
stoi = {s: i+1 for i, s in enumerate(chars)}
stoi['.'] = 0

# i to s lookup
itos = {i: s for s, i in stoi.items()}
```

### Non-neural network approach

We start training it by counting how frequently any pairing of letters occurs in ~32k names, and then normalizing so we get a nice probability distribution.

```python
# Approach 1: non-neural network approach: count frequency of bigrams and store in `N`
#
# Create a 27x27 matrix with values all set to 0
N = torch.zeros((27, 27), dtype=torch.int32)

# Get the counts
for w in words:
  # use `.` to mark the start and end of all words
  chs = ['.'] + list(w) + ['.']
  for ch1, ch2 in zip(chs, chs[1:]):
    # integer index of this character in stoi 0-27
    ix1 = stoi[ch1]
    ix2 = stoi[ch2]
    N[ix1, ix2] += 1

# prepare probabilities, parameters of our bigram language model
# Apply "model smoothing" using `N + 1` instead of `N`. This prevents 0's in probability matrix P, which could lead to `infinity` for loss measurement.
P = (N + 1).float()
# 27, 27
# 27, 1  # This is "broadcastable" and it stretches the 1 into all 27 rows
# https://pytorch.org/docs/stable/notes/broadcasting.html?highlight=broadcasting

# Below uses `/=` to avoid creating new tensor, ie more efficient
P /= P.sum(1, keepdim=True)

g = torch.Generator().manual_seed(2147483647)
```

```python
# Sample
for i in range(5):
  out = []
  ix = 0
  while True:
    p = P[ix]

    ix = torch.multinomial(p, num_samples=1, replacement=True, generator=g).item()
    out.append(itos[ix])
    # Break with `.` is found, marking the end of the word
    if ix == 0:
      break

  print(''.join(out))

# Output:
#   mor.
#   axx.
#   minaymoryles.
#   kondlaisah.
#   anchshizarie.
```

### Loss function

Then we can evaluate the quality of this model.

Goal: summarize probabilities into a single number that measure the quality of this model.

```python
# Goal: summarize probabilities into a single number that measure the quality of this model
log_likelihood = 0.0
n = 0

for w in words:
  # for w in ["andrejq"]:
  chs = ['.'] + list(w) + ['.']
  for ch1, ch2 in zip(chs, chs[1:]):
    ix1 = stoi[ch1]
    ix2 = stoi[ch2]
    prob = P[ix1, ix2]
    logprob = torch.log(prob)
    # This is because: log(a*b*c) = log(a) + log(b) + log(c)
    log_likelihood += logprob
    n += 1
    print(f'{ch1}{ch2}: {prob:.4f} {logprob:.4f}')

print(f'{log_likelihood=}')
# negative log likelihood is a nice loss function.
# The lowest it can get is 0. The higher it is, the worse off the predictions
# you are making are.
nll = -log_likelihood
print(f'{nll=}')
# Above was the sum negative log likelihood. Better is the average negative log likelihood.
# So divide that sum by `n` to get the average.
# So the loss function for the training set assigned by this model is 2.4. That's the "quality" of this model.
# The lower it is the better off we are. The higher it is the worse off we are.
print(f'{nll/n}')

# Output:
#   log_likelihood=tensor(-559951.5625)
#   nll=tensor(559951.5625)
#   2.4543561935424805
```

### Neural network approach

```python
# Approach 2: neural network approach trained on bigrams

# for one hot encoding: `F.one_hot` below
import torch.nn.functional as F

#
# Dataset: 228K bigrams from the 32K example names
#
xs, ys = [], []
for w in words:
  chs = ['.'] + list(w) + ['.']
  for ch1, ch2 in zip(chs, chs[1:]):
    ix1 = stoi[ch1]
    ix2 = stoi[ch2]
    xs.append(ix1)
    ys.append(ix2)
xs = torch.tensor(xs)
ys = torch.tensor(ys)
num = xs.nelement()
print('number of examples: ', num)

# initialize the 'network'
g = torch.Generator().manual_seed(2147483647)
W = torch.randn((27, 27), generator=g, requires_grad=True)
```

Gradient descent

```python
# Gradient descent
for k in range(100):

  # forward pass
  # input to the network: one-hot encoding
  xenc = F.one_hot(xs, num_classes=27).float()
  logits = xenc @ W  # predict log-counts
  counts = logits.exp()  # counts, equivalent to N
  # probabilities for next character
  probs = counts / counts.sum(1, keepdims=True)
  # regularization loss: `0.01*(W**2).mean()` tries to make all W's 0
  # if `0.01` is higher it will be more uniform and not
  loss = -probs[torch.arange(num), ys].log().mean() + 0.01 * (W**2).mean()
  print(loss.item())

  # backward pass
  W.grad = None  # set to zero the gradient
  loss.backward()

  # update
  W.data += -50 * W.grad

# Earlier we had 2.47 loss when we manually did the counts.
# So we'd like this neural network approach to become as "good", when measuring the loss.
```

```python
# Sample from neural net model
g = torch.Generator().manual_seed(2147483647)

for i in range(5):

  out = []
  ix = 0
  while True:

    xenc = F.one_hot(torch.tensor([ix]), num_classes=27).float()
    logits = xenc @ W  # predict log-counts
    counts = logits.exp()  # counts, equivalent to N
    p = counts / counts.sum(1, keepdims=True) # probabilities for next character

    ix = torch.multinomial(p, num_samples=1, replacement=True, generator=g).item()
    out.append(itos[ix])
    if ix == 0:
      break
  print(''.join(out))

  # Output:  almost identical to approach 1 non-neural network with count frequencies
  #   mor.
  #   axx.
  #   minaymoryles.
  #   kondlaisah.
  #   anchshizarie.
```

## 3. Makemore part 2: MLP

Watch the YouTube video: [Building makemore Part 2: MLP](https://www.youtube.com/watch?v=TCH_1BHY58I&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ).

A multilayer perceptron (MLP) character-level language model.

Original paper: ["A Neural Probabilistic Language Model, Bengio et al. 2003"](https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf)

We can embed all of the integers in `X` as `C[X]` thanks to PyTorch multi dimensional indexing.

We want to randomly select some portion of the dataset, the minibatch. Then only forward, backward, and update on that minibatch.

What's the right learning rate? [Video](https://youtu.be/TCH_1BHY58I?t=2798)

```python
lre = torch.linspace(-3, 0, 1000)
lrs = 10**lre

lri = []
# ...

  # Inside gradient descent
  lr = lrs[i]

  # track stats
  #lri.append(lre[i])
  stepi.append(i)
  lossi.append(loss.log10().item())

# To get visualization
plt.plot(stepi, lossi)
```

Split up data into 3 splits:

- 1. training split - 80%
- 2. dev/validation split - 10%
- 3. test split - 10%

We use the training split to optimize the parameters of the model, like we're doing using gradient descent.

Use the dev/validation split to train the hyperparameters.

Use the test split to evaluate the performance of the model at the end. We should rarely use the test split to avoid overfitting to it and learning from it.

```python
# Build dataset
block_size = 3 # context length: how many characters do we take to predict the next one?

def build_dataset(words):
  X, Y = [], []
  for w in words:

    # print(w)
    context = [0] * block_size
    for ch in w + '.':
      ix = stoi[ch]
      X.append(context)
      Y.append(ix)
      # print(''.join(itos[i] for i in context), '--->', itos[ix])
      context = context[1:] + [ix] # crop and append

  X = torch.tensor(X)
  Y = torch.tensor(Y)
  print(X.shape, Y.shape)
  return X, Y


import random
random.seed(42)
random.shuffle(words)
# Get n1 and n2 to help us split up the words into 3 splits.
n1 = int(0.8*len(words))
n2 = int(0.9*len(words))

# Split up data into 3 splits:
# - 1. training split - 80%
# - 2. dev/validation split - 10%
# - 3. test split - 10%
Xtr, Ytr = build_dataset(words[:n1])     # 0   -  80% of randomized words
Xdev, Ydev = build_dataset(words[n1:n2]) # 80% -  90% of randomized words
Xte, Yte = build_dataset(words[n2:])     # 90% - 100% of randomized words
```

```python
# Training
for i in range(200000):

  # minibatch construct
  ix = torch.randint(0, Xtr.shape[0], (32,))

  # forward pass
  emb = C[Xtr[ix]] # (32, 3, 10)
  h = torch.tanh(emb.view(-1, 30) @ W1 + b1) # (32, 200)
  logits = h @ W2 + b2 # (32, 27)
  loss = F.cross_entropy(logits, Ytr[ix])
  # print(loss.item())

  # backward pass
  for p in parameters:
    p.grad = None
  loss.backward()

  # update
  # lr = lrs[i]
  lr = 0.1 if i < 100000 else 0.01
  for p in parameters:
    p.data += -lr * p.grad

  # track stats
  # lri.append(lre[i])
  stepi.append(i)
  lossi.append(loss.log10().item())

# print(loss.item())
```

```python
# Evaluate
def calc_loss(x_dataset, y_dataset):
  emb = C[x_dataset]  # (32, 3, 2)
  h = torch.tanh(emb.view(-1, 30) @ W1 + b1) # (32, 100)
  logits = h @ W2 + b2 # (32, 27)
  loss = F.cross_entropy(logits, y_dataset)
  return loss

# Calculate loss of training set
calc_loss(Xtr, Ytr)

# Calculate loss of dev/evaluation set
calc_loss(Xdev, Ydev)
```

Underfitting - the loss function for the training split is similar to the dev/validation split. Likely too few parameters and the model isn't powerful enough to

Iterating the model:

- Runs lots of experiments changing hyperparameters (learning rate, minibatch size, etc) on dev set and slowly scrutinize which ones give the best dev performance
- Then run 1x on the test set and that's the loss rate number that matters when publishing, sharing results of the model.

## PyTorch Tips

PyTorch [docs](https://pytorch.org/docs/stable/torch.html)

### Tensor Views - [docs](https://pytorch.org/docs/stable/tensor_view.html)

PyTorch allows a tensor to be a View of an existing tensor. View tensor shares the same underlying data with its base tensor. Supporting View avoids explicit data copy, thus allows us to do fast and memory efficient reshaping, slicing and element-wise operations.

```python
t = torch.arange(8)
print(t)
print(t.view(2, 4))

# Output:
#   tensor([0, 1, 2, 3, 4, 5, 6, 7])
#   tensor([[0, 1, 2, 3],
#           [4, 5, 6, 7]])
```

### `F.cross_entropy` - [docs](https://pytorch.org/docs/stable/generated/torch.nn.functional.cross_entropy.html?highlight=cross_entropy#torch.nn.functional.cross_entropy)

Instead of hand rolling the commented out code below, calling `F.cross_entropy` makes the forward and backward passes much more efficient.

```python
# counts = logits.exp()
# prob = counts / counts.sum(1, keepdimes=True)
# loss = -prob[torch.arange(32), Y].log().mean()

# Replaced efficiently with:
F.cross_entropy(logits, Y)
```

## References

YouTube playlist: [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)

YouTube videos:

- 1. [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- 2. [The spelled-out intro to language modeling: building makemore](https://www.youtube.com/watch?v=PaCmpygFfXo&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- ...

Github repos:

- [micrograd](https://github.com/karpathy/micrograd) - A tiny scalar-valued autograd engine and a neural net library on top of it with PyTorch-like API
- [makemore](https://github.com/karpathy/makemore) - An autoregressive character-level language model for making more things

### More lecture notes

- <https://github.com/karpathy/nn-zero-to-hero>
- <https://github.com/Anri-Lombard/micrograd>
- <https://github.com/Anri-Lombard/makemore>
