---
date: 2022-12-29T13:10:34-05:00
slug: ml-snippets
title: ML snippets
summary: Snippets of code for getting started with machine learning, using PyTorch, Pandas, Numpy, and Kaggle
collection_swe_toolbox: true
---

## Tips and approaches

- For tabular data, start with a [random forest](https://en.wikipedia.org/wiki/Random_forest). This helps get quick insight into the data and establish a base case, before moving on to deep learning approaches. Also they are nearly impossible to screw up, according to J. Howard from fastai.
- Split up data into 3 splits:
  1. training split - 80% - used by model to tune itself in backpropagation
  2. dev/validation split - 10% - used to tune hyperparameters
  3. test split - 10% - never used to tune model, only used at end

## Fill NaN with modes using pandas

Before and after filling with the modes, run this in a cell:

```python
df.isna().sum()
```

Fill with the modes:

```python
# Get the modes for the data frame
modes = df.mode().iloc[0]

# Fill NaN values
# https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.fillna.html
df.fillna(modes, inplace=True)
```

## Use Apple's Mac M1/M2 GPU's

```python
# https://pytorch.org/docs/stable/notes/mps.html
if not torch.backends.mps.is_available():
    if not torch.backends.mps.is_built():
        print(
            "MPS not available because the current PyTorch install was not "
            "built with MPS enabled."
        )
    else:
        print(
            "MPS not available because the current MacOS version is not 12.3+ "
            "and/or you do not have an MPS-enabled device on this machine."
        )

else:
    print("MPS is available. Setting as default device.")
    mps_device = torch.device("mps")

    # Set fastai's `default_device()` to MPS
    # https://github.com/fastai/fastai/blob/0d952d3c234629ec6d6a909186e79af3c5a9a1b8/fastai/torch_core.py#L271
    try:
        default_device(mps_device)
    except:
        print("default_device() is not defined. Did you import `fastai`?")

```

## Kaggle competition snippet

Use this snippet at the top of Kaggle notebooks and non-Kaggle hosted notebooks.

```python
import os
from pathlib import Path

competition = "titanic"  # Change this to any Kaggle competition name
iskaggle = os.environ.get("KAGGLE_KERNEL_RUN_TYPE", "")

if iskaggle:
    path = Path(f"../input/{competition}")
else:
    import kaggle

    # Use .kaggle_data folders that will be gitignored
    path = Path(".kaggle_data")

    if not path.exists():
        import zipfile

        kaggle.api.competition_download_cli(competition=competition, path=str(path))
        zipfile.ZipFile(f"{path}/{competition}.zip").extractall(path)

print(f"Ready for competition: {competition}")
```

## Resources

- [Pandas iloc and loc – quickly select rows and columns in DataFrames](https://www.shanelynn.ie/pandas-iloc-loc-select-rows-and-columns-dataframe/)
