---
date: 2022-12-21T06:33:18-05:00
slug: ml-quick-start
title: Machine Learning quick start
summary: Learn how to quickly get started using fastai, Hugging Face, and Gradio to deploy a demo ML app
collection_swe_toolbox: true
---

## Intro

This "quick start" is based on the outstanding course by fast.ai: [Practical Deep Learning for Coders](https://course.fast.ai).

Follow these steps to properly install Python and deploy a demo ML app on Hugging Face, using Gradio.

Here's my example demo app: [tree leaf classifier app](https://briansigafoos-fastai-trees.hf.space) ([source code](https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main))

## Development setup

Install Python using [mamba](https://mamba.readthedocs.io). Anywhere you see instructions for `conda`, you can use `mamba` instead (it's faster). Why not `pip`? If you're doing ML, `mamba`/`conda` makes it easier to have everything you need (including Python), and to optimize packages for your GPU.

```shell
# First:
# Install mamba for your machine: https://github.com/conda-forge/miniforge#mambaforge
# Or use this script: https://github.com/fastai/fastsetup/blob/master/setup-conda.sh

# Then:
# https://github.com/fastai/fastai/
mamba install -y -c fastchan fastai

# Jupyter notebooks
# https://github.com/jupyter/notebook
mamba install -y -c fastchan notebook jupyter ipywidgets

# Start notebook, will auto-open in web browser
jupyter notebook
```

Personally, I prefer using [VSCode](https://code.visualstudio.com/) for viewing, editing, and running Jupyter Notebooks. So, you can skip that last `jupyter notebook` step above.

## Create a Hugging Face account

Go to [Hugging Face](https://huggingface.co/) and create an account.

Then create a [new Space](https://huggingface.co/new-space) and select Gradio (other options: MIT license, Public)

Then `git clone` your new space to your local machine, following their instructions.

Next, install the Hugging Face CLI.

```shell
mamba install -c fastchan huggingface_hub

# Log in to HF so you can `git push` your changes to your repo
huggingface-cli login
```

## Watch the fast.ai course lessons

From [Practical Deep Learning for Coders](https://course.fast.ai), watch lesson 1 and [lesson 2](https://course.fast.ai/Lessons/lesson2.html) especially.

## Train a simple classifier model

See `train.ipynb` in my demo classifier for reference: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

Once you run the model in your code locally, and output the `model.pkl` file you'll be ready to run `app.ipynb`, and use that outputted model.

But first, this is a good time to make sure you have [`git-lfs`](https://git-lfs.com/) set up:

```shell
# Install git-lfs
brew install git-lfs

git lfs install
git lfs track "*.pkl"
git add .gitattributes
git commit -m "update .gitattributes so git lfs will track .pkl files"
```

## Launch a Gradio app

See `app.ipynb` to go from your output `model.pkl` to a published classifier app.

Make sure you have `nbdev` installed. This will help turn a working Jupyter notebook into an `app.py` file that the Hugging Face space will use to power your app using Gradio.

```shell
# https://github.com/fastai/nbdev/
mamba install -c fastchan nbdev
```

Note all the comments that start with `#|` in the `app.ipynb` file: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

Everything with `#|export` will be dumped into your `app.py` file.

Once you `git push` these changes, including the generated `app.py` (from the `nb_export` cell), you should have your app now published and running on Hugging Face Spaces.

## Use the Hugging Face API backend

A great Hugging Face feature is the ability to use it's API backend with your own frontend.

From the bottom of your running app, click "Use the API" to bring up the API instructions. For example, from my demo app: <https://briansigafoos-fastai-trees.hf.space/?view=api>

### Live demo

Select one or many images of a tree leaves. Ideally, pick of these 5 types of tree leaves that this demo model has been trained on:
ash, chestnut, ginkgo biloba, silver maple, or willow oak.

<input id="predict_photos" type="file" multiple="" />
<div id="predict_results"></div>

<script>
  // Replace with your own HF Space's /predict endpoint
  HF_PREDICT_ENDPOINT =
    'https://briansigafoos-fastai-trees.hf.space/run/predict/'

  async function get_pred(file) {
    return new Promise(async (resolve) => {
      const reader = new FileReader()
      reader.onload = async () => {
        data = JSON.stringify({ data: [reader.result] })
        post = {
          method: 'POST',
          body: data,
          headers: { 'Content-Type': 'application/json' }
        }
        const response = await fetch(HF_PREDICT_ENDPOINT, post)
        const json = await response.json()
        const results = json['data'][0]
        const prediction = results['confidences'][0]
        const predictionConfidence = parseFloat(
          prediction['confidence'] * 100
        ).toFixed(2)
        const altPrediction = results['confidences'][1]
        const altPredictionConfidence = parseFloat(
          altPrediction['confidence'] * 100
        ).toFixed(2)
        const div = document.createElement('div')
        div.innerHTML = `
          <img class="prediction" src="${reader.result}" width="300">
          <p>
            ${prediction['label']} - ${predictionConfidence}%
            (${altPrediction['label']} - ${altPredictionConfidence}%)
          </p>
        `
        predict_results.append(div)
        return resolve(prediction)
      }
      reader.readAsDataURL(file)
    })
  }

  predict_photos.addEventListener('input', async () => {
    predict_results.innerHTML = ''
    await Promise.allSettled([...predict_photos.files].map(get_pred))
  })
</script>

### Code for demo above

Below is the Javascript (and HTML) that fully powers the demo above, using the Hugging Face backend API to return the results.

```html
<input id="predict_photos" type="file" multiple="" />
<div id="predict_results"></div>

<script>
  // Replace with your own HF Space's /predict endpoint
  HF_PREDICT_ENDPOINT =
    'https://briansigafoos-fastai-trees.hf.space/run/predict/'

  async function get_pred(file) {
    return new Promise(async (resolve) => {
      const reader = new FileReader()
      reader.onload = async () => {
        data = JSON.stringify({ data: [reader.result] })
        post = {
          method: 'POST',
          body: data,
          headers: { 'Content-Type': 'application/json' }
        }
        const response = await fetch(HF_PREDICT_ENDPOINT, post)
        const json = await response.json()
        const results = json['data'][0]
        const prediction = results['confidences'][0]
        const predictionConfidence = parseFloat(
          prediction['confidence'] * 100
        ).toFixed(2)
        const altPrediction = results['confidences'][1]
        const altPredictionConfidence = parseFloat(
          altPrediction['confidence'] * 100
        ).toFixed(2)
        const div = document.createElement('div')
        div.innerHTML = `
          <img class="prediction" src="${reader.result}" width="300">
          <p>
            ${prediction['label']} - ${predictionConfidence}%
            (${altPrediction['label']} - ${altPredictionConfidence}%)
          </p>
        `
        predict_results.append(div)
        return resolve(prediction)
      }
      reader.readAsDataURL(file)
    })
  }

  predict_photos.addEventListener('input', async () => {
    predict_results.innerHTML = ''
    await Promise.allSettled([...predict_photos.files].map(get_pred))
  })
</script>
```

The snippet above is based on this code in [`fastai/tinypets`](https://github.com/fastai/tinypets/blob/638528a157fef9d7a1951dcd31592f19ddbe28d6/3parallel.html) for parallel predictions.

## References

- [fast.ai course](https://course.fast.ai/)
- [Hugging Face Quick Start](https://huggingface.co/docs/huggingface_hub/quick-start)
- [Gradio app docs](https://gradio.app/docs/)
