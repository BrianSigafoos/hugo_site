---
date: 2022-12-21T06:33:18-05:00
slug: ml-quick-start
title: Machine Learning quick start
summary: How to set up your Python development environment for ML and go from newbie to published ML model using fastai, Hugging Face, and Gradio
collection_swe_toolbox: true
---

## Intro

This "quick start" is based on the excellent [`fast.ai` course](https://course.fast.ai/).

Follow these steps go from a machine without Python and no knowledge of Machine Learning to a working, published model.

Here's mine:

- Published demo classifier app: <https://briansigafoos-fastai-trees.hf.space/>
- Source code: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

## Development setup

Install python using `mamba` (same as `condo`, but faster C++ implementation). Use `mamba` instead of `pip`, because it should lead to better performance with ML packages.

```shell
# https://github.com/fastai/fastai/
mamba install -c fastchan fastai

# Jupyter notebooks
# https://github.com/jupyter/notebook
mamba install -c fastchan notebook

# Start notebook, will auto-open in web browser
jupyter notebook
```

Personally, I prefer using [VSCode](https://code.visualstudio.com/) for everything including viewing and running Jupyter Notebooks, so you can likely skip that last `jupyter notebook` step.

## Create a Hugging Face account

Go to [Hugging Face](https://huggingface.co/) and create an account.

Then create a [new Space](https://huggingface.co/new-space) and select Gradio (other options: MIT license, Public)

Then `git clone` that space to your local machine, following the instructions.

Install the Hugging Face CLI

```shell
mamba install -c fastchan huggingface_hub

# Log in to HF so you can `git push` your changes to your repo
huggingface-cli login
```

## Watch the fast.ai lessons

- Watch lessons 1 and lesson 2 especially: <https://course.fast.ai/Lessons/lesson2.html>

## Build a simple classifier model

See `model.ipynb` in my demo classifier for reference: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

Once you run the model in your code locally, and output the `model.pkl` file

This is a good time to make sure you have [`git-lfs`](https://git-lfs.com/) set up:

```shell
# Install git-lfs
brew install git-lfs

git lfs install
git lfs track "*.pkl"
git add .gitattributes
git commit -m "update .gitattributes so git lfs will track .pkl files"
```

## Build a Gradio app

See `app.ipynb` to go from your output `model.pkl` to a published classifier

Make sure you have `nbdev` installed. This will help turn a working Jupyter notebook into an `app.py` file that the Hugging Face space will use to power your app using Gradio.

```shell
# https://github.com/fastai/nbdev/
mamba install -c fastchan nbdev
```

Note all the comments that start with `#|` in my `app.ipynb` file: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

Everything with `#|export` will be dumped into your `app.py` file.

Once you `git push` these changes, including your `app.py` that is outputted by `nb_export` (see last cell in `app.ipynb`), you should have your app now published and running on Hugging Face Spaces.

## Use the Hugging Face API backend with your own frontend

One of the best Hugging Face features, that I've seen so far, is the ability to use it's API backend with your own frontend.

Coming soon...

## References

- [fast.ai course](https://course.fast.ai/)
- [Hugging Face Quick Start](https://huggingface.co/docs/huggingface_hub/quick-start)
- [Gradio app docs](https://gradio.app/docs/)
