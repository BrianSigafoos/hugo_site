---
date: 2022-12-29T13:10:34-05:00
slug: ml-snippets
title: ML snippets
summary: Snippets of code for getting started with Machine Learning
collection_swe_toolbox: true
---

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

competition = "titanic"
iskaggle = os.environ.get("KAGGLE_KERNEL_RUN_TYPE", "")

if iskaggle:
    path = Path(f"../input/{competition}")
else:
    import kaggle

    # Use .data folder that will be .gitignore
    path = Path(".data")

    if not path.exists():
        import zipfile

        kaggle.api.competition_download_cli(competition=competition, path=str(path))
        zipfile.ZipFile(f"{path}/{competition}.zip").extractall(path)

print(f"Ready for competition: {competition}")
```
