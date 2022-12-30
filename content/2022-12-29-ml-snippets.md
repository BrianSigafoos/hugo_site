---
date: 2022-12-29T13:10:34-05:00
slug: ml-snippets
title: ML snippets
summary: Snippets of code for getting started with Machine Learning
collection_swe_toolbox: true
---


### Kaggle snippet

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
