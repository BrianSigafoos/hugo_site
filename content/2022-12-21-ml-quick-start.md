---
date: 2022-12-21T06:33:18-05:00
slug: ml-quick-start
title: Machine Learning quick start
summary: How to set up your Python development environment for ML and go from newbie to published ML model using fastai, Hugging Face, and Gradio
collection_swe_toolbox: true
---

## Intro

This "quick start" is based on the outstanding course by fast.ai [Practical Deep Learning for Coders](https://course.fast.ai).

Follow these steps go from a machine without Python and no prior knowledge of Machine Learning to a working demo app.

Here's mine:

- Published classifier app: <https://briansigafoos-fastai-trees.hf.space/>
- Source code: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

## Development setup

Install python using `mamba`. Anywhere you instructions for `condo`, you can use `mamba` instead. It's a faster C++ implementation. Why not `pip`? It's recommended to use `mamba` instead to correctly download ML packages optimized to use your machine's GPU.

```shell
# https://github.com/fastai/fastai/
mamba install -c fastchan fastai

# Jupyter notebooks
# https://github.com/jupyter/notebook
mamba install -c fastchan notebook

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

## Watch the fast.ai lessons

- Watch lessons 1 and lesson 2 especially: <https://course.fast.ai/Lessons/lesson2.html>

## Build a simple classifier model

See `model.ipynb` in my demo classifier for reference: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

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

## Build a Gradio app

See `app.ipynb` to go from your output `model.pkl` to a published classifier app.

Make sure you have `nbdev` installed. This will help turn a working Jupyter notebook into an `app.py` file that the Hugging Face space will use to power your app using Gradio.

```shell
# https://github.com/fastai/nbdev/
mamba install -c fastchan nbdev
```

Note all the comments that start with `#|` in the `app.ipynb` file: <https://huggingface.co/spaces/BrianSigafoos/fastai_trees/tree/main>

Everything with `#|export` will be dumped into your `app.py` file.

Once you `git push` these changes, including the generated `app.py` (from the `nb_export` cell), you should have your app now published and running on Hugging Face Spaces.

## Use the Hugging Face API backend with your own frontend

One of the best Hugging Face features, that I've seen so far, is the ability to use it's API backend with your own frontend.

From the bottom of your running app, click "Use the API" to bring up the API instructions. For example, from my demo app: <https://briansigafoos-fastai-trees.hf.space/?view=api>

### Live Demo of JS Frontend for Hugging Face API backend

<input id="predict_photos" type="file" multiple="" />
<div id="predict_results"></div>

<script>
  HF_PREDICT_ENDPOINT = 'https://briansigafoos-fastai-trees.hf.space/run/predict/'

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
        const prediction = json['data'][0]['confidences'][0]
        const alternatePrediction = json['data'][0]['confidences'][1]
        const div = document.createElement('div')
        div.innerHTML = `
              <img class="prediction" src="${reader.result}" width="300">
              <p>
                ${prediction['label']} - ${parseFloat(prediction['confidence'] *100).toFixed(2)}%
(${alternatePrediction['label']} - ${parseFloat(alternatePrediction['confidence']* 100).toFixed(2)}%)
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

### Code for JS frontend demo above

The entirety of the demo above is powered by this frontend Javascript (and 2 lines of HTML):

```html
<input id="predict_photos" type="file" multiple="" />
<div id="predict_results"></div>

<script>
  // Replace with your Predict endpoint
  HF_PREDICT_ENDPOINT = 'https://briansigafoos-fastai-trees.hf.space/run/predict/'

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
        const prediction = json['data'][0]['confidences'][0]
        const alternatePrediction = json['data'][0]['confidences'][1]
        const div = document.createElement('div')
        div.innerHTML = `
              <img class="prediction" src="${reader.result}" width="300">
              <p>
                ${prediction['label']} - ${parseFloat(prediction['confidence'] * 100).toFixed(2)}%
                (${alternatePrediction['label']} - ${parseFloat(alternatePrediction['confidence'] * 100).toFixed(2)}%)
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
