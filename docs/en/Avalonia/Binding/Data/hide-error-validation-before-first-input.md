---
tags:
    - Avalonia
    - Binding
    - Data
    - Data Validation
---

# Hide Data Validation Errors Before First Input

You can provide an invisible character as the initial value for the data, and remove this character when the input is clicked (or focused).

!!! Tip
    In most cases, a space is sufficient.

!!! Tip
    Remember to remove all invisible characters from the input fields before submission.

Available invisible characters:

| Name                          |  Code  |    Entity Name     | Symbol | Notes                                                  |
| ----------------------------- | :----: | :----------------: | :----: | ------------------------------------------------------ |
| Zero Width Space              | U+200B | `&ZeroWidthSpace;` |  `​`   | Recommended                                            |
| Zero Width Non-joiner         | U+200C |      `&zwnj;`      |  `‌`   | Not recommended, sticks to the previous character      |
| Zero Width Joiner             | U+200D |      `&zwj;`       |  `‍`   | Not recommended for inputs allowing English characters |
| Word Joiner                   | U+2060 |    `&NoBreak;`     |  `⁠`   | Not recommended for inputs allowing English characters |
| Zero Width Non-breaking Space | U+FEFF |        ---         |  `﻿`   | Not recommended as non-breaking indicators             |
